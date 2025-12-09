export interface ILoginRequest {
  userName: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  fullName: string;
  expireAt: string;
  permission: string;
}
