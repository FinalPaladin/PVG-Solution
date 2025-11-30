import type { BaseResponse } from "@/models/baseReponse";
import type { IResponseUpdateImage } from "@/models/requestCustomer";
import request from "@/utils/request";

export function requestCustomerSave(payload: unknown) {
  return request.post<unknown, BaseResponse<boolean>>(
    "/api/request/Save",
    payload
  );
}

// POST /api/media/image/upload
export function mediaImageUpload(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  // payload là FormData, response là BaseResponse<MediaImageInfo>
  return request.post<FormData, BaseResponse<IResponseUpdateImage>>(
    "/api/media/image/upload",
    formData
  );
}

// DELETE /api/media/image/delete?key=123
export function mediaImageDelete(key: string) {
  return request.delete<unknown, BaseResponse<boolean>>(
    "/api/media/image/delete",
    {
      params: { key }, // axios sẽ build ?key=...
    }
  );
}