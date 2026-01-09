export class NotImplementedError extends Error {
    constructor(message: string, cause?: unknown) {
        super(message);

        this.cause = cause;
        this.name = "NotImplementedError";
    }
}
