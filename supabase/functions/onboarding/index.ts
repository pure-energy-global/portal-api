import { ContentfulStatusCode } from "hono/utils/http-status";
import { EDGE_BASE_PATH } from "./config.ts";
import { FlowTypeDomainModel } from "./domain/model/FlowTypeDomainModel.ts";
import { HaltInvalidWebhookInvocationsUseCase } from "./domain/usecase/HaltInvalidWebhookInvocationsUseCase.ts";
import { Hono } from "hono"
import { HttpError } from "../_shared/domain/model/HttpError.ts";
import { IdentifyFlowTypeUseCase } from "./domain/usecase/IdentifyFlowTypeUseCase.ts";
import { NotImplementedError } from "../_shared/domain/model/NotImplementedError.ts";
import { SendToPhoneFlowUseCase } from "./domain/usecase/SendToPhoneFlowUseCase.ts"
import { UnknownError } from "../_shared/domain/model/UnknownError.ts";

const app = new Hono().basePath(EDGE_BASE_PATH);

app.use(async (context, next) => {
    const body = await context.req.json();
    const headers = context.req.header();

    await new HaltInvalidWebhookInvocationsUseCase().execute(headers, body);
    await next();
});

app.post("/", async (context) => {
    const body = await context.req.json();
    const flowType = await new IdentifyFlowTypeUseCase().execute(body);

    if (flowType === FlowTypeDomainModel.SEND_TO_PHONE) {
        await new SendToPhoneFlowUseCase().execute(body);
        return context.body(null, 204);
    }

    throw new NotImplementedError("The requested onboarding scenario is not implemented");
});

app.onError((error, context) => {
    let e: HttpError;

    if (error instanceof HttpError) {
        e = error as HttpError;
    } else {
        e = new UnknownError(
            "An unknown error occurred",
            "An unknown error occurred",
            error
        );
    }

    return context.json(e.toErrorResponse(), e.statusCode as ContentfulStatusCode);
});

Deno.serve(app.fetch);
