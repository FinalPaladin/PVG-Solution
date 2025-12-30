import { create } from "zustand";

export type ToastType = "error" | "success" | "warning";

type ErrorState = {
  open: boolean;
  message: string;
  type: ToastType;
  // unified show: truyền message + type (mặc định 'error')
  show: (msg: string, type?: ToastType) => void;
  // backward-compatible
  showError: (msg: string) => void;
  close: () => void;
};

export const useAlert = create<ErrorState>((set) => ({
  open: false,
  message: "",
  type: "error",
  show: (msg: string, type: ToastType = "error") =>
    set({ open: true, message: msg, type }),
  // keep old API working for minimal changes
  showError: (msg: string) => set({ open: true, message: msg, type: "error" }),
  close: () => set({ open: false, message: "" }),
}));
