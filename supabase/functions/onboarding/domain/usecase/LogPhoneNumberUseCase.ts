import { FormSubmissionDataModelToSendToPhoneDomainModelMapper } from "../../data/mapper/FormSubmissionToSendToPhoneMapper.ts";
import { StringToFormSubmissionDataModelMapper } from "../../data/mapper/StringToFormSubmissionDataModelMapper.ts";
import { SendToPhoneDomainModel } from "../model/SendToPhoneDomainModel.ts";

export class LogPhoneNumberUseCase {
    constructor(
        private formSubmissionToSendToPhoneMapper: FormSubmissionDataModelToSendToPhoneDomainModelMapper = new FormSubmissionDataModelToSendToPhoneDomainModelMapper(),
        private stringToFormSubmissionMapper: StringToFormSubmissionDataModelMapper = new StringToFormSubmissionDataModelMapper()
    ) { }

    async execute(payload: string): Promise<SendToPhoneDomainModel> {
        const schema = this.stringToFormSubmissionMapper.map(payload);
        const phoneOptIn = await this.formSubmissionToSendToPhoneMapper.map(schema);

        return phoneOptIn;
    }
}
