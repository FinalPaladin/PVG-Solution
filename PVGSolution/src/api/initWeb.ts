import type { BaseResponse } from "@/models/baseReponse";
import request from "@/utils/request";

export function initWeb() {
    return request.post<unknown, BaseResponse>("/api/request/system");
}