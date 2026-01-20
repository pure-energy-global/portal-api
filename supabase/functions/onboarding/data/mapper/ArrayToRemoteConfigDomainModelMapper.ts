import { CMS_FORM_ID_KEY, CMS_FORM_PHONE_NUMBER_FIELD_KEY, CMS_FORM_TEXT_ME_A_LINK_FIELD_KEY } from "../../config.ts";
import { Mapper } from "../../../_shared/data/mapper/Mapper.ts";
import { RemoteConfigDomainModel } from "../../domain/model/RemoteConfigDomainModel.ts";

export class ArrayToRemoteConfigDomainModelMapper implements Mapper<Array<{ key: string; value: string }>, RemoteConfigDomainModel> {
    map(payload: Array<{ key: string; value: string }>): RemoteConfigDomainModel {
        const formId = payload.find(item => item.key === CMS_FORM_ID_KEY)?.value || "";
        const phoneNumberFormFieldKey = payload.find(item => item.key === CMS_FORM_PHONE_NUMBER_FIELD_KEY)?.value || "";
        const textMeALinkFormFieldKey = payload.find(item => item.key === CMS_FORM_TEXT_ME_A_LINK_FIELD_KEY)?.value || "";

        return {
            formId,
            phoneNumberFormFieldKey,
            textMeALinkFormFieldKey
        };
    }
}
