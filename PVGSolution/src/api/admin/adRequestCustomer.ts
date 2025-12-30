import type { IGetRequestCustomerResponse, IRequestCustomerDetail, IRQ_GetRequestCustomerModel, IRS_GetRequestCustomerModel, IRQ_ProcessedModel, IRQ_DeleteRequestCustomerModel } from "@/models/admin/requestCustomer";
import type { BaseResponse } from "@/models/baseReponse";
import requestAdmin from "@/utils/requestAdmin";

export function getCustomerRequest(query: string) {
    return requestAdmin.get<unknown, BaseResponse<IGetRequestCustomerResponse>>(
        `/api/request/search${query}`
    );
}

export function getCustomerRequestDetail(requestCode: string) {
    return requestAdmin.get<unknown, BaseResponse<IRequestCustomerDetail[]>>(
        `/api/request/${requestCode}`
    );
}

export function exportDataCustomerRequest(_payload: string) {
    return requestAdmin.get<Blob>(
        `/api/request/exportexcel${_payload}`, {
            responseType: "blob"
        }
    );
}

export function processedCustomerRequest(_payload: IRQ_ProcessedModel) {
    return requestAdmin.post<unknown, BaseResponse>(
        `/api/request/processed/`, _payload
    );
}

export function getDataCustomerRequest(_payload: IRQ_GetRequestCustomerModel) {
    return requestAdmin.post<unknown, BaseResponse<IRS_GetRequestCustomerModel>>(
        `/api/request/getdata`, _payload
    );
}

export function deleteCustomerRequest(_payload: IRQ_DeleteRequestCustomerModel) {
    return requestAdmin.post<unknown, BaseResponse>(
        `/api/request/delete`, _payload
    );
}
