import { useCallback, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ToastViewport } from "@/shared/components/ToastViewport";
import { ToastContext } from "@/shared/lib/toastContext";
import type { ToastItem, ToastVariant } from "@/shared/lib/toastContext";

const DURATION = 2600;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const sequence = useRef(0);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "error") => {
      sequence.current += 1;
      const id = sequence.current;

      setToasts((current) => [...current, { id, message, variant }]);
      setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, DURATION);
    },
    [],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext value={value}>
      {children}
      <ToastViewport toasts={toasts} />
    </ToastContext>
  );
}
