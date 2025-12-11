import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import {
  exportDataCustomerRequest,
  getCustomerRequest,
} from "@/api/admin/adRequestCustomer";
import type { IRequestCustomerItemDetails } from "@/models/admin/requestCustomer";
import { ChevronLeft, ChevronRight, Download, ReceiptText, Search } from "lucide-react";

interface IRequestSearchParams {
  phone: string;
  fullName: string;
  isProcessed: boolean;
  page: number;
  pageSize: number;
}

const searchObj = {
  phone: "",
  fullName: "",
  isProcessed: false,
}

const RequestsListTable = () => {
  const [items, setItems] = useState<IRequestCustomerItemDetails[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [requestSearchParams, setRequestSearchParams] =
    useState<IRequestSearchParams>({
      phone: "",
      fullName: "",
      isProcessed: false,
      page: 1,
      pageSize: 10,
    });

  // state cho ô input search (để gõ mà không gọi API liên tục)
  const [search, setSearch] = useState(searchObj);

  const [total, setTotal] = useState<number>(0);
  const [listLoading, setListLoading] = useState(false);

  // ---- HÀM LOAD DATA TÁCH RIÊNG RA ----
  const loadData = useCallback(async (params: IRequestSearchParams) => {
    setListLoading(true);
    setError(null);
    try {
      const query = buildRequestQuery(params);
      const res = await getCustomerRequest(query);
      if (!res.isSuccess) throw new Error(`HTTP ${res.message}`);
      const data = res.result?.items || [];
      setItems([...data]);
      
      setTotal(res?.result?.totalItems ? res?.result?.totalItems : 0);
    } catch (err: unknown) {
      setTotal(0);
      setError(err instanceof Error ? err.message : "Load error");
    } finally {
      setListLoading(false);
    }
  }, []);

  // gọi lại loadData mỗi khi requestSearchParams đổi (lần đầu và khi search)
  useEffect(() => {
    loadData(requestSearchParams);
  }, [loadData, requestSearchParams.page, requestSearchParams.pageSize]);

  // ---- HANDLE SEARCH ----
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const params = {
      ...requestSearchParams,
      phone: search.phone.trim(),
      fullName: search.fullName,
      isProcessed: search.isProcessed,
      page: 1
    };
    setRequestSearchParams(params);
    loadData(params);
    // không cần gọi loadData ở đây, useEffect sẽ tự bắn lại khi state đổi
  };

  const handleExport = async () => {
    const query = buildRequestQuery(requestSearchParams);
    const res = await exportDataCustomerRequest(query);

    if (!(res instanceof Blob)) {
      console.log("Response is not a Blob", res);
      return;
    }

    const url = window.URL.createObjectURL(res);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Report.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const lastPage = Math.max(1, Math.ceil(total / requestSearchParams.pageSize));
  const startItem = (requestSearchParams.page - 1) * requestSearchParams.pageSize + 1;
  const endItem = Math.min(total, requestSearchParams.page * requestSearchParams.pageSize);
  
  const goToPage = (p: number) => {
    const lastPage = Math.max(1, Math.ceil(total / requestSearchParams.pageSize));
    const np = Math.max(1, Math.min(p, lastPage));
    setRequestSearchParams({...requestSearchParams, page: np});
  };

  const changePageSize = (ps: number) => {
    setRequestSearchParams({...requestSearchParams, pageSize: ps});
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Quản lý Yêu cầu khách</h1>

        <Button type="button" onClick={handleExport} className="bg-[#388700]">
          <span className="flex">
            <Download className="h-5 w-5" />
            &nbsp;Tải báo cáo
          </span>
        </Button>
        {/* Nếu muốn nút tạo mới thì thêm bên này hoặc chuyển vào form */}
        {/* <Button onClick={() => navigate('/admin/requests/new')}>Tạo yêu cầu mới</Button> */}
      </div>

      <div className="grid grid-cols-3 gap-4 bg-white p-6 rounded shadow-sm">
        <div className=" rid-cols-1">
            <input
              type="tel"
              placeholder="Tìm theo số điện thoại khách hàng..."
              value={search.phone}
              onChange={(e) => setSearch({...search, phone: e.target.value})}
              className="border border-gray-200 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            <input
              type="tel"
              value={search.fullName}
              onChange={(e) => setSearch({...search, fullName: e.target.value})}
              className="border border-gray-200 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 mt-2"
              placeholder="Tìm theo tên khách hàng..."
            />
        </div>
        <div className="grid-cols-1">
          <select className="w-full px-3 py-2 border rounded-md"
          defaultValue={"false"}
          onChange={(e) => {setSearch({...search, isProcessed: e.target.value === "true" ? true : false});}}>
              <option value={"false"}>Chưa duyệt</option>
              <option value={"true"}>Đã duyệt</option>
          </select>
        </div>
        <div className="grid-cols-1">
          <div className="flex items-center justify-between">
            <Button type="button" className="bg-[#a8a8a8]" onClick={handleSearch}>
              <span className="flex">
                <Search className="h-5 w-5" />
                &nbsp;Tìm kiếm
              </span>
            </Button>
          </div>
        </div>
      </div>
      
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="overflow-auto rounded border mt-5">
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
            {listLoading ? (
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

                const status: string = it.isProcessed == true ? "Đã duyệt" : "Chờ duyệt";

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
                          className="bg-[#6b92d6]"
                        >
                          <span className="flex">
                            <ReceiptText className="h-5 w-5" />
                            &nbsp;Chi tiết
                          </span>
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
                onClick={() => goToPage(requestSearchParams.page - 1)}
                disabled={requestSearchParams.page <= 1 || listLoading}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-2">
                <span>{requestSearchParams.page}</span>
                <span className="mx-1">/</span>
                <span>{lastPage}</span>
              </div>
              <Button
                size="icon"
                variant="outline"
                onClick={() => goToPage(requestSearchParams.page + 1)}
                disabled={requestSearchParams.page >= lastPage || listLoading}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm">Kết quả / Trang</label>
              <select
                value={requestSearchParams.pageSize}
                onChange={(e) => changePageSize(parseInt(e.target.value, 10))}
                className="rounded border px-2 py-1"
                disabled={listLoading}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
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
