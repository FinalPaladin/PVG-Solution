import type { BaseResponse } from "@/models/baseReponse";
import request from "@/utils/request";
import type {
  NewsAppInitResponse,
  NewsDetailResponse,
} from "@/models/appNews.model";

export function initNewsPage() {
  return request.get<unknown, BaseResponse<NewsAppInitResponse>>(
    "/api/news/app"
  );
}
export function getNewsBySlug(slug: string) {
  return request.get<unknown, BaseResponse<NewsDetailResponse>>(
    `/api/news/app/slug/${slug}`
  );
}
export function getShareNewsBySlug(slug: string) {
  return request.get<unknown, BaseResponse<NewsDetailResponse>>(
    `/api/news/app/share/slug/${slug}`
  );
}
