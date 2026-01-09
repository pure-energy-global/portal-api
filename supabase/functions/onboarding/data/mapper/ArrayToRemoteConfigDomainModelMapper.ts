import { Mapper } from "../../../_shared/data/mapper/Mapper.ts";
import { RemoteConfigDomainModel } from "../../domain/model/RemoteConfigDomainModel.ts";

export class ArrayToRemoteConfigDomainModelMapper implements Mapper<Array<{ key: string; value: string }>, RemoteConfigDomainModel> {
    private readonly FORM_ID_KEY = "FORM_ID";
    private readonly PHONE_NUMBER_FORM_FIELD_KEY = "PHONE_NUMBER_FIELD_KEY";
    private readonly TEXT_ME_A_LINK_FORM_FIELD_KEY = "TEXT_ME_A_LINK_FIELD_KEY";

    map(payload: Array<{ key: string; value: string }>): RemoteConfigDomainModel {
        const formId = payload.find(item => item.key === this.FORM_ID_KEY)?.value || "";
        const phoneNumberFormFieldKey = payload.find(item => item.key === this.PHONE_NUMBER_FORM_FIELD_KEY)?.value || "";
        const textMeALinkFormFieldKey = payload.find(item => item.key === this.TEXT_ME_A_LINK_FORM_FIELD_KEY)?.value || "";

        return {
            formId,
            phoneNumberFormFieldKey,
            textMeALinkFormFieldKey
        };
    }
}
