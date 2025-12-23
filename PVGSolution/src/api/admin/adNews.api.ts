import type { BaseResponse } from "@/models/baseReponse";
import requestAdmin from "@/utils/requestAdmin";
import type {
  NewsSearchRequest,
  NewsResponseModel,
  NewsCreateRequest,
  NewsOrderRequest,
} from "@/models/admin/news.model";

/* =========================
 * SEARCH (GET /api/news)
 * ========================= */
export function newsSearch(params: NewsSearchRequest) {
  return requestAdmin.get<
    unknown,
    BaseResponse<{
      items: NewsResponseModel[];
      isPaging: boolean;
      totalItems: number;
      totalPages: number;
      perPage: number;
      pageNumber: number;
    }>
  >("/api/news", { params });
}

/* =========================
 * GET BY ID (GET /api/news/{id})
 * ========================= */
export function newsGetById(id: string) {
  return requestAdmin.get<unknown, BaseResponse<NewsResponseModel>>(
    `/api/news/${id}`
  );
}

/* =========================
 * CREATE (POST /api/news/newsCategory/{categoryId})
 * ========================= */
export function newsCreate(categoryId: string, body: NewsCreateRequest) {
  return requestAdmin.post<unknown, BaseResponse<boolean>>(
    `/api/news/newsCategory/${categoryId}`,
    body
  );
}

/* =========================
 * UPDATE (PUT /api/news/news/{newsId}/category/{categoryId})
 * ========================= */
export function newsUpdate(
  newsId: string,
  categoryId: string,
  body: NewsCreateRequest
) {
  return requestAdmin.put<unknown, BaseResponse<boolean>>(
    `/api/news/news/${newsId}/category/${categoryId}`,
    body
  );
}

/* =========================
 * DELETE (DELETE /api/news/{id})
 * ========================= */
export function newsDelete(id: string) {
  return requestAdmin.delete<unknown, BaseResponse<boolean>>(`/api/news/${id}`);
}

/* =========================
 * UPDATE DISPLAY ORDER (nếu BE có)
 * ========================= */
export function newsUpdateOrder(body: NewsOrderRequest) {
  return requestAdmin.put<unknown, BaseResponse<boolean>>(
    "/api/news/order",
    body
  );
}

export function approveNews(id: string, userName: string) {
  return requestAdmin.post<unknown, BaseResponse<boolean>>(
    `/api/news/approve`,
    {
      id,
      userName,
    }
  );
}
