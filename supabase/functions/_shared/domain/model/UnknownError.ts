import { HttpError } from "./HttpError.ts";

export class UnknownError extends HttpError {
    constructor(
        internalMessage: string,
        publicMessage: string = "An unknown error occurred",
        cause?: unknown
    ) {
        super(
            internalMessage,
            publicMessage,
            500,
            "UnknownError",
            cause
        );
    }
}
