import type { BaseResponse } from "@/models/baseReponse";
import requestAdmin from "@/utils/requestAdmin";
import type {
  ProductSearchRequest,
  ProductResponseModel,
  ProductCreateRequest,
  ProductUpdateRequest,
} from "@/models/admin/product.model";

/* =========================
 * SEARCH
 * ========================= */
export function productsSearch(params: ProductSearchRequest) {
  return requestAdmin.get<
    unknown,
    BaseResponse<{
      items: ProductResponseModel[];
      totalRecords: number;
    }>
  >("/api/products/search", { params });
}

/* =========================
 * GET BY ID
 * ========================= */
export function productsGetById(id: string) {
  return requestAdmin.get<unknown, BaseResponse<ProductResponseModel>>(
    `/api/products/${id}`
  );
}

/* =========================
 * CREATE
 * ========================= */
export function productCreate(body: ProductCreateRequest) {
  return requestAdmin.post<unknown, BaseResponse<boolean>>(
    "/api/products",
    body
  );
}

/* =========================
 * UPDATE
 * ========================= */
export function productUpdate(id: string, body: ProductUpdateRequest) {
  return requestAdmin.put<unknown, BaseResponse<boolean>>(
    `/api/products/${id}`,
    body
  );
}

/* =========================
 * DELETE
 * ========================= */
export function productDelete(id: string, userName: string) {
  return requestAdmin.delete<unknown, BaseResponse<boolean>>(
    `/api/products/${id}`,
    {
      params: { userName },
    }
  );
}
