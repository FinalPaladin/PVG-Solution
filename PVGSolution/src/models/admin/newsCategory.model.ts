import type { IPagingResponse } from "../baseReponse";

// Enum (map với NewsTypeEnum BE)
export const NewsTypeEnum = {
  NEWS: 1,
  EVENT: 2,
  BLOG: 3,
} as const;

export type NewsTypeEnum = (typeof NewsTypeEnum)[keyof typeof NewsTypeEnum];

export interface IPagingRequest {
  page: number;
  pageSize: number;
  isPaging?: boolean;
}

// Search request
export interface INewsCategorySearchRequest extends IPagingRequest {
  active?: boolean;
  keywords?: string;
}

// Response item
export interface INewsCategoryItem {
  id: string;
  name: string;
  status: boolean;
  type: NewsTypeEnum;
  displayOrder?: number;
  createdBy?: string;
  createdDate: string;
  modifiedBy?: string;
  modifiedDate?: string;
  deletedBy?: string;
  deletedDate?: string;
  isDeleted: boolean;
  createdByName: string;
  modifiedByName: string;
  deletedByName: string;
}

// Search response
export interface IGetNewsCategoryResponse extends IPagingResponse {
  items: INewsCategoryItem[];
}

// Create
export interface ISaveNewsCategoryRequest {
  name: string;
  status: boolean;
  type: NewsTypeEnum;
  displayOrder?: number;
  userName: string;
}

// Update
export interface IUpdateNewsCategoryRequest extends ISaveNewsCategoryRequest {
  id: string;
}
