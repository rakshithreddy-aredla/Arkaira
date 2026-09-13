"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, AlertCircle, X, Flower2 } from "lucide-react";

type Toast = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
};

const ToastContext = createContext<{
  toast: (message: string, type?: "success" | "error" | "info") => void;
}>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, 3800);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-pop-in flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${
              t.type === "success"
                ? "border-green-200 bg-surface text-ink"
                : t.type === "info"
                  ? "border-line bg-surface text-ink"
                  : "border-accent-line bg-accent-soft text-ink"
            }`}
          >
            {t.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-ok" />
            ) : t.type === "info" ? (
              <Flower2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-accent" />
            ) : (
              <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-accent" />
            )}
            <span className="flex-1 text-[13px] font-medium leading-snug">
              {t.message}
            </span>
            <button
              onClick={() =>
                setToasts((x) => x.filter((y) => y.id !== t.id))
              }
              className="text-ink-3 transition-colors hover:text-ink"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
