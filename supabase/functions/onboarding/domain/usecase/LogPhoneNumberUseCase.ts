import { FormSubmissionToSendToPhoneMapper } from "../../data/mapper/FormSubmissionToSendToPhoneMapper.ts";
import { NotAValidSendToPhoneFlow } from "../model/NotAValidSendToPhoneFlow.ts";
import { StringToFormSubmissionMapper } from "../../data/mapper/StringToFormSubmissionMapper.ts";
import { SendToPhone } from "../model/SendToPhone.ts";

export class LogPhoneNumberUseCase {
    constructor(
        private formSubmissionToSendToPhoneMapper: FormSubmissionToSendToPhoneMapper = new FormSubmissionToSendToPhoneMapper(),
        private stringToFormSubmissionMapper: StringToFormSubmissionMapper = new StringToFormSubmissionMapper()
    ) { }

    execute(payload: string): SendToPhone {
        const schema = this.stringToFormSubmissionMapper.map(payload);
        const phoneOptIn = this.formSubmissionToSendToPhoneMapper.map(schema);

        if (!phoneOptIn.didUserOptIn) {
            throw new NotAValidSendToPhoneFlow("The form submission does not correspond to the 'Send to Phone' flow. Aborting phone number logging.");
        }

        console.log("User opted in to 'Send to Phone' flow");

        return phoneOptIn;
    }
}
