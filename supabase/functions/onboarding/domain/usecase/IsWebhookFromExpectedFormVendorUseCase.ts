import { EnvironmentVariableDataSource } from "../../../_shared/data/datasource/EnvironmentVariableDataSource.ts";
import { GetRemoteConfigUseCase } from "./GetRemoteConfigUseCase.ts";
import { StringToFormSubmissionDataModelMapper } from "../../data/mapper/StringToFormSubmissionDataModelMapper.ts";
import { StringToHmacSignatureMapper } from "../../data/mapper/StringToHmacSignatureMapper.ts";
import { FORM_EVENT_TYPE, FORM_SIGNING_SIGNATURE_HEADER } from "../../config.ts";

export class IsWebhookFromExpectedFormVendorUseCase {
    constructor(
        private readonly getRemoteConfigUseCase: GetRemoteConfigUseCase = new GetRemoteConfigUseCase(),
        private readonly stringToFormSubmissionMapper: StringToFormSubmissionDataModelMapper = new StringToFormSubmissionDataModelMapper(),
        private readonly stringToHmacSignatureMapper: StringToHmacSignatureMapper = new StringToHmacSignatureMapper(),
        private readonly signingSecret: string = EnvironmentVariableDataSource("FORM_SIGNING_SECRET") || ""
    ) { }

    async execute(headers: Record<string, string | undefined>, payload: string): Promise<boolean> {
        // Step 1: Verify signature header is present
        if (!headers[FORM_SIGNING_SIGNATURE_HEADER]) {
            console.warn("Missing signature header");
            return false;
        }

        // Step 2: Verify signature matches expected HMAC signature
        const calculatedSignature = this.stringToHmacSignatureMapper.map(payload, this.signingSecret);
        const givenSignature = headers[FORM_SIGNING_SIGNATURE_HEADER];

        if (calculatedSignature !== givenSignature) {
            console.warn("Signature mismatch");
            return false;
        }

        // Step 3: Verify the given schema matches the schema on record
        const schema = this.stringToFormSubmissionMapper.map(payload);

        // Step 4: Verify event type is correct
        if (schema.eventType !== FORM_EVENT_TYPE) {
            console.warn("Form event type mismatch");
            return false;
        }

        // Step 5: Verify form ID is correct
        const config = await this.getRemoteConfigUseCase.execute();

        if (config.formId !== schema.data.formId) {
            console.warn("Form ID mismatch");
            return false;
        }

        return true;
    }
}
