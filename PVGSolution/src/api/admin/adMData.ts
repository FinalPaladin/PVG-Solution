import type { MData } from "@/models/admin/mdata.model";
import type { BaseResponse } from "@/models/baseReponse";
import requestAdmin from "@/utils/requestAdmin";

export function loadMData(query: string) {
  return requestAdmin.get<unknown, BaseResponse<MData[]>>(
    `/api/mdata/groups${query}`
  );
}
