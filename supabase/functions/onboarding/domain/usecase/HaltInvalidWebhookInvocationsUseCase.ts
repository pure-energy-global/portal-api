import { FORM_EVENT_TYPE, FORM_SIGNATURE_HEADER, FORM_SIGNING_SECRET } from "../../config.ts";
import { GetRemoteConfigUseCase } from "./GetRemoteConfigUseCase.ts";
import { NotAValidFormSubmissionError } from "../model/NotAValidFormSubmissionError.ts";
import { StringToFormSubmissionDataModelMapper } from "../../data/mapper/StringToFormSubmissionDataModelMapper.ts";
import { StringToHmacSignatureMapper } from "../../data/mapper/StringToHmacSignatureMapper.ts";
import { UnauthorizedError } from "../../../_shared/domain/model/UnauthorizedError.ts";

export class HaltInvalidWebhookInvocationsUseCase {
    constructor(
        private readonly getRemoteConfigUseCase: GetRemoteConfigUseCase = new GetRemoteConfigUseCase(),
        private readonly stringToFormSubmissionMapper: StringToFormSubmissionDataModelMapper = new StringToFormSubmissionDataModelMapper(),
        private readonly stringToHmacSignatureMapper: StringToHmacSignatureMapper = new StringToHmacSignatureMapper(),
    ) { }

    async execute(headers: Record<string, string | undefined>, payload: string): Promise<void> {
        // Step 1: Verify signature header is present
        if (!headers[FORM_SIGNATURE_HEADER]) {
            throw new UnauthorizedError(`Missing the ${FORM_SIGNATURE_HEADER} header`);
        }

        // Step 2: Verify signature matches expected HMAC signature
        const calculatedSignature = this.stringToHmacSignatureMapper.map(payload, FORM_SIGNING_SECRET);
        const givenSignature = headers[FORM_SIGNATURE_HEADER];

        if (calculatedSignature !== givenSignature) {
            throw new UnauthorizedError("Signature mismatch");
        }

        // Step 3: Verify the given schema matches the schema on record
        const schema = this.stringToFormSubmissionMapper.map(payload);

        // Step 4: Verify event type is correct
        if (schema.eventType !== FORM_EVENT_TYPE) {
            throw new NotAValidFormSubmissionError(`Expected event type ${FORM_EVENT_TYPE} but received ${schema.eventType}`);
        }

        // Step 5: Verify form ID is correct
        const config = await this.getRemoteConfigUseCase.execute();

        if (config.formId !== schema.data.formId) {
            throw new NotAValidFormSubmissionError(`Expected form ID ${config.formId} but received ${schema.data.formId}`);
        }
    }
}
