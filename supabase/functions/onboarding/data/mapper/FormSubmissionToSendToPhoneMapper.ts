import { FormSubmission } from "../model/FormSubmission.ts";
import { phone } from "phone";
import { SendToPhone } from "../../domain/model/SendToPhone.ts";

export class FormSubmissionToSendToPhoneMapper {
    map(payload: FormSubmission): SendToPhone {
        const textMeALinkFieldLabel = "Text me a link";
        const textMeALinkFieldType = "CHECKBOXES";
        const textMeALinkCheckboxLabel = "Text me a link to continue this on my phone.";

        const yourPhoneFieldLabel = "Your Phone";
        const yourPhoneFieldType = "INPUT_PHONE_NUMBER";

        const fields = payload.data.fields;

        // Payload contains the expected checkbox field
        const textMeALinkField = fields.find(field => field.label === textMeALinkFieldLabel && field.type === textMeALinkFieldType);

        if (!textMeALinkField) {
            console.warn(`Missing a '${textMeALinkFieldLabel}' field that is also of type ${textMeALinkFieldType}.`);

            return {
                didUserOptIn: false,
                phoneNumber: "",
            };
        }

        // Payload options contains the expected checkbox
        const checkedPhoneNumberCheckbox = textMeALinkField.options?.find(option => option.text === textMeALinkCheckboxLabel);

        if (!checkedPhoneNumberCheckbox) {
            console.warn(`Missing a checkbox option with label: '${textMeALinkCheckboxLabel}'.`);

            return {
                didUserOptIn: false,
                phoneNumber: "",
            };
        }

        // Expected checkbox is selected
        const selectedOptions = (textMeALinkField.value || []) as string[]; // Always the case with CHECKBOXES

        if (!selectedOptions.includes(checkedPhoneNumberCheckbox.id)) {
            console.warn(`The checkbox option with label: '${textMeALinkCheckboxLabel}' is not selected.`);

            return {
                didUserOptIn: false,
                phoneNumber: "",
            };
        }

        // Payload contains the expected phone number field
        const yourPhoneField = fields.find(field => field.label === yourPhoneFieldLabel && field.type === yourPhoneFieldType);

        if (!yourPhoneField) {
            console.warn(`Missing a '${yourPhoneFieldLabel}' field that is also of type ${yourPhoneFieldType}.`);

            return {
                didUserOptIn: false,
                phoneNumber: "",
            };
        }

        // Confirm phone number is valid
        const rawPhoneNumber = yourPhoneField.value as string; // Always the case with INPUT_PHONE_NUMBER
        const phoneValidationResult = phone(rawPhoneNumber, { country: "USA" });

        if (phoneValidationResult.isValid) {
            return {
                didUserOptIn: true,
                phoneNumber: phoneValidationResult.phoneNumber,
            };
        }

        console.warn("The provided phone number is not valid.");

        return {
            didUserOptIn: false,
            phoneNumber: "",
        };
    }
}
