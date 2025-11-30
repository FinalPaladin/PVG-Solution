import type { IRS_GetAllConfigurationModel } from "@/models/admin/config.model";
import type { BaseResponse } from "@/models/baseReponse";
import requestAdmin from "@/utils/requestAdmin";

export function configsGetall() {
    return requestAdmin.get<unknown, BaseResponse<IRS_GetAllConfigurationModel>>(`api/configuration/getall`);
}

export function configsSave(_input: FormData) {
    return requestAdmin.post<unknown, BaseResponse<boolean>>(`api/configuration/save`, _input, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}
