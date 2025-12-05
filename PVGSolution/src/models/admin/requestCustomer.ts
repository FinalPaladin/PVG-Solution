import type { IPagingResponse } from "../baseReponse";

export interface IRequestCustomerField {
  key: string;
  value: string;
}

export interface IRequestCustomerItemDetails {
  requestCode: string;
  phone: string;
  productId: string;
  details: IRequestCustomerField[];
  createdDate: string;
  fullName: string;
  isProcessed: boolean;
  isSentEmail: boolean;
  strCreatedDate: string;
}

export interface IGetRequestCustomerResponse extends IPagingResponse {
  items: IRequestCustomerItemDetails[];
}

export interface IRequestCustomerDetail {
    isProcessed:boolean;
    id: string;
    requestCode: string;
    phone: string;
    key: string;
    value: string;
    productId: string;
    createdDate: string; // ISO datetime string
}
