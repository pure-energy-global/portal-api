import { HttpError } from "./HttpError.ts";

export class UnauthorizedError extends HttpError {
    constructor(
        internalMessage: string,
        publicMessage: string = "You are not authorized to perform this action",
        cause?: unknown
    ) {
        super(
            internalMessage,
            publicMessage,
            401,
            "UnauthorizedError",
            cause
        );
    }
}
