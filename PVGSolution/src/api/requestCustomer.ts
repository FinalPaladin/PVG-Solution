import type { IRQ_InserRequestCustomerModel, IRQ_RemoveImageRequestCustomerModel, IRS_InserRequestCustomerModel, IRS_UploadImageRequestCustomerModel } from "@/models/admin/requestCustomer";
import type { BaseResponse } from "@/models/baseReponse";
import type { IResponseUpdateImage, IRS_CloudflareUploadListImageModel } from "@/models/requestCustomer";
import request from "@/utils/request";

export function requestCustomerSave(payload: unknown) {
  return request.post<unknown, BaseResponse<boolean>>(
    "/api/request/Save",
    payload,{
        headers: { "Content-Type": "multipart/form-data" }
    }
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

// Save (POST)
export function insertRequestCustomer(_input: IRQ_InserRequestCustomerModel) {
  return request.post<unknown, BaseResponse<IRS_InserRequestCustomerModel>>(
    `/api/request/insert`,
    _input
  );
}

// Upload Images (POST)
export function UploadImagesRequestCustomer(_input: unknown) {
  return request.post<unknown, BaseResponse<IRS_CloudflareUploadListImageModel>>(
    `/api/media/image/upload-images`,
    _input,{
        headers: { "Content-Type": "multipart/form-data" }
    }
  );
}

// Upload Images (POST)
export function UploadImageRequestCustomer(_input: unknown) {
  return request.post<unknown, BaseResponse<IRS_UploadImageRequestCustomerModel>>(
    `/api/request/upload-img`,
    _input,{
        headers: { "Content-Type": "multipart/form-data" }
    }
  );
}

// Upload Images (POST)
export function RemoveImageRequestCustomer(_input: IRQ_RemoveImageRequestCustomerModel) {
  return request.post<unknown, BaseResponse>(
    `/api/request/remove-img`,
    _input
  );
}

// Upload Images (POST)
export function SendEmailRequest(requestCode: string) {
  return request.post<unknown, BaseResponse>(
    `/api/request/send-email`,
    {requestCode: requestCode, key: ""} as IRQ_RemoveImageRequestCustomerModel
  );
}