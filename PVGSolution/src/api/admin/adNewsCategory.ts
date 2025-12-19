import type {
  IGetNewsCategoryResponse,
  INewsCategoryItem,
  ISaveNewsCategoryRequest,
  IUpdateNewsCategoryRequest,
} from "@/models/admin/newsCategory.model";
import type { BaseResponse } from "@/models/baseReponse";
import requestAdmin from "@/utils/requestAdmin";

// Search (GET + query string)
export function newsCategorySearch(query: string) {
  return requestAdmin.get<unknown, BaseResponse<IGetNewsCategoryResponse>>(
    `/api/news/category${query}`
  );
}

// Get by Id
export function newsCategoryGetById(id: string) {
  return requestAdmin.get<unknown, BaseResponse<INewsCategoryItem>>(
    `/api/news/category/${id}`
  );
}

// Save (POST)
export function newsCategorySave(body: ISaveNewsCategoryRequest) {
  return requestAdmin.post<unknown, BaseResponse<{ id: string }>>(
    `/api/news/category`,
    body
  );
}

// Update (PUT /{id})
export function newsCategoryUpdate(
  id: string,
  body: IUpdateNewsCategoryRequest
) {
  return requestAdmin.put<unknown, BaseResponse<boolean>>(
    `/api/news/category/${id}`,
    body
  );
}

// Delete (DELETE /{id})
export function newsCategoryDelete(id: string) {
  return requestAdmin.delete<unknown, BaseResponse>(`/api/news/category/${id}`);
}

// Get All (GET)
export function newsCategoryGetAll() {
  return requestAdmin.get<
    unknown,
    BaseResponse<{ id: string; name: string }[]>
  >(`/api/news/category/all`);
}
