import { useEffect, useState, type JSX } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getDataCustomerRequest,
  processedCustomerRequest,
} from "@/api/admin/adRequestCustomer";
import type {
  IRequestCustomerDetail,
  IRQ_GetRequestCustomerModel,
  IRQ_ProcessedModel,
} from "@/models/admin/requestCustomer";
import { RequestCustomerLabels } from "@/commons/mappings";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAuth } from "@/auth/authContext";

export default function RequestDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { auth } = useAuth();
  const [item, setItem] = useState<IRequestCustomerDetail[]>([]);
  const [isProcessed, setIsProcessed] = useState(false);
  const [, setIsRejected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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
        // const res = await getCustomerRequestDetail(id || "");
        const res = await getDataCustomerRequest({
          requestCode: id,
        } as IRQ_GetRequestCustomerModel);
        if (!res.isSuccess) throw new Error(`HTTP ${res.statusCode}`);
        const data = res.result?.details;
        setIsProcessed(res.result?.data?.isProcessed || false);
        setIsRejected(res.result?.data?.isDeleled || false);
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

  const handleProcessed = async () => {
    try {
      if (!id) {
        setMessage({ type: "error", text: "Lỗi không tìm thấy mã đơn." });
        return;
      }

      const res = await processedCustomerRequest({
        requestCode: id,
        userName: auth.userName,
      } as IRQ_ProcessedModel);

      if (!res.isSuccess) {
        throw new Error(res.message || `HTTP ${res.message}`);
      }

      setIsProcessed(true);
      setMessage({ type: "success", text: res.message });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";

      setMessage({
        type: "error",
        text: `Lưu thất bại: ${errorMessage}`,
      });
    }
  };

  // const handleRejected = async () => {
  //   try {
  //     if (!id) {
  //       setMessage({ type: "error", text: "Lỗi không tìm thấy mã đơn." });
  //       return;
  //     }

  //     const res = await deleteCustomerRequest({
  //       requestCode: id,
  //       userDelete: auth.userName,
  //       idDetail: "",
  //     } as IRQ_DeleteRequestCustomerModel);

  //     if (!res.isSuccess) {
  //       throw new Error(res.message || `HTTP ${res.message}`);
  //     }

  //     setIsProcessed(true);
  //     setMessage({ type: "success", text: res.message });
  //   } catch (err: unknown) {
  //     const errorMessage = err instanceof Error ? err.message : "Unknown error";

  //     setMessage({
  //       type: "error",
  //       text: `Lưu thất bại: ${errorMessage}`,
  //     });
  //   }
  // };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Chi tiết yêu cầu</h1>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Link to="/admin/requests" className="text-sm text-gray-600">
          Quay lại
        </Link>
        {isProcessed ? (
          <Button
            type="button"
            className="bg-[#388700]  hover:bg-[white] hover:text-[black]"
          >
            Đã duyệt
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleProcessed}
            className="bg-[#8FA3FF] hover:bg-[white] hover:text-[black]"
          >
            <span className="flex">
              <Check className="h-5 w-5" />
              &nbsp;Duyệt
            </span>
          </Button>
        )}
      </div>
      <div>
        {message && (
          <div
            className={`mb-4 px-4 py-2 rounded ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}
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
