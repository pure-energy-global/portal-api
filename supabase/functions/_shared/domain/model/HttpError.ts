import { DEPLOYMENT_REGION } from "../../config.ts";
import { ErrorResponseDomainModel } from "./ErrorResponseDomainModel.ts";

export class HttpError extends Error {
    private readonly internalMessage: string;
    private readonly isDevEnvironment: boolean;
    public readonly publicMessage: string;
    statusCode: number;

    constructor(
        internalMessage: string,
        publicMessage: string,
        statusCode: number,
        name: string = "GenericHttpError",
        cause?: unknown
    ) {
        const region = DEPLOYMENT_REGION;
        const isDev = region === undefined || region === null || region.trim() === "";

        super(isDev ? internalMessage : publicMessage);
        this.isDevEnvironment = isDev;

        this.cause = cause;
        this.internalMessage = internalMessage;
        this.publicMessage = publicMessage;
        this.name = name;
        this.statusCode = statusCode;

        console.error(`${statusCode}: [${name}] \n\nPUBLIC MESSAGE: ${publicMessage}\nINTERNAL MESSAGE: ${internalMessage }`, cause);
    }

    toErrorResponse(): ErrorResponseDomainModel {
        return {
            code: this.statusCode,
            internalMessage: this.isDevEnvironment ? this.internalMessage : undefined,
            message: this.publicMessage,
            name: this.name
        };
    }
}
