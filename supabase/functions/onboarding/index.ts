import { BASE_PATH } from "./config.ts";
import { ErrorResponseDomainModel } from "../_shared/domain/model/ErrorResponseDomainModel.ts";
import { Hono } from "hono"
import { LogPhoneNumberUseCase } from "./domain/usecase/LogPhoneNumberUseCase.ts"
import { NotAValidFormSubmissionError } from "./domain/model/NotAValidFormSubmissionError.ts";
import { IsPerformingSendToPhoneFlowUseCase } from "./domain/usecase/IsPerformingSendToPhoneFlowUseCase.ts";
import { IsWebhookFromExpectedFormVendorUseCase } from "./domain/usecase/IsWebhookFromExpectedFormVendorUseCase.ts";

const app = new Hono().basePath(BASE_PATH);

app.post("/", async (context) => {
    const body = await context.req.json();
    const headers = context.req.header();

    const logger = new LogPhoneNumberUseCase();
    const scenarioChecker = new IsPerformingSendToPhoneFlowUseCase();
    const webhookValidator = new IsWebhookFromExpectedFormVendorUseCase();

    try {
        const isWebhookFromExpectedFormVendor = await webhookValidator.execute(headers, body);

        if (!isWebhookFromExpectedFormVendor) {
            throw new NotAValidFormSubmissionError("Not a verified form submission from an expected upstream vendor");
        }

        const isPerformingSendToPhoneFlow = await scenarioChecker.execute(body);

        if (isPerformingSendToPhoneFlow) {
            await logger.execute(body);
            return context.body(null, 204);
        } else {
            return context.json(<ErrorResponseDomainModel>{
                message: "Flow not implemented"
            }, 501);
        }
    } catch (error) {
        console.error(error);

        if (error instanceof NotAValidFormSubmissionError) {
            return context.json(<ErrorResponseDomainModel>{
                message: "Invalid form submission payload"
            }, 400);
        } else {
            return context.json(<ErrorResponseDomainModel>{
                message: "Internal Server Error"
            }, 500);
        }
    }
})

Deno.serve(app.fetch);
