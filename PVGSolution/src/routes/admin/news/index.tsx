import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pencil, Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";

import { newsSearch } from "@/api/admin/adNews.api";
import type { NewsResponseModel, NewsSearchRequest } from "@/models/admin/news.model";
import { adminPaths } from "@/commons/paths";
import { useAlert } from "@/stores/useAlertStore";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function NewsListPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState<NewsResponseModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

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

  const fetchData = async () => {
    try {
      setLoading(true);

      const params: NewsSearchRequest = {
        page: 1,
        pageSize: 20,
        search,
        isPaging: true,
      };

      const res = await newsSearch(params);
      if (res.isSuccess && res.result) {
        setItems(res.result.items);
      }
    } catch {
      useAlert.getState().showError("Không tải được danh sách tin tức");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-4">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Danh sách tin tức</h1>

        <Button
          onClick={() => navigate(adminPaths.ADMIN_NEWS_CREATE)}
          variant="outline"
          className="
            flex items-center gap-2
            border-green-300
            bg-green-50
            text-green-700
            hover:bg-green-100
          "
        >
          <Plus size={16} />
          Thêm mới
        </Button>
      </div>

      {/* ===== Search ===== */}
      <div className="flex items-center justify-between">
        {/* Left 50% - Search */}
        <div className="flex gap-2 w-1/2">
          <Input
            placeholder="Nhập tiêu đề tin tức..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchData()}
          />

          <Button
            className="flex items-center gap-2"
            onClick={fetchData}
            disabled={loading}
          >
            <Search size={16} />
            Tìm kiếm
          </Button>
        </div>

        {/* Right 50% - Reserved */}
        <div className="w-1/2" />
      </div>

      {/* ===== Table ===== */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border bg-white">
        <ScrollArea className="h-full">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left w-[60px]">STT</th>
                <th className="px-4 py-3 text-left">Tiêu đề</th>
                <th className="px-4 py-3 text-center w-[120px]">Trạng thái</th>
                <th className="px-4 py-3 text-center w-[160px]">Ngày đăng</th>
                <th className="px-4 py-3 text-center w-[120px]">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="h-32 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="h-32 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                items.map((n, index) => (
                  <tr
                    key={n.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">
                      {(page - 1) * pageSize + index + 1}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      <div className="ellipsis" title={n.title}>
                        {n.title}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center">
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
                    </td>

                    <td className="px-4 py-3 text-center">
                      {new Date(n.publishDate).toLocaleString()}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            navigate(
                              adminPaths.ADMIN_NEWS_UPDATE.replace(":id", n.id)
                            )
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
