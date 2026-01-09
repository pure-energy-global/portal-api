import { EnvironmentVariableDataSource } from "../../../_shared/data/datasource/EnvironmentVariableDataSource.ts";
import { GetRemoteConfigUseCase } from "./GetRemoteConfigUseCase.ts";
import { StringToFormSubmissionDataModelMapper } from "../../data/mapper/StringToFormSubmissionDataModelMapper.ts";
import { StringToHmacSignatureMapper } from "../../data/mapper/StringToHmacSignatureMapper.ts";
import { TALLY_EVENT_TYPE, TALLY_SIGNATURE_HEADER } from "../../config.ts";

export class IsWebhookFromTallyUseCase {
    constructor(
        private readonly getRemoteConfigUseCase: GetRemoteConfigUseCase = new GetRemoteConfigUseCase(),
        private readonly stringToFormSubmissionMapper: StringToFormSubmissionDataModelMapper = new StringToFormSubmissionDataModelMapper(),
        private readonly stringToHmacSignatureMapper: StringToHmacSignatureMapper = new StringToHmacSignatureMapper(),
        private readonly tallySigningSecret: string = EnvironmentVariableDataSource("TALLY_SIGNING_SECRET") || ""
    ) { }

    async execute(headers: Record<string, string | undefined>, payload: string): Promise<boolean> {
        // Step 1: Verify Tally Signature is present
        if (!headers[TALLY_SIGNATURE_HEADER]) {
            console.warn("Missing Tally signature header");
            return false;
        }

        // Step 2: Verify Tally Signature matches expected HMAC signature
        const calculatedSignature = this.stringToHmacSignatureMapper.map(payload, this.tallySigningSecret);
        const givenSignature = headers[TALLY_SIGNATURE_HEADER];

        if (calculatedSignature !== givenSignature) {
            console.warn("Tally signature mismatch");
            return false;
        }

        // Step 3: Verify the given schema matches the schema on record
        const schema = this.stringToFormSubmissionMapper.map(payload);

        // Step 4: Verify event type is correct
        if (schema.eventType !== TALLY_EVENT_TYPE) {
            console.warn("Tally event type mismatch");
            return false;
        }

        // Step 5: Verify form ID is correct
        const config = await this.getRemoteConfigUseCase.execute();

        if (config.formId !== schema.data.formId) {
            console.warn("Tally form ID mismatch");
            return false;
        }

        return true;
    }
}
