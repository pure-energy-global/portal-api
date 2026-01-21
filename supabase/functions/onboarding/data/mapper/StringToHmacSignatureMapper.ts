import { createHmac } from "node:crypto";
import { FORM_SIGNATURE_ALGORITHM, FORM_SIGNATURE_ENCODING } from "../../config.ts";

export class StringToHmacSignatureMapper {
    map(input: string, secret: string): string {
        return createHmac(FORM_SIGNATURE_ALGORITHM, secret)
            .update(JSON.stringify(input))
            .digest(FORM_SIGNATURE_ENCODING);
    }
}
