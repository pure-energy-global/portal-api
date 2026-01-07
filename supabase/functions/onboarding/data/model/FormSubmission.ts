import { z } from "zod";

export const OptionSchema = z.object({
    "id": z.string(),
    "text": z.string(),
    "isOtherOption": z.boolean().optional(),
    "optionId": z.string().optional(),
});
export type Option = z.infer<typeof OptionSchema>;

export const FieldSchema = z.object({
    "key": z.string(),
    "label": z.string(),
    "type": z.string(),
    "value": z.union([z.array(z.string()), z.boolean(), z.null(), z.string()]),
    "options": z.array(OptionSchema).optional(),
});
export type Field = z.infer<typeof FieldSchema>;

export const DataSchema = z.object({
    "responseId": z.string(),
    "submissionId": z.string(),
    "respondentId": z.string(),
    "formId": z.string(),
    "formName": z.string(),
    "createdAt": z.coerce.date(),
    "fields": z.array(FieldSchema),
});
export type Data = z.infer<typeof DataSchema>;

export const FormSubmissionSchema = z.object({
    "eventId": z.string(),
    "eventType": z.string(),
    "createdAt": z.coerce.date(),
    "data": DataSchema,
});
export type FormSubmission = z.infer<typeof FormSubmissionSchema>;
