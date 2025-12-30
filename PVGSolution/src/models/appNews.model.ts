export interface NewsCategory {
    id: string;        // "all" | guid
    name: string;
}

export interface NewsListItem {
    id: string;
    categoryId: string;
    title: string;
    createdDate: string; // ISO string
    thumbnail: string;
    slug: string;
    slugCategory: string;
}

export interface NewsAppInitResponse {
    categories: NewsCategory[];
    news: NewsListItem[];
}

export interface NewsDetailResponse {
    id: string;
    code: number;
    title: string;
    description: string;
    content: string;
    slug: string;

    active: boolean;
    type: number;

    needApproved: boolean;
    isApproved: boolean;
    approvedDate: string | null;
    approvedBy: string | null;

    publishDate: string;
    expireDate: string;

    imageLink: string;
    imageName: string;
    thumbnail: string;
    thumbnailName: string;

    displayOrder: number;

    categoryId: string;
    categoryName: string;

    createdBy: string | null;
    createdDate: string;
    modifiedBy: string | null;
    modifiedDate: string;
}
