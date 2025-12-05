import type { IGetRequestCustomerResponse, IRequestCustomerDetail } from "@/models/admin/requestCustomer";
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

export function processedCustomerRequest(requestCode: string) {
    return requestAdmin.get<unknown, BaseResponse>(
        `/api/request/processed/${requestCode}`
    );
}