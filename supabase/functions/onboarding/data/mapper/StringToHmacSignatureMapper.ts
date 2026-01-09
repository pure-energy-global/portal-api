import { createHmac } from "node:crypto";

export class StringToHmacSignatureMapper {
    private readonly ALGORITHM = "sha256";
    private readonly ENCODING = "base64";

    map(input: string, secret: string): string {
        return createHmac(this.ALGORITHM, secret)
            .update(JSON.stringify(input))
            .digest(this.ENCODING);
    }
}
