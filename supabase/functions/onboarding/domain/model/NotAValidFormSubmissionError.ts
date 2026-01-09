export class NotAValidFormSubmissionError extends TypeError {
    constructor(message: string, cause?: unknown) {
        super(message);

        this.cause = cause;
        this.name = "NotAValidFormSubmission";
    }
}
