import { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import type { RequestItem } from "../dashboard";

export default function RequestsList(): JSX.Element {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Example: call your API to fetch requests. Change URL to your backend.
        const res = await fetch("/api/request_customer/list");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          // assume API returns array of items
          setItems(Array.isArray(data) ? data : data.items ?? []);
        }
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
        {/* <Link
          to="/admin/requests/new"
          className="px-3 py-2 bg-green-600 text-white rounded"
        >
          Tạo yêu cầu mới
        </Link> */}
      </div>

      {loading && <div>Đang tải...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="space-y-3">
        {items.length === 0 && !loading ? (
          <div className="bg-white p-6 rounded shadow-sm">
            Không có yêu cầu.
          </div>
        ) : (
          items.map((it) => (
            <div
              key={it.id}
              className="bg-white p-4 rounded shadow-sm flex items-center justify-between"
            >
              <div>
                <div className="text-lg font-medium">
                  {it.fullname ??
                    it.data.find((d) => d.key === "fullname")?.value ??
                    "—"}
                </div>
                <div className="text-sm text-gray-600">
                  {it.phone} · {new Date(it.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(`/admin/requests/${it.id}`)}
                  className="px-3 py-2 border rounded hover:bg-gray-50"
                >
                  Detail
                </button>
                <button
                  onClick={async () => {
                    if (!confirm("Xác nhận xoá yêu cầu?")) return;
                    try {
                      const r = await fetch(`/api/request_customer/${it.id}`, {
                        method: "DELETE",
                      });
                      if (!r.ok) throw new Error(`HTTP ${r.status}`);
                      setItems((s) => s.filter((x) => x.id !== it.id));
                    } catch (err: unknown) {
                      alert(
                        err instanceof Error ? err.message : "Delete failed"
                      );
                    }
                  }}
                  className="px-3 py-2 border rounded text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
