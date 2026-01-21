import { HttpError } from "./HttpError.ts";

export class NotImplementedError extends HttpError {
    constructor(
        internalMessage: string,
        publicMessage: string = "This operation is not yet supported",
        cause?: unknown
    ) {
        super(
            internalMessage,
            publicMessage,
            501,
            "NotImplementedError",
            cause
        );
    }
}
