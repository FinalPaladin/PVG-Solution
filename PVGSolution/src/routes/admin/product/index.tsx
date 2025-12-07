// src/pages/ProductList.tsx
import type { JSX } from "react";
import { useEffect, useState } from "react";
import { Plus, Search, Pencil } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type ProductStatus = "active" | "inactive";

interface ProductItem {
    id: string;
    name: string;
    categoryName: string;
    loanAmount: string; // Mức vay
    loanTerm: string;   // Thời hạn vay
    status: ProductStatus;
    createdAt: string;
}

// Fake data
const ALL_PRODUCTS: ProductItem[] = [
    {
        id: "1",
        name: "Vay tín chấp theo lương",
        categoryName: "Vay tiêu dùng",
        loanAmount: "Linh hoạt",
        loanTerm: "84 tháng",
        status: "active",
        createdAt: "2025-01-10T10:30:00Z",
    },
    {
        id: "2",
        name: "Vay cầm cố giấy tờ có giá",
        categoryName: "Vay sản xuất kinh doanh",
        loanAmount: "100% GT giấy tờ có giá",
        loanTerm: "Linh hoạt",
        status: "active",
        createdAt: "2025-02-05T08:15:00Z",
    },
    {
        id: "3",
        name: "Vay tiêu dùng có tài sản bảo đảm",
        categoryName: "Vay nhu cầu bất động sản",
        loanAmount: "02 tỷ VND",
        loanTerm: "120 tháng",
        status: "inactive",
        createdAt: "2025-03-20T14:00:00Z",
    },
];

// fake search API
async function searchProducts(params: {
    keyword?: string;
}): Promise<ProductItem[]> {
    console.log("Search products với params:", params);
    await new Promise((r) => setTimeout(r, 300));

    const keyword = (params.keyword ?? "").trim().toLowerCase();
    if (!keyword) return ALL_PRODUCTS;

    return ALL_PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(keyword)
    );
}

export default function ProductList(): JSX.Element {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [products, setProducts] = useState<ProductItem[]>([]);
    const [searchInput, setSearchInput] = useState("");
    const [listLoading, setListLoading] = useState(false);

    useEffect(() => {
        const keyword = searchParams.get("keyword") ?? "";
        setSearchInput(keyword);

        const run = async () => {
            setListLoading(true);
            try {
                const data = await searchProducts({ keyword });
                setProducts(data);
            } finally {
                setListLoading(false);
            }
        };

        run();
    }, [searchParams]);

    const handleSearch = () => {
        const keyword = searchInput.trim();
        const params = new URLSearchParams(searchParams);
        if (keyword) params.set("keyword", keyword);
        else params.delete("keyword");
        setSearchParams(params);
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return "";
        return d.toLocaleString("vi-VN");
    };

    return (
        <div className="flex h-full flex-col gap-4">
            <h1 className="text-2xl font-semibold">Danh sách sản phẩm</h1>

            {/* Header actions */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-2">
                    <Input
                        placeholder="Nhập tên sản phẩm..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                    />
                    <Button type="button" onClick={handleSearch}>
                        <Search className="mr-2 h-4 w-4" />
                        Tìm kiếm
                    </Button>
                </div>

                <Button
                    type="button"
                    onClick={() => navigate("/products/new")}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm sản phẩm
                </Button>
            </div>

            {/* Table */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border">
                <ScrollArea className="h-full">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60px] text-center">STT</TableHead>
                                <TableHead>Tên sản phẩm</TableHead>
                                <TableHead>Danh mục</TableHead>
                                <TableHead>Mức vay</TableHead>
                                <TableHead>Thời hạn vay</TableHead>
                                <TableHead className="w-[120px] text-center">
                                    Trạng thái
                                </TableHead>
                                <TableHead className="w-[180px]">Ngày tạo</TableHead>
                                <TableHead className="w-[120px] text-center">
                                    Thao tác
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-32 text-center">
                                        Đang tải dữ liệu...
                                    </TableCell>
                                </TableRow>
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-32 text-center">
                                        Không có dữ liệu
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((p, index) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="text-center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>{p.name}</TableCell>
                                        <TableCell>{p.categoryName}</TableCell>
                                        <TableCell>{p.loanAmount}</TableCell>
                                        <TableCell>{p.loanTerm}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant={
                                                    p.status === "active" ? "default" : "outline"
                                                }
                                                className={
                                                    p.status === "active"
                                                        ? "bg-emerald-500/90 hover:bg-emerald-500"
                                                        : ""
                                                }
                                            >
                                                {p.status === "active" ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{formatDate(p.createdAt)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    type="button"
                                                    onClick={() => navigate(`/products/${p.id}`)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </div>
    );
}
