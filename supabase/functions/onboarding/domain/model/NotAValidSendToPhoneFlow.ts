export class NotAValidSendToPhoneFlow extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotAValidSendToPhoneFlow";
    }
}
