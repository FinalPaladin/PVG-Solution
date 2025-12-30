// src/components/common/GlobalErrorAlert.tsx
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, type JSX } from "react";
import { useAlert, type ToastType } from "@/stores/useAlertStore";

const TYPE_CONFIG: Record<
  ToastType,
  { variant?: string; icon: JSX.Element; autoCloseMs: number; title: string }
> = {
  error: {
    variant: "destructive",
    icon: <XCircle className="h-5 w-5" />,
    autoCloseMs: 4000,
    title: "Lỗi hệ thống",
  },
  success: {
    variant: "default",
    icon: <CheckCircle className="h-5 w-5" />,
    autoCloseMs: 2500,
    title: "Thành công",
  },
  warning: {
    variant: "warning",
    icon: <AlertTriangle className="h-5 w-5" />,
    autoCloseMs: 3500,
    title: "Cảnh báo",
  },
};

export function GlobalErrorAlert() {
  const open = useAlert((s) => s.open);
  const message = useAlert((s) => s.message);
  const type = useAlert((s) => s.type);
  const close = useAlert((s) => s.close);

  useEffect(() => {
    if (!open) return;
    const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.error;
    const t = setTimeout(() => close(), cfg.autoCloseMs);
    return () => clearTimeout(t);
  }, [open, close, type]);

  if (!open) return null;

  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.error;

  // If your Alert supports a `variant` prop use it; otherwise we set classes.
  // Here we try to use variant prop (as original used 'destructive'), and fallback to className.
  const variantProp = cfg.variant
    ? { variant: cfg.variant as "destructive" | "default" }
    : {};
  const classByType =
    type === "error"
      ? "shadow-lg"
      : type === "success"
      ? "shadow-lg border bg-emerald-50"
      : "shadow-lg border bg-yellow-50";

  return (
    <div className="fixed top-4 right-4 z-50 w-[340px]">
      <Alert {...variantProp} className={classByType}>
        {cfg.icon}
        <div className="flex flex-col">
          <AlertTitle className="text-sm">{cfg.title}</AlertTitle>
          <AlertDescription className="text-sm line-clamp-3">
            {message}
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
}
