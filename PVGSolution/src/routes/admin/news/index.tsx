// src/pages/ProductList.tsx
import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
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
import { newsSearch } from "@/api/admin/adNews.api";
import { useAlert } from "@/stores/useAlertStore";
import type { NewsResponseModel } from "@/models/admin/news.model";

interface SearchParams {
  keyword?: string;
  page?: number;
  pageSize?: number;
}

async function searchNews(
  params: SearchParams
): Promise<{ items: NewsResponseModel[]; total: number }> {
  const res = await newsSearch({
    search: params.keyword?.trim() || undefined,
    page: params.page && params.page > 0 ? params.page : 1,
    pageSize: params.pageSize && params.pageSize > 0 ? params.pageSize : 10,
  });

  if (!res.isSuccess || !res.result) {
    return { items: [], total: 0 };
  }

  return {
    items: res.result.items,
    total: res.result.totalItems,
  };
}

export default function NewsListPage(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // list data + loading
  const [news, setNews] = useState<NewsResponseModel[]>([]);
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
        const { items, total: tot } = await searchNews({
          keyword,
          page,
          pageSize,
        });
        setNews(items);
        setTotal(tot);
      } catch (error) {
        if (error instanceof Error) {
          useAlert.getState().showError(error.message);
        } else {
          useAlert.getState().showError("Đã xảy ra lỗi không xác định");
        }
        setNews([]);
        setTotal(0);
      } finally {
        setListLoading(false);
      }
    };

    run();
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
    <>
      <div className="flex h-full flex-col gap-4">
        <h1 className="text-2xl font-semibold">Danh sách tin tức</h1>

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
            onClick={() => navigate(adminPaths.ADMIN_NEWS_CREATE)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm mới
          </Button>
        </div>

        {/* Table */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border">
          <ScrollArea className="h-full w-full">
            <Table className="table-fixed w-full">
              {/* ================= HEADER ================= */}
              <TableHeader className="sticky top-0 z-20 bg-white">
                <TableRow>
                  <TableHead className="w-[60px] text-center">STT</TableHead>

                  <TableHead>Tiêu đề</TableHead>

                  <TableHead className="w-40">Danh mục</TableHead>

                  <TableHead className="w-[120px] text-center">
                    Trạng thái
                  </TableHead>

                  <TableHead className="w-[140px] text-center">
                    Trạng thái duyệt
                  </TableHead>

                  <TableHead className="w-[140px] text-center">
                    Ngày xuất bản
                  </TableHead>

                  <TableHead className="w-[140px] text-center">
                    Ngày tạo
                  </TableHead>

                  <TableHead className="w-40">Người tạo</TableHead>

                  {/* Thao tác */}
                  <TableHead className="w-[100px] text-center">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* ================= BODY ================= */}
              <TableBody>
                {listLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-32 text-center">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : news.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="h-32 text-center text-muted-foreground"
                    >
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  news.map((n, index) => (
                    <TableRow
                      key={n.id}
                      className="hover:bg-muted/40 transition"
                    >
                      {/* STT */}
                      <TableCell className="text-center">
                        {(page - 1) * pageSize + index + 1}
                      </TableCell>

                      {/* Thumbnail + Title */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {n.thumbnail ? (
                            <img
                              src={n.thumbnail}
                              alt={n.title}
                              className="h-10 w-14 shrink-0 rounded border object-cover"
                            />
                          ) : (
                            <div className="h-10 w-14 shrink-0 rounded border bg-gray-100" />
                          )}

                          <div className="line-clamp-2 font-medium">
                            {n.title}
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell className="ellipsis">
                        {n.categoryName || "-"}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center">
                        <Badge
                          variant={n.active ? "default" : "outline"}
                          className={
                            n.active
                              ? "bg-emerald-500/90 hover:bg-emerald-500"
                              : ""
                          }
                        >
                          {n.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>

                      {/* Approval status */}
                      <TableCell className="text-center">
                        <Badge
                          variant={n.isApproved ? "default" : "outline"}
                          className={
                            n.isApproved
                              ? "bg-blue-500/90 hover:bg-blue-500"
                              : ""
                          }
                        >
                          {n.isApproved ? "Đã duyệt" : "Chưa duyệt"}
                        </Badge>
                      </TableCell>

                      {/* Publish date */}
                      <TableCell className="text-center">
                        {n.publishDate
                          ? new Date(n.publishDate)
                              .toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                              .replace(/\//g, "-")
                          : "-"}
                      </TableCell>

                      {/* Created date */}
                      <TableCell>{formatDate(n.createdDate)}</TableCell>

                      {/* Created by */}
                      <TableCell>{n.createdByName || "-"}</TableCell>

                      {/* Action */}
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            navigate(
                              adminPaths.ADMIN_NEWS_UPDATE.replace(":id", n.id)
                            )
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
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
      {listLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="flex items-center gap-2 rounded-md bg-white px-6 py-4 shadow">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Đang xử lý, vui lòng chờ...</span>
          </div>
        </div>
      )}
    </>
  );
}
