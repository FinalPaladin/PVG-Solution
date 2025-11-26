import type {
  ILoginRequest,
  ILoginResponse,
} from "@/models/admin/authen.model";
import type { BaseResponse } from "@/models/baseReponse";
import requestAdmin from "@/utils/requestAdmin";

export function loginAsync(input: ILoginRequest) {
  return requestAdmin.post<unknown, BaseResponse<ILoginResponse>>(
    `api/user/login`,
    input
  );
}
