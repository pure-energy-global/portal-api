import { ArrayToRemoteConfigDomainModelMapper } from "../mapper/ArrayToRemoteConfigDomainModelMapper.ts";
import { RemoteConfigDataSource } from "../datasource/RemoteConfigDataSource.ts";
import { RemoteConfigDomainModel } from "../../domain/model/RemoteConfigDomainModel.ts";

export class RemoteConfigRepository {
    constructor(
        private readonly configDataSource: RemoteConfigDataSource = new RemoteConfigDataSource(),
        private readonly mapper: ArrayToRemoteConfigDomainModelMapper = new ArrayToRemoteConfigDomainModelMapper()
    ) {}

    async getConfigValues(): Promise<RemoteConfigDomainModel> {
        const rawConfig = await this.configDataSource.getConfigValues();
        return this.mapper.map(rawConfig);
    }
}
