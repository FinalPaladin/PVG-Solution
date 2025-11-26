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

export function logoutAsync() {
  return requestAdmin.post<unknown, BaseResponse<boolean>>(`api/user/logout`, {
    Headers: { Authorization: "" },
  });
}
