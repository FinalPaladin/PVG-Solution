import { useEffect, useState, type JSX } from "react";
import { Link, useParams } from "react-router-dom";
import { getCustomerRequestDetail } from "@/api/admin/adRequestCustomer";
import type { IRequestCustomerDetail } from "@/models/admin/requestCustomer";
import { RequestCustomerLabels } from "@/commons/mappings";

export default function RequestDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<IRequestCustomerDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // modal
  const [isOpen, setIsOpen] = useState(false);
  const [activeImg, setActiveImg] = useState<string | null>(null);

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

  // close modal on Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        setActiveImg(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (loading) return <div>Đang tải chi tiết...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!item || item.length === 0) return <div>Không tìm thấy yêu cầu.</div>;

  // helper: parse value into image URLs (if any)
  const extractUrls = (text?: string): string[] => {
    if (!text) return [];
    // split by comma or whitespace, trim
    const parts = text
      .split(/[\s,]+/)
      .map((p) => p.trim())
      .filter(Boolean);
    // keep only likely urls
    return parts.filter((p) => /^https?:\/\//i.test(p));
  };

  const isImageKey = (key?: string) => {
    if (!key) return false;
    const k = key.toLowerCase();
    return k.includes("image") || k.includes("hình") || k.includes("hin");
  };

  const openImage = (url: string) => {
    setActiveImg(url);
    setIsOpen(true);
  };

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
          <b>Mã đơn:</b> {id}
        </div>
        <div>
          <b>Số điện thoại:</b> {item.find((c) => c.key === "phone")?.value}
        </div>
        <div>
          <b>Ngày tạo:</b>{" "}
          {item[0]?.createdDate
            ? new Date(item[0].createdDate).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "—"}
        </div>

        <div>
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-sm text-gray-500">
                <th className="pr-4 pb-2">Thông tin yêu cầu</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {item.map((d, i) => {
                const isImg = isImageKey(d.key);
                const urls = isImg ? extractUrls(String(d.value)) : [];
                return (
                  <tr key={i} className="border-t">
                    <td className="py-2 pr-4 text-sm text-gray-700">
                      {RequestCustomerLabels[d.key] ?? d.key}
                    </td>
                    <td className="py-2 text-sm text-gray-700">
                      {isImg && urls.length > 0 ? (
                        <div className="flex gap-3 flex-wrap">
                          {urls.map((u, idx) => (
                            <img
                              key={idx}
                              src={u}
                              alt={`${d.key}-${idx}`}
                              onClick={() => openImage(u)}
                              className="w-32 h-20 object-cover rounded cursor-pointer border"
                            />
                          ))}
                        </div>
                      ) : (
                        // fallback: show raw value
                        <span>{d.value}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isOpen && activeImg && (
        // overlay
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => {
            setIsOpen(false);
            setActiveImg(null);
          }}
        >
          <div
            className="relative max-w-[90%] max-h-[90%] p-4"
            onClick={(e) => e.stopPropagation()} // prevent overlay close when clicking inside
          >
            <button
              className="absolute top-2 right-2 text-white bg-black/50 rounded-full px-3 py-1 text-lg"
              onClick={() => {
                setIsOpen(false);
                setActiveImg(null);
              }}
              aria-label="Close image"
            >
              ✕
            </button>
            <img
              src={activeImg}
              alt="Preview"
              className="max-w-full max-h-[80vh] rounded shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
