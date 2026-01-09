import { RemoteConfigRepository } from "../../data/repository/RemoteConfigRepository.ts";
import { RemoteConfigDomainModel } from "../model/RemoteConfigDomainModel.ts";

export class GetRemoteConfigUseCase {
    constructor(
        private readonly remoteConfigRepository: RemoteConfigRepository = new RemoteConfigRepository()
    ) {}

    async execute(): Promise<RemoteConfigDomainModel> {
        return await this.remoteConfigRepository.getConfigValues();
    }
}
