import type {
  IGetProductCategoryResponse,
  IProductCategoryDetails,
  ISaveProductCategoryRequest,
  IUpdateProductCategoryRequest,
} from "@/models/admin/productCategory.model";
import type { BaseResponse } from "@/models/baseReponse";
import requestAdmin from "@/utils/requestAdmin";

// Search
export function productCategorySearch(query: string) {
  return requestAdmin.get<unknown, BaseResponse<IGetProductCategoryResponse>>(
    `/api/product/category/search${query}`
  );
}

// Get (theo id hoặc params trong query)
export function productCategoryGet(query: string) {
  return requestAdmin.get<unknown, BaseResponse<IGetProductCategoryResponse>>(
    `/api/product/category${query}`
  );
}

// Get All
export function productCategoryGetAll() {
  return requestAdmin.get<unknown, BaseResponse<IProductCategoryDetails[]>>(
    `/api/product/category/all`
  );
}

// Save (POST)
export function productCategorySave(body: ISaveProductCategoryRequest) {
  return requestAdmin.post<unknown, BaseResponse<string>>(
    `/api/product/category`,
    body
  );
}

// Update (PUT)
export function productCategoryUpdate(body: IUpdateProductCategoryRequest) {
  return requestAdmin.put<unknown, BaseResponse<boolean>>(
    `/api/product/category`,
    body
  );
}

// Delete (DELETE /{id})
export function productCategoryDelete(id: string) {
  return requestAdmin.delete<unknown, BaseResponse>(
    `/api/product/category/${id}`
  );
}
