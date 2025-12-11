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
  isDeleled: boolean;
  emailTitle: string;
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

export interface IRQ_GetRequestCustomerModel{
  requestCode: string;
}

export interface IRS_GetRequestCustomerModel{
  data: IRequestCustomerItemDetails;
  details: IRequestCustomerDetail[];
}

export interface IRQ_ProcessedModel{
  requestCode: string;
  userName: string;
}

export interface IRQ_DeleteRequestCustomerModel{
  requestCode: string;
  userDelete: string;
  idDetail: string;
}