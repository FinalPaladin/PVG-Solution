import type { ProductResponseModel } from "@/models/admin/product.model";
import type { IInitProductPage } from "@/models/appProducts.model";
import type { BaseResponse } from "@/models/baseReponse";
import request from "@/utils/request";

export function initProductPage() {
  return request.get<unknown, BaseResponse<IInitProductPage>>(
    "/api/products/app/init"
  );
}

export function initProductDetailPage(id: string) {
  return request.get<unknown, BaseResponse<ProductResponseModel>>(
    `/api/products/app/${id}`
  );
}
