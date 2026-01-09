import { createClient } from "sanity";
import { EnvironmentVariableDataSource } from "../../../_shared/data/datasource/EnvironmentVariableDataSource.ts";

export class RemoteConfigDataSource {
    constructor(private readonly client = createClient({
        projectId: EnvironmentVariableDataSource("CMS_PROJECT_ID"),
        dataset: EnvironmentVariableDataSource("CMS_DATASET"),
        useCdn: EnvironmentVariableDataSource("CMS_USE_CDN") === "true",
        apiVersion: EnvironmentVariableDataSource("CMS_API_VERSION")
    })) {}

    async getConfigValues(): Promise<Array<{ key: string; value: string }>> {
        const query = `*[_type == "config" && domain == "onboarding"] {
            key,
            value
        }`;

        return await this.client.fetch(query);
    }
}
