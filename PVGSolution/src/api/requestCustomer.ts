import type { BaseResponse } from "@/models/baseReponse";
import request from "@/utils/request";

export function requestCustomerSave(payload: FormData) {
  return request.post<unknown, BaseResponse<boolean>>(
    "/api/request/save",
    payload, {
        headers: { "Content-Type": "multipart/form-data" }
    }
  );
}
