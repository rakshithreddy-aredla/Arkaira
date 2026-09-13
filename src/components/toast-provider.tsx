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
      <div className="fixed bottom-5 right-5 z-[100] flex max-w-sm flex-col gap-2.5">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-pop-in flex items-start gap-3 rounded-2xl border px-4.5 py-3.5 shadow-xl backdrop-blur-xl ${
              t.type === "success"
                ? "border-sage-500/30 bg-sage-600/95 text-white shadow-sage-900/25"
                : t.type === "info"
                  ? "border-rose-300/40 bg-white/90 text-ink shadow-rose-900/10"
                  : "border-rose-700/40 bg-rose-700/95 text-white shadow-rose-900/25"
            }`}
          >
            {t.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0" />
            ) : t.type === "info" ? (
              <Flower2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-rose-600" />
            ) : (
              <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0" />
            )}
            <span className="flex-1 text-sm font-medium leading-snug">
              {t.message}
            </span>
            <button
              onClick={() =>
                setToasts((x) => x.filter((y) => y.id !== t.id))
              }
              className="opacity-70 transition hover:opacity-100"
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
