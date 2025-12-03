import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Skeleton } from "@/components/ui/skeleton";
import { adminPaths } from "@/commons/paths";
import { getCustomerRequest } from "@/api/admin/adRequestCustomer";
import type { IRequestCustomerItemDetails } from "@/models/admin/requestCustomer";

interface IRequestSearchParams {
  phone: string;
  page: number;
  pageSize: number;
}

const RequestsListTable = () => {
  const [items, setItems] = useState<IRequestCustomerItemDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [requestSearchParams, setRequestSearchParams] =
    useState<IRequestSearchParams>({
      phone: "",
      page: 1,
      pageSize: 10,
    });

  // state cho ô input search (để gõ mà không gọi API liên tục)
  const [searchPhone, setSearchPhone] = useState("");

  // ---- HÀM LOAD DATA TÁCH RIÊNG RA ----
  const loadData = useCallback(async (params: IRequestSearchParams) => {
    setLoading(true);
    setError(null);
    try {
      const query = buildRequestQuery(params);
      const res = await getCustomerRequest(query);
      if (!res.isSuccess) throw new Error(`HTTP ${res.message}`);
      const data = res.result?.items || [];
      setItems([...data]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Load error");
    } finally {
      setLoading(false);
    }
  }, []);

  // gọi lại loadData mỗi khi requestSearchParams đổi (lần đầu và khi search)
  useEffect(() => {
    loadData(requestSearchParams);
  }, [loadData, requestSearchParams]);

  // ---- HANDLE SEARCH ----
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setRequestSearchParams((prev) => ({
      ...prev,
      phone: searchPhone.trim(),
      page: 1, // search thì về page 1
    }));
    // không cần gọi loadData ở đây, useEffect sẽ tự bắn lại khi state đổi
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Quản lý Yêu cầu khách</h1>

        {/* form search: Enter hoặc click nút đều chạy handleSearch */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <Input
            placeholder="Tìm theo SĐT..."
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="w-64"
          />
          <Button type="submit">Tìm kiếm</Button>
        </form>

        {/* Nếu muốn nút tạo mới thì thêm bên này hoặc chuyển vào form */}
        {/* <Button onClick={() => navigate('/admin/requests/new')}>Tạo yêu cầu mới</Button> */}
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="overflow-auto rounded border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Khách hàng</TableHead>
              <TableHead>Liên hệ / Thời gian</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // show 6 skeleton rows while loading
              Array.from({ length: 6 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="flex flex-col">
                      <Skeleton className="h-4 w-48 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="p-6 text-center text-sm text-gray-600">
                    Không có yêu cầu.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((it) => {
                const fullname = it.fullName ?? "—";
                const phone = it.phone ?? "—";
                const createdAt = new Date(it.strCreatedDate).toLocaleString(
                  "vi-VN",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }
                );

                const status: string =
                  (it as unknown as { status?: string }).status ?? "new";

                return (
                  <TableRow key={it.requestCode}>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="font-medium">{fullname}</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm">{phone}</div>
                      <div className="text-xs text-gray-500">{createdAt}</div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="uppercase">
                        {status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() =>
                            navigate(
                              `${adminPaths.ADMIN_REQUEST_DETAIL.replace(
                                ":id",
                                it.requestCode
                              )}`
                            )
                          }
                          size="sm"
                        >
                          Chi tiết
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Tổng: {items.length} yêu cầu
      </div>
    </div>
  );
};

function buildRequestQuery(params: IRequestSearchParams): string {
  const query = Object.entries(
    params as unknown as Record<
      string,
      string | number | boolean | null | undefined
    >
  )
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");

  return query ? `?${query}` : "";
}

export default RequestsListTable;
