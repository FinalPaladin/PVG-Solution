import { useEffect, useState } from "react";
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
import { getCustomerRequest } from "@/api/admin/adRequestCustomer";
import type { IRequestCustomerItemDetails } from "@/models/admin/requestCustomer";

interface IRequestSearchParams {
  phone: string
  page: number
  pageSize: number
}

const RequestsListTable = () => {
  const [items, setItems] = useState<IRequestCustomerItemDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [requestSearchParams, setRequestSearchParams] = useState<IRequestSearchParams>({
    phone: '',
    page: 1,
    pageSize: 10
  })

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const query = buildRequestQuery(requestSearchParams)
        const res = await getCustomerRequest(query);
        if (!res.isSuccess) throw new Error(`HTTP ${res.message}`);
        const data = res.result?.items || []
        setItems([...data])
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Load error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Quản lý Yêu cầu khách</h1>
        {/* If you want a "New" button enable it here */}
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
                const fullname =
                  it.listRequestCustomer.find((d) => d.key === "fullname")?.value ??
                  "—";
                const phone =
                  it.listRequestCustomer.find((d) => d.key === "phone")?.value ??
                  "—";
                const createdAt = new Date(it.createdDate).toLocaleString();

                // example: derive a status from item (customize as needed)
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
                            navigate(`${adminPaths.REQUEST_DETAIL.replace(':id', it.requestCode)}`)
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

      {/* Optional: simple footer / count */}
      <div className="mt-4 text-sm text-gray-600">
        Tổng: {items.length} yêu cầu
      </div>
    </div>
  );
}

function buildRequestQuery(params: IRequestSearchParams): string {
  const query = Object.entries(
    params as unknown as Record<string, string | number | boolean | null | undefined>
  )
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");

  return query ? `?${query}` : "";
}

export default RequestsListTable