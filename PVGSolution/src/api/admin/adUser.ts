import type { IRQ_ChangePasswordModel } from "@/models/admin/user.model";
import type { BaseResponse } from "@/models/baseReponse";
import requestAdmin from "@/utils/requestAdmin";

export function changePassword(_input: IRQ_ChangePasswordModel) {
    return requestAdmin.post<unknown, BaseResponse<boolean>>(`api/user/change-password`, _input);
}