/* =========================
 * MData Group Enum
 * ========================= */
export const MDataEnumGroup = {
    PRODUCT_CATEGORY: 1,
    PRODUCT_AMOUNT: 2,
    PRODUCT_TIME: 3,
    PRODUCT_CATEGORY_DETAIL: 4,
} as const;

export type MDataEnumGroup = typeof MDataEnumGroup[keyof typeof MDataEnumGroup];

/* =========================
 * Display Name Map
 * ========================= */
export const MDataEnumGroupLabel: Record<MDataEnumGroup, string> = {
    [MDataEnumGroup.PRODUCT_CATEGORY]: "Danh mục sản phẩm",
    [MDataEnumGroup.PRODUCT_AMOUNT]: "Mức vay",
    [MDataEnumGroup.PRODUCT_TIME]: "Thời hạn vay",
    [MDataEnumGroup.PRODUCT_CATEGORY_DETAIL]: "Chi tiết danh mục sản phẩm",
};

/* =========================
 * Helper
 * ========================= */
export function getMDataGroupLabel(value?: MDataEnumGroup): string {
    return value ? MDataEnumGroupLabel[value] : "";
}


/* =========================
 * Sort Direction
 * ========================= */
export const SortDirection = {
    Asc: 0,
    Desc: 1,
} as const

export type SortDirection = typeof SortDirection[keyof typeof SortDirection];

/* =========================
 * Display Label
 * ========================= */
export const SortDirectionLabel: Record<SortDirection, string> = {
    [SortDirection.Asc]: "Tăng dần",
    [SortDirection.Desc]: "Giảm dần",
};

/* =========================
 * Helper
 * ========================= */
export function getSortDirectionLabel(
    value?: SortDirection
): string {
    return value !== undefined ? SortDirectionLabel[value] : "";
}

/* =========================
 * Options (Select)
 * ========================= */
export const SortDirectionOptions = [
    { value: SortDirection.Asc, label: "Tăng dần" },
    { value: SortDirection.Desc, label: "Giảm dần" },
];


/* =========================
 * SORT COLUMN
 * ========================= */
export const NewsColumn = {
    PublishDate: "PublishDate",
    CreatedDate: "CreatedDate",
    DisplayOrder: "DisplayOrder",
} as const;

export type NewsColumn = typeof NewsColumn[keyof typeof NewsColumn];

export const NewsColumnLabel: Record<NewsColumn, string> = {
    [NewsColumn.PublishDate]: "Ngày đăng",
    [NewsColumn.CreatedDate]: "Ngày tạo",
    [NewsColumn.DisplayOrder]: "Thứ tự hiển thị",
};