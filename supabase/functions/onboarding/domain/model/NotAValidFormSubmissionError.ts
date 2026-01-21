import { HttpError } from "../../../_shared/domain/model/HttpError.ts";

export class NotAValidFormSubmissionError extends HttpError {
    constructor(
        internalMessage: string,
        publicMessage: string = "Not a supported form submission payload",
        cause?: unknown
    ) {
        super(
            internalMessage,
            publicMessage,
            400,
            "NotAValidFormSubmissionError",
            cause
        );
    }
}
