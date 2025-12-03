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