import type { BaseResponse } from "@/models/baseReponse";
import requestAdmin from "@/utils/requestAdmin";

// Search
export function productsSearch(query: string) {
  return requestAdmin.get<unknown, BaseResponse<unknown>>(
    `/api/products/search${query}`
  );
}

// Get (theo id hoặc params trong query)
export function productsGet(query: string) {
  return requestAdmin.get<unknown, BaseResponse<unknown>>(
    `/api/products${query}`
  );
}

// Save (POST)
export function productSave(body: unknown) {
  return requestAdmin.post<unknown, BaseResponse<string>>(
    `/api/products`,
    body
  );
}

// Update (PUT)
export function productUpdate(body: unknown) {
  return requestAdmin.put<unknown, BaseResponse<boolean>>(
    `/api/product/category`,
    body
  );
}

// Delete (DELETE /{id})
export function productDelete(id: string) {
  return requestAdmin.delete<unknown, BaseResponse>(
    `/api/product/category/${id}`
  );
}
