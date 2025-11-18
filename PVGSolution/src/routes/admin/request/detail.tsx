import { useEffect, useState, type JSX } from "react";
import { Link, useParams } from "react-router-dom";
import type { RequestItem } from "../dashboard";

// --- Request detail page ---
export default function RequestDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<RequestItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/request_customer/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setItem(data);
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
        <Link
          to="/PVG-Solution/admin/requests"
          className="text-sm text-gray-600"
        >
          Back
        </Link>
      </div>

      <div className="bg-white p-6 rounded shadow-sm space-y-4">
        <div>
          <b>ID:</b> {item.id}
        </div>
        <div>
          <b>Phone:</b> {item.phone}
        </div>
        <div>
          <b>Created:</b> {new Date(item.createdAt).toLocaleString()}
        </div>

        <div>
          <h3 className="font-medium mb-2">Data</h3>
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-sm text-gray-500">
                <th className="pr-4 pb-2">Key</th>
                <th className="pb-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {item.data.map((d, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 pr-4 text-sm text-gray-700">{d.key}</td>
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
