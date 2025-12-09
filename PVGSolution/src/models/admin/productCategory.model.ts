import type { IPagingResponse } from "../baseReponse";

export interface IGetProductCategoryResponse extends IPagingResponse {
  items: IRequestCustomerItemDetails[];
}

export interface IRequestCustomerItemDetails {
  id: string;
  name: string;
  inactive: boolean;
  createdDate: string;
  createdByName: string;
}

export interface ISaveProductCategoryRequest {
  name: string;
  inactive: boolean;
  createdBy?: string;
}

export interface IUpdateProductCategoryRequest
  extends ISaveProductCategoryRequest {
  id: string;
}
