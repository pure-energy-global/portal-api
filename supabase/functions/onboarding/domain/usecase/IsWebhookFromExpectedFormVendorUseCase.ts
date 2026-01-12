import { ExpectedVendorOutcomeDomainModel } from "../model/ExpectedVendorOutcomeDomainModel.ts";
import { FORM_EVENT_TYPE, FORM_SIGNATURE_HEADER, FORM_SIGNING_SECRET } from "../../config.ts";
import { GetRemoteConfigUseCase } from "./GetRemoteConfigUseCase.ts";
import { NotAValidFormSubmissionError } from "../model/NotAValidFormSubmissionError.ts";
import { StringToFormSubmissionDataModelMapper } from "../../data/mapper/StringToFormSubmissionDataModelMapper.ts";
import { StringToHmacSignatureMapper } from "../../data/mapper/StringToHmacSignatureMapper.ts";

export class IsWebhookFromExpectedFormVendorUseCase {
    constructor(
        private readonly getRemoteConfigUseCase: GetRemoteConfigUseCase = new GetRemoteConfigUseCase(),
        private readonly stringToFormSubmissionMapper: StringToFormSubmissionDataModelMapper = new StringToFormSubmissionDataModelMapper(),
        private readonly stringToHmacSignatureMapper: StringToHmacSignatureMapper = new StringToHmacSignatureMapper(),
    ) { }

    async execute(headers: Record<string, string | undefined>, payload: string): Promise<ExpectedVendorOutcomeDomainModel> {
        // Step 1: Verify signature header is present
        if (!headers[FORM_SIGNATURE_HEADER]) {
            console.warn("Missing signature header");
            return ExpectedVendorOutcomeDomainModel.UNAUTHORIZED;
        }

        // Step 2: Verify signature matches expected HMAC signature
        const calculatedSignature = this.stringToHmacSignatureMapper.map(payload, FORM_SIGNING_SECRET);
        const givenSignature = headers[FORM_SIGNATURE_HEADER];

        if (calculatedSignature !== givenSignature) {
            console.warn("Signature mismatch");
            return ExpectedVendorOutcomeDomainModel.UNAUTHORIZED;
        }

        // Step 3: Verify the given schema matches the schema on record
        let schema;

        try {
            schema = this.stringToFormSubmissionMapper.map(payload);
        } catch (error) {
            if (error instanceof NotAValidFormSubmissionError) {
                console.warn("Schema validation failed");
                return ExpectedVendorOutcomeDomainModel.INCORRECT_SCHEMA;
            } else {
                throw error;
            }
        }

        // Step 4: Verify event type is correct
        if (schema.eventType !== FORM_EVENT_TYPE) {
            console.warn("Form event type mismatch");
            return ExpectedVendorOutcomeDomainModel.INCORRECT_FORM_TYPE;
        }

        // Step 5: Verify form ID is correct
        const config = await this.getRemoteConfigUseCase.execute();

        if (config.formId !== schema.data.formId) {
            console.warn("Form ID mismatch");
            return ExpectedVendorOutcomeDomainModel.INCORRECT_FORM_ID;
        }

        return ExpectedVendorOutcomeDomainModel.SUCCESS;
    }
}
