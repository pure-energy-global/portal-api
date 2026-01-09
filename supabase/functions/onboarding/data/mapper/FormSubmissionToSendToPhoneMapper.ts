import { FormSubmissionDataModel } from "../model/FormSubmissionDataModel.ts";
import { GetRemoteConfigUseCase } from "../../domain/usecase/GetRemoteConfigUseCase.ts";
import { Mapper } from "../../../_shared/data/mapper/Mapper.ts";
import { phone } from "phone";
import { SendToPhoneDomainModel } from "../../domain/model/SendToPhoneDomainModel.ts";
import { RemoteConfigDataSource } from "../datasource/RemoteConfigDataSource.ts";
import { get } from "node:http";

export class FormSubmissionDataModelToSendToPhoneDomainModelMapper implements Mapper<FormSubmissionDataModel, Promise<SendToPhoneDomainModel>> {
    constructor(
        private readonly getRemoteConfigUseCase: GetRemoteConfigUseCase = new GetRemoteConfigUseCase()
    ) {}

    async map(payload: FormSubmissionDataModel): Promise<SendToPhoneDomainModel> {
        const config = await this.getRemoteConfigUseCase.execute();

        const textMeALinkFieldId = config.textMeALinkFormFieldKey;
        const textMeALinkFieldType = "CHECKBOXES";

        const yourPhoneFieldId = config.phoneNumberFormFieldKey;
        const yourPhoneFieldType = "INPUT_PHONE_NUMBER";

        const fields = payload.data.fields;

        // Payload contains the expected checkbox field
        const textMeALinkField = fields?.find(field => field.key === textMeALinkFieldId && field.type === textMeALinkFieldType);

        if (!textMeALinkField) {
            console.warn(`Missing a checkbox option with key: '${textMeALinkFieldId}'`);

            return {
                didUserOptIn: false,
                phoneNumber: "",
            };
        }

        // Confirm checkbox is selected
        const didSelectTextMeALinkOption = (textMeALinkField.value as boolean) || false;

        if (!didSelectTextMeALinkOption) {
            console.warn(`The checkbox option with key: '${textMeALinkFieldId}' is not selected`);

            return {
                didUserOptIn: false,
                phoneNumber: "",
            };
        }

        // Payload contains the expected phone number field
        const yourPhoneField = fields.find(field => field.key === yourPhoneFieldId && field.type === yourPhoneFieldType);

        if (!yourPhoneField) {
            console.warn(`Missing phone input with key: '${yourPhoneFieldId}'`);

            return {
                didUserOptIn: true,
                phoneNumber: "",
            };
        }

        // Confirm phone number is valid
        const rawPhoneNumber = (yourPhoneField.value as string) || "";
        const phoneValidationResult = phone(rawPhoneNumber, { country: "USA" });

        if (phoneValidationResult.isValid) {
            return {
                didUserOptIn: true,
                phoneNumber: phoneValidationResult.phoneNumber,
            };
        }

        console.warn("The provided phone number is not valid");

        return {
            didUserOptIn: true,
            phoneNumber: "",
        };
    }
}
