import type { BaseResponse } from "@/models/baseReponse";
import type { IRQ_SaveViewLogModel, IRQ_ViewLogModel } from "@/models/viewlog.model";
import request from "@/utils/request";

export function viewlog(_payload: IRQ_ViewLogModel) {
    return request.post<unknown, BaseResponse>("/api/viewlog/view", _payload);
}

export function saveviewlog(_payload: IRQ_SaveViewLogModel) {
    return request.post<unknown, BaseResponse>("/api/viewlog/save", _payload);
}