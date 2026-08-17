import { useContext } from "react";
import { ToastContext } from "@/shared/lib/toastContext";
import type { ToastContextValue } from "@/shared/lib/toastContext";

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast는 ToastProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}
