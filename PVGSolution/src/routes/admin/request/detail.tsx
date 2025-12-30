import { useEffect, useState, type JSX } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getDataCustomerRequest,
  processedCustomerRequest,
} from "@/api/admin/adRequestCustomer";
import type {
  IRequestCustomerDetail,
  IRequestCustomerItemDetails,
  IRQ_GetRequestCustomerModel,
  IRQ_ProcessedModel,
} from "@/models/admin/requestCustomer";
import { RequestCustomerLabels } from "@/commons/mappings";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAuth } from "@/auth/authContext";
import { useAlert } from "@/stores/useAlertStore";
import { adminPaths } from "@/commons/paths";

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
  const [request, setRequest] = useState<IRequestCustomerItemDetails>({} as IRequestCustomerItemDetails);

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
        setRequest(res.result?.data as IRequestCustomerItemDetails);
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
      useAlert.getState().show(res.message, "success");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";

      useAlert.getState().showError(`${errorMessage}`);
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
          <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 lg:px-0 space-y-4">

            {/* Header */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Chi tiết yêu cầu
                <span className="block sm:inline text-sm sm:text-base font-normal text-gray-500">
                  {" / "}{request.productName}
                </span>
              </h1>
            </div>

            {/* Action bar */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to={adminPaths.ADMIN_REQUESTS}
                className="inline-flex items-center justify-center gap-2
                          rounded-lg border border-gray-300
                          px-4 py-2 text-sm font-medium
                          text-green-700
                          bg-gradient-to-r from-green-50 to-green-100
                        hover:from-green-100 hover:to-green-200 transition-all"
              >
                ← Quay lại
              </Link>

              {isProcessed ? (
                <span className="inline-flex items-center justify-center
                                rounded-lg px-4 py-2 text-sm font-medium
                                bg-emerald-600 text-white">
                  Đã hoàn tất
                </span>
              ) : (
                <Button
                  type="button"
                  onClick={handleProcessed}
                  className="inline-flex items-center justify-center gap-2
                            rounded-lg px-4 py-2 text-sm font-medium
                            text-white
                            bg-gradient-to-r from-blue-500 to-indigo-600
                            hover:from-blue-600 hover:to-indigo-700
                            focus:ring-2 focus:ring-indigo-200 transition"
                >
                  <Check className="h-4 w-4" />
                  Xác nhận
                </Button>
              )}
            </div>

            {/* Message */}
            {message && (
              <div
                className={`rounded-lg px-4 py-3 text-sm font-medium
                  ${
                    message.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
              >
                {message.text}
              </div>
            )}

            {/* Summary */}
            <div className="rounded-xl bg-white shadow-sm border p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Mã đơn</span>
                  <div className="font-medium text-gray-800">{id}</div>
                </div>

                <div>
                  <span className="text-gray-500">Loại sản phẩm</span>
                  <div className="font-medium text-gray-800">{request.productName}</div>
                </div>

                <div>
                  <span className="text-gray-500">Số điện thoại</span>
                  <div className="font-medium text-gray-800">
                    {item.find(c => c.key === "phone")?.value}
                  </div>
                </div>

                <div>
                  <span className="text-gray-500">Ngày tạo</span>
                  <div className="font-medium text-gray-800">
                    {item[0]?.createdDate
                      ? new Date(item[0].createdDate).toLocaleString("vi-VN")
                      : "—"}
                  </div>
                </div>
              </div>
            </div>

              {/* Detail – Mobile */}
      <div className="block sm:hidden space-y-3">
        {item.map((d, i) => {
          const isImg = isImageKey(d.key);
          const urls = isImg ? extractUrls(String(d.value)) : [];

          return (
            <div
              key={i}
              className="rounded-lg border bg-white p-3 shadow-sm"
            >
              <div className="text-xs font-medium text-gray-500 mb-1">
                {RequestCustomerLabels[d.key] ?? d.key}
              </div>

              {isImg && urls.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {urls.map((u, idx) => (
                    <img
                      key={idx}
                      src={u}
                      onClick={() => openImage(u)}
                      className="h-20 w-28 rounded-lg object-cover border cursor-pointer"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-800 break-words">
                  {d.value || "—"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail – Desktop */}
      <div className="hidden sm:block rounded-xl bg-white shadow-sm border overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50 text-sm font-medium text-gray-700">
          Thông tin yêu cầu
        </div>

        <table className="w-full text-sm">
          <tbody>
            {item.map((d, i) => {
              const isImg = isImageKey(d.key);
              const urls = isImg ? extractUrls(String(d.value)) : [];

              return (
                <tr key={i} className="border-t">
                  <td className="w-1/3 px-4 py-3 text-gray-500 align-top">
                    {RequestCustomerLabels[d.key] ?? d.key}
                  </td>

                  <td className="px-4 py-3 text-gray-800">
                    {isImg && urls.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {urls.map((u, idx) => (
                          <img
                            key={idx}
                            src={u}
                            onClick={() => openImage(u)}
                            className="h-20 w-32 object-cover rounded-lg border cursor-pointer hover:opacity-90"
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="break-words">{d.value || "—"}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Image modal */}
      {isOpen && activeImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => {
            setIsOpen(false);
            setActiveImg(null);
          }}
        >
          <div
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-3 -right-3
                        rounded-full bg-black/70 text-white
                        w-8 h-8 flex items-center justify-center"
              onClick={() => {
                setIsOpen(false);
                setActiveImg(null);
              }}
            >
              ✕
            </button>

            <img
              src={activeImg}
              className="max-h-[85vh] rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
