import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { newsSearch } from "@/api/admin/adNews.api";
import type { NewsResponseModel, NewsSearchRequest } from "@/models/admin/news.model";
import { NewsColumn, NewsColumnLabel, SortDirection, SortDirectionLabel } from "@/commons/news.enum";
import { adminPaths } from "@/commons/paths";
import { useAlert } from "@/stores/useAlertStore";

export default function NewsListPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState<NewsResponseModel[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [sortIndex, setSortIndex] = useState<NewsColumn>(NewsColumn.CreatedDate);
  const [sortType, setSortType] = useState<SortDirection>(SortDirection.Desc);

  const fetchData = async () => {
    try {
      setLoading(true);

      const params: NewsSearchRequest = {
        page: 1,
        pageSize: 20,
        search,
        sortIndex,
        sortType,
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
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Danh sách tin tức</h1>

        <Button onClick={() => navigate(adminPaths.ADMIN_NEWS_CREATE)}>
          + Tạo tin tức
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Tìm theo tiêu đề..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchData()}
          />

          <Select value={sortIndex} onValueChange={(v) => setSortIndex(v as NewsColumn)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(NewsColumn).map((c) => (
                <SelectItem key={c} value={c}>
                  {NewsColumnLabel[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={String(sortType)} onValueChange={(v) => setSortType(Number(v) as SortDirection)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(SortDirection)
                .filter((v) => typeof v === "number")
                .map((v) => (
                  <SelectItem key={v} value={String(v)}>
                    {SortDirectionLabel[v as SortDirection]}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={fetchData} disabled={loading}>
            Tìm kiếm
          </Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Tiêu đề</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3">Ngày đăng</th>
                <th className="p-3 w-[120px]">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {items.map((n) => (
                <tr key={n.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{n.title}</td>
                  <td className="p-3 text-center">
                    {n.active ? "Hiển thị" : "Ẩn"}
                  </td>
                  <td className="p-3 text-center">
                    {new Date(n.publishDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        navigate(adminPaths.ADMIN_NEWS_UPDATE.replace(":id", n.id))
                      }
                    >
                      Sửa
                    </Button>
                  </td>
                </tr>
              ))}

              {!items.length && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
}
