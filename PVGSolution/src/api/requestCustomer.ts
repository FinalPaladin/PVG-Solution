import type { BaseResponse } from "@/models/baseReponse";
import request from "@/utils/request";

export function requestCustomerSave(payload: unknown) {
  return request.post<unknown, BaseResponse<boolean>>(
    "/api/request_customer/Save",
    payload
  );
}
