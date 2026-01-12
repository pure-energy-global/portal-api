export class UnauthorizedError extends Error {
    constructor(message: string = "Unauthorized", cause?: unknown) {
        super(message);

        this.cause = cause;
        this.name = "UnauthorizedError";
    }
}
