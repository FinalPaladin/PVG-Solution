// src/components/common/GlobalErrorAlert.tsx
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect } from "react";
import { useErrorStore } from "@/stores/useErrorStore";

export function GlobalErrorAlert() {
  const open = useErrorStore((s) => s.open);
  const message = useErrorStore((s) => s.message);
  const close = useErrorStore((s) => s.close);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => close(), 4000); // tự tắt sau 4s
    return () => clearTimeout(t);
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="fixed top-4 right-4 z-9999 w-[340px]">
      <Alert variant="destructive" className="shadow-lg">
        <AlertTriangle className="h-5 w-5" />
        <div className="flex flex-col">
          <AlertTitle className="text-sm">Lỗi hệ thống</AlertTitle>
          <AlertDescription className="text-sm line-clamp-3">
            {message}
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
}
