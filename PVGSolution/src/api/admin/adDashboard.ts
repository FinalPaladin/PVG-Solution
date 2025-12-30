import type { IRS_DashboardInitPageModel } from "@/models/admin/dashboard.model";
import type { BaseResponse } from "@/models/baseReponse";
import requestAdmin from "@/utils/requestAdmin";

export function initDashboard() {
    return requestAdmin.get<unknown, BaseResponse<IRS_DashboardInitPageModel>>(
        `/api/initpage/dashboard`
    );
}
