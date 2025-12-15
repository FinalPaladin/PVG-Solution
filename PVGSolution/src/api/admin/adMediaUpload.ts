import type { BaseResponse } from "@/models/baseReponse";
import requestAdmin from "@/utils/requestAdmin";

// src/api/media.ts
export interface UploadImageResponse {
  publicUrl: string;
  keyUrl: string;
}

export function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return requestAdmin.post<unknown, BaseResponse<UploadImageResponse>>(
    "/api/media/image/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}
