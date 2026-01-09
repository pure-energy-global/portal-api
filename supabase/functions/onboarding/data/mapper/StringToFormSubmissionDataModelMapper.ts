import { FormSubmissionDataModel, FormSubmissionDataModelSchema } from "../model/FormSubmissionDataModel.ts";
import { Mapper } from "../../../_shared/data/mapper/Mapper.ts";
import { NotAValidFormSubmissionError } from "../../domain/model/NotAValidFormSubmissionError.ts";

export class StringToFormSubmissionDataModelMapper implements Mapper<string, FormSubmissionDataModel> {
    map(payload: string): FormSubmissionDataModel {
        try {
            const schema = FormSubmissionDataModelSchema.parse(payload);
            return schema as FormSubmissionDataModel;
        } catch (error) {
            throw new NotAValidFormSubmissionError("Failed to convert payload to FormSubmissionDataModel", error);
        }
    }
}
