import type { ToastItem } from "@/shared/lib/toastContext";
import { cn } from "@/shared/lib/cn";

interface ToastViewportProps {
  toasts: ToastItem[];
}

export function ToastViewport({ toasts }: ToastViewportProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "max-w-sm rounded-xl px-4 py-3 text-sm font-medium shadow-lg",
            toast.variant === "error"
              ? "bg-ink-900 text-white"
              : "bg-brand-500 text-white",
          )}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
