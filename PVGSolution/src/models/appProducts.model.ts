export interface appCategories {
  id: string;
  name: string;
}

export interface appProducts {
  id: string;
  name: string;
  productCategoryId: string;
  imageUrl: string;
  loanAmount: string;
  loanTerm: string;
}

export interface IInitProductPage {
  categories: appCategories[];
  products: appProducts[];
}
