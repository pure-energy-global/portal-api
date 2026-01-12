import { CMS_API_VERSION, CMS_DATASET, CMS_PROJECT_ID, CMS_USE_CDN } from "../../config.ts";
import { createClient } from "sanity";

export class RemoteConfigDataSource {
    constructor(private readonly client = createClient({
        projectId: CMS_PROJECT_ID,
        dataset: CMS_DATASET,
        useCdn: CMS_USE_CDN,
        apiVersion: CMS_API_VERSION
    })) {}

    async getConfigValues(): Promise<Array<{ key: string; value: string }>> {
        const query = `*[_type == "config" && domain == "onboarding"] {
            key,
            value
        }`;

        return await this.client.fetch(query);
    }
}
