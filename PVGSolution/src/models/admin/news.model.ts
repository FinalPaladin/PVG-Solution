import type { NewsColumn, SortDirection } from "@/commons/news.enum";
import type { IPagingRequest, NewsTypeEnum } from "./newsCategory.model";

/* =========================
 * SEARCH REQUEST
 * ========================= */
export interface NewsSearchRequest extends IPagingRequest {
  categoryId?: string;
  active?: boolean;
  hasDisplayOrder?: boolean;
  forApp?: boolean;
  search?: string;
  type?: NewsTypeEnum;
  sortIndex?: NewsColumn;
  sortType?: SortDirection;
  publishFrom?: string;
  publishTo?: string;
  createdDateFrom?: string;
  createdDateTo?: string;
}

/* =========================
 * RESPONSE MODEL
 * ========================= */
export interface NewsResponseModel {
  id: string;
  code?: number;
  title: string;
  description: string;
  content: string;
  slug: string;
  active: boolean;
  type: NewsTypeEnum;
  needApproved: boolean;
  approvedDate?: string;
  approvedBy?: string;
  isApproved?: boolean;
  publishDate: string;
  expireDate?: string;
  imageLink?: string;
  imageName?: string;
  thumbnail?: string;
  thumbnailName?: string;
  displayOrder?: number;
  categoryId?: string;
  categoryName?: string;
  createdBy?: string;
  createdDate: string;
  createdByName?: string;
  modifiedBy?: string;
  modifiedDate?: string;
}

/* =========================
 * CREATE / UPDATE
 * ========================= */
export interface NewsCreateRequest {
  title: string;
  description: string;
  content: string;
  publishDate: string;
  expireDate?: string;
  active: boolean;
  imageLink?: string;
  thumbnailFile?: NewsThumbnailRequest;
  displayOrder?: number;
  isApproved?: boolean;
}

export interface NewsThumbnailRequest {
  fileName: string;
  path: string;
}

/* =========================
 * ORDER
 * ========================= */
export interface NewsOrderDetailRequest {
  code: number;
  displayOrder: number;
}

export interface NewsOrderRequest {
  type?: NewsTypeEnum;
  details: NewsOrderDetailRequest[];
}
export interface NewsDetailResponse extends NewsCreateRequest {
  id: string;
  slug: string;
  categoryId: string;
}
