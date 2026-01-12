import { FlowTypeDomainModel } from "../model/FlowTypeDomainModel.ts";
import { FormSubmissionDataModelToSendToPhoneDomainModelMapper } from "../../data/mapper/FormSubmissionToSendToPhoneMapper.ts";
import { StringToFormSubmissionDataModelMapper } from "../../data/mapper/StringToFormSubmissionDataModelMapper.ts";

export class IdentifyFlowTypeUseCase {
    constructor(
        private formSubmissionToSendToPhoneMapper: FormSubmissionDataModelToSendToPhoneDomainModelMapper = new FormSubmissionDataModelToSendToPhoneDomainModelMapper(),
        private stringToFormSubmissionMapper: StringToFormSubmissionDataModelMapper = new StringToFormSubmissionDataModelMapper()
    ) { }

    async execute(payload: string): Promise<FlowTypeDomainModel> {
        const schema = this.stringToFormSubmissionMapper.map(payload);
        const phoneOptIn = await this.formSubmissionToSendToPhoneMapper.map(schema);

        if (phoneOptIn.didUserOptIn && phoneOptIn.phoneNumber !== "") {
            console.log("Payload matches the 'Send to Phone' flow");
            return FlowTypeDomainModel.SEND_TO_PHONE;
        } else {
            console.log("Payload does not match the 'Send to Phone' flow");
            return FlowTypeDomainModel.OTHER;
        }
    }
}
