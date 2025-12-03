import { create } from "zustand";

type ErrorState = {
  open: boolean;
  message: string;
  showError: (msg: string) => void;
  close: () => void;
};

export const useErrorStore = create<ErrorState>((set) => ({
  open: false,
  message: "",
  showError: (msg: string) => set({ open: true, message: msg }),
  close: () => set({ open: false, message: "" }),
}));
