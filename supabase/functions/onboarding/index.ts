import { BASE_PATH } from "./config.ts";
import { ErrorResponseDomainModel } from "../_shared/domain/model/ErrorResponseDomainModel.ts";
import { Hono } from "hono"
import { LogPhoneNumberUseCase } from "./domain/usecase/LogPhoneNumberUseCase.ts"
import { NotAValidFormSubmissionError } from "./domain/model/NotAValidFormSubmissionError.ts";
import { IsPerformingSendToPhoneFlowUseCase } from "./domain/usecase/IsPerformingSendToPhoneFlowUseCase.ts";
import { IsWebhookFromExpectedFormVendorUseCase } from "./domain/usecase/IsWebhookFromExpectedFormVendorUseCase.ts";
import { NotImplementedError } from "./domain/model/NotImplementedError.ts";
import { ca } from "zod/v4/locales";

const app = new Hono().basePath(BASE_PATH);

app.use(async (context, next) => {
    const body = await context.req.json();
    const headers = context.req.header();

    try {
        const webhookValidator = new IsWebhookFromExpectedFormVendorUseCase();
        const isWebhookFromExpectedFormVendor = await webhookValidator.execute(headers, body);

        if (!isWebhookFromExpectedFormVendor) {
            throw new NotAValidFormSubmissionError("Not a verified form submission from an expected upstream vendor");
        }

        const scenarioChecker = new IsPerformingSendToPhoneFlowUseCase();
        const isPerformingSendToPhoneFlow = await scenarioChecker.execute(body);

        if (!isPerformingSendToPhoneFlow) {
            throw new NotImplementedError("The requested onboarding scenario is not implemented");
        }

        await next();
    } catch (error) {
        console.error(error);

        if (error instanceof NotAValidFormSubmissionError) {
            return context.json(<ErrorResponseDomainModel>{
                message: "Invalid form submission payload"
            }, 400);
        } else if (error instanceof NotImplementedError) {
            return context.json(<ErrorResponseDomainModel>{
                message: "Flow not implemented"
            }, 501);
        } else {
            return context.json(<ErrorResponseDomainModel>{
                message: "Internal Server Error"
            }, 500);
        }
    }
});

app.post("/", async (context) => {
    const body = await context.req.json();
    const logger = new LogPhoneNumberUseCase();

    await logger.execute(body);
    return context.body(null, 204);
});

Deno.serve(app.fetch);
