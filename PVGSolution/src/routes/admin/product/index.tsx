// src/pages/ProductList.tsx
import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import { Plus, Search, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
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
import { adminPaths } from "@/commons/paths";

type ProductStatus = "active" | "inactive";

interface ProductItem {
  id: string;
  name: string;
  categoryName: string;
  loanAmount: string; // Mức vay
  loanTerm: string; // Thời hạn vay
  status: ProductStatus;
  createdAt: string;
}

// Fake data (keep as your seed; real API will replace searchProducts)
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
  // ... bạn có thể thêm dữ liệu test để kiểm tra paging
];

interface SearchParams {
  keyword?: string;
  page?: number;
  pageSize?: number;
}

// Fake search API but with paging and total to simulate server-side
async function searchProducts(
  params: SearchParams
): Promise<{ items: ProductItem[]; total: number }> {
  console.log("Search products với params:", params);
  await new Promise((r) => setTimeout(r, 300)); // simulate delay

  const keyword = (params.keyword ?? "").trim().toLowerCase();
  let filtered = ALL_PRODUCTS;
  if (keyword) {
    filtered = ALL_PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(keyword)
    );
  }

  const total = filtered.length;
  const page = params.page && params.page > 0 ? params.page : 1;
  const pageSize =
    params.pageSize && params.pageSize > 0 ? params.pageSize : 10;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return { items, total };
}

export default function ProductList(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // list data + loading
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [listLoading, setListLoading] = useState(false);

  // search input + ref
  const [searchInput, setSearchInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // pagination (stored in URL)
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSizeParam = parseInt(searchParams.get("pageSize") ?? "10", 10);

  const [page, setPage] = useState<number>(
    isNaN(pageParam) || pageParam < 1 ? 1 : pageParam
  );
  const [pageSize, setPageSize] = useState<number>(
    isNaN(pageSizeParam) || pageSizeParam < 1 ? 10 : pageSizeParam
  );
  const [total, setTotal] = useState<number>(0);

  // keep local state in sync when URL changes (back/forward)
  useEffect(() => {
    const p = parseInt(searchParams.get("page") ?? "1", 10);
    const ps = parseInt(searchParams.get("pageSize") ?? "10", 10);

    setPage(isNaN(p) || p < 1 ? 1 : p);
    setPageSize(isNaN(ps) || ps < 1 ? 10 : ps);

    const keyword = searchParams.get("keyword") ?? "";
    setSearchInput(keyword);
    // fetch will happen in effect below
  }, [searchParams]);

  // fetch when keyword/page/pageSize (or _ts) changes
  useEffect(() => {
    const keyword = searchParams.get("keyword") ?? "";

    const run = async () => {
      setListLoading(true);
      try {
        const { items, total: tot } = await searchProducts({
          keyword,
          page,
          pageSize,
        });
        setProducts(items);
        setTotal(tot);
      } catch (err) {
        console.error("Failed to load products", err);
        setProducts([]);
        setTotal(0);
      } finally {
        setListLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, page, pageSize]);

  // helper to update searchParams -> include _ts to force change even if same keyword
  const applySearchParams = (updates: {
    keyword?: string | null;
    page?: number | null;
    pageSize?: number | null;
  }) => {
    const params = new URLSearchParams(searchParams);

    if (typeof updates.keyword !== "undefined") {
      if (updates.keyword && updates.keyword.trim())
        params.set("keyword", updates.keyword.trim());
      else params.delete("keyword");
    }

    if (typeof updates.page !== "undefined") {
      if (updates.page && updates.page > 1)
        params.set("page", String(updates.page));
      else params.delete("page");
    }

    if (typeof updates.pageSize !== "undefined") {
      if (updates.pageSize && updates.pageSize !== 10)
        params.set("pageSize", String(updates.pageSize));
      else params.delete("pageSize");
    }

    // add timestamp to force URL change even when keyword hasn't changed (so user can refresh)
    params.set("_ts", String(Date.now()));

    setSearchParams(params);
  };

  const handleSearch = () => {
    applySearchParams({ keyword: searchInput || null, page: 1 });
  };

  // clear input only (do not reload data)
  const handleClearSearch = () => {
    setSearchInput("");
    if (inputRef.current) inputRef.current.focus();
  };

  const goToPage = (p: number) => {
    const lastPage = Math.max(1, Math.ceil(total / pageSize));
    const np = Math.max(1, Math.min(p, lastPage));
    setPage(np);
    applySearchParams({ page: np });
  };

  const changePageSize = (ps: number) => {
    setPageSize(ps);
    applySearchParams({ pageSize: ps === 10 ? null : ps, page: 1 });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("vi-VN");
  };

  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(total, page * pageSize);

  return (
    <div className="flex h-full flex-col gap-4">
      <h1 className="text-2xl font-semibold">Danh sách sản phẩm</h1>

      {/* Header actions */}
      <div className="flex items-center justify-between gap-4">
        {/* left: search group */}
        <div className="flex w-full items-center gap-3">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              placeholder="Nhập tên sản phẩm..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="w-full pr-10"
            />

            {/* clear (transparent SVG) */}
            {searchInput !== "" && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-800 transition bg-transparent"
                aria-label="Clear input"
                title="Clear"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <Button type="button" onClick={handleSearch} className="shrink-0">
            <Search className="mr-2 h-4 w-4" />
            Tìm kiếm
          </Button>
        </div>

        {/* right: add product */}
        <Button
          type="button"
          onClick={() => navigate(adminPaths.ADMIN_PRODUCT_NEW)}
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
                      {(page - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.categoryName}</TableCell>
                    <TableCell>{p.loanAmount}</TableCell>
                    <TableCell>{p.loanTerm}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={p.status === "active" ? "default" : "outline"}
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

      {/* Pagination controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          {total === 0
            ? "0 items"
            : `Hiển thị ${startItem} - ${endItem} trên ${total} mục`}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1 || listLoading}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-2">
              <span>{page}</span>
              <span className="mx-1">/</span>
              <span>{lastPage}</span>
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={() => goToPage(page + 1)}
              disabled={page >= lastPage || listLoading}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">Kết quả / Trang</label>
            <select
              value={pageSize}
              onChange={(e) => changePageSize(parseInt(e.target.value, 10))}
              className="rounded border px-2 py-1"
              disabled={listLoading}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
