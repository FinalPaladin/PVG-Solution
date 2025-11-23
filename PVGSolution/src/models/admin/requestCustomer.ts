import type { IPagingResponse } from "../baseReponse";

export interface IRequestCustomerField {
    key: string;
    value: string;
}

export interface IRequestCustomerItemDetails {
    requestCode: string;
    phone: string;
    productId: string;
    listRequestCustomer: IRequestCustomerField[];
    createdDate: string
}

export interface IGetRequestCustomerResponse extends IPagingResponse {
    items: IRequestCustomerItemDetails[];
}

export interface IRequestCustomerDetail {
    id: string;
    requestCode: string;
    phone: string;
    key: string;
    value: string;
    productId: string;
    createdDate: string; // ISO datetime string
}
