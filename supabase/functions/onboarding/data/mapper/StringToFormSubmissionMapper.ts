import { FormSubmission, FormSubmissionSchema } from "../model/FormSubmission.ts";
import { NotAValidFormSubmission } from "../../domain/model/NotAValidFormSubmission.ts";

export class StringToFormSubmissionMapper {
    map(payload: string): FormSubmission {
        try {
            const schema = FormSubmissionSchema.parse(payload);
            return schema as FormSubmission;
        } catch (error) {
            throw new NotAValidFormSubmission("Failed to convert payload to FormSubmissionDataModel", error);
        }
    }
}
