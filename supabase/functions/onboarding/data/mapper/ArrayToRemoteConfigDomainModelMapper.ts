import { FORM_ID_KEY, PHONE_NUMBER_FORM_FIELD_KEY, TEXT_ME_A_LINK_FORM_FIELD_KEY } from "../../config.ts";
import { Mapper } from "../../../_shared/data/mapper/Mapper.ts";
import { RemoteConfigDomainModel } from "../../domain/model/RemoteConfigDomainModel.ts";

export class ArrayToRemoteConfigDomainModelMapper implements Mapper<Array<{ key: string; value: string }>, RemoteConfigDomainModel> {
    map(payload: Array<{ key: string; value: string }>): RemoteConfigDomainModel {
        const formId = payload.find(item => item.key === FORM_ID_KEY)?.value || "";
        const phoneNumberFormFieldKey = payload.find(item => item.key === PHONE_NUMBER_FORM_FIELD_KEY)?.value || "";
        const textMeALinkFormFieldKey = payload.find(item => item.key === TEXT_ME_A_LINK_FORM_FIELD_KEY)?.value || "";

        return {
            formId,
            phoneNumberFormFieldKey,
            textMeALinkFormFieldKey
        };
    }
}
