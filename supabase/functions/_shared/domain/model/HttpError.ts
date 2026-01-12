import { ErrorResponseDomainModel } from "./ErrorResponseDomainModel.ts";

export class HttpError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number, cause?: Error) {
        super(message);

        this.cause = cause;
        this.name = "HttpError";
        this.statusCode = statusCode;
    }

    toErrorResponse(): ErrorResponseDomainModel {
        return {
            code: this.statusCode,
            name: this.name,
            message: this.message
        };
    }
}
