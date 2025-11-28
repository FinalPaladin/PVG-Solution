import { useEffect, useState, type JSX } from "react";
import { Link, useParams } from "react-router-dom";
import { getCustomerRequestDetail } from "@/api/admin/adRequestCustomer";
import type { IRequestCustomerDetail } from "@/models/admin/requestCustomer";
import { RequestCustomerLabels } from "@/commons/mappings";

// --- Request detail page ---
export default function RequestDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<IRequestCustomerDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await getCustomerRequestDetail(id || "");
        if (!res.isSuccess) throw new Error(`HTTP ${res.statusCode}`);
        const data = res.result;
        if (!cancelled) setItem([...(data || [])]);
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
  }, [id]);

  if (loading) return <div>Đang tải chi tiết...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!item) return <div>Không tìm thấy yêu cầu.</div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Chi tiết yêu cầu</h1>
        <Link to="/admin/requests" className="text-sm text-gray-600">
          Quay lại
        </Link>
      </div>

      <div className="bg-white p-6 rounded shadow-sm space-y-4">
        <div>
          <b>Mã đơn:</b> {item[0]?.productId}
        </div>
        <div>
          <b>Số điện thoại:</b> {item[0]?.phone}
        </div>
        <div>
          <b>Ngày tạo:</b> {new Date(item[0]?.createdDate).toLocaleString()}
        </div>

        <div>
          {/* <h3 className="font-medium mb-2">Thông tin yêu cầu</h3> */}
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-sm text-gray-500">
                <th className="pr-4 pb-2">Thông tin yêu cầu</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {item.map((d, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 pr-4 text-sm text-gray-700">
                    {RequestCustomerLabels[d.key] ?? d.key}
                  </td>
                  <td className="py-2 text-sm text-gray-700">{d.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
