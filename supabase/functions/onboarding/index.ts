import { Hono } from "hono"
import { LogPhoneNumberUseCase } from "./domain/usecase/LogPhoneNumberUseCase.ts"
import { NotAValidFormSubmission } from "./domain/model/NotAValidFormSubmission.ts";
import { NotAValidSendToPhoneFlow } from "./domain/model/NotAValidSendToPhoneFlow.ts";

const functionName = "onboarding"
const endpointVersion = "v1"
const app = new Hono().basePath(`/${functionName}/${endpointVersion}`)

app.post("/send-to-phone", async (context) => {
    const logger = new LogPhoneNumberUseCase();

    try {
        const result = logger.execute(await context.req.json());
        return context.json(result, 201);
    } catch (error) {
        console.error(error);

        if (error instanceof NotAValidFormSubmission) {
            return context.text("Invalid form payload", 400);
        } else if (error instanceof NotAValidSendToPhoneFlow) {
            return context.text("Not a valid 'Send to Phone' flow", 400);
        } else {
            return context.text("Internal Server Error", 500);
        }
    }
})

Deno.serve(app.fetch);
