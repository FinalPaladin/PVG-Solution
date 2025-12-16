export interface ProductModel {
  productCategoryId: string;
  productCategory: string;
  name: string;
  loanAmountId: number;
  loanAmount: string;
  loanTermId: number;
  loanTerm: string;
  imageUrl: string;
  inactive: boolean;
}

// =========================
// Search
// =========================
export interface ProductSearchRequest {
  filterKeyword?: string;
  productCategoryId?: string;
  page: number;
  pageSize: number;
}

// =========================
// Detail
// =========================
export interface ProductDetailModel {
  id?: string;
  productDetailCategoryId: number;
  title: string;
  content: string;
  tempId: string;
}

export interface ProductDetailUpdateModel extends ProductDetailModel {
  id: string;
}

// =========================
// Create
// =========================
export interface ProductCreateRequest extends ProductModel {
  userName: string;
  details: ProductDetailModel[];
}

// =========================
// Update
// =========================
export interface ProductUpdateRequest extends ProductModel {
  id?: string;
  userName: string;
  details: ProductDetailUpdateModel[];
}

// =========================
// Response
// =========================
export interface ProductResponseModel extends ProductModel {
  id: string;
  createdBy?: string;
  createdByName?: string;
  createdDate: string;
  modifiedBy?: string;
  modifiedByName?: string;
  modifiedDate?: string;
  details: ProductDetailResponseModel[];
}

export interface ProductDetailResponseModel extends ProductDetailModel {
  id: string;
  productId: string;
}
