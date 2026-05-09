"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error" | "info" | "warn";
type ToastItem = { id: number; msg: string; type: ToastType };

const ToastContext = createContext<{
  toast: (msg: string, type?: ToastType) => void;
}>({ toast: () => {} });

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((msg: string, type: ToastType = "info") => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dotColor = (t: ToastType) =>
    t === "success" ? "var(--green)" : t === "error" ? "var(--red)" : t === "warn" ? "var(--orange)" : "var(--blue)";

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position: "fixed", bottom: 22, right: 22, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((t) => (
          <div key={t.id} className="toast" style={{ position: "static" }}>
            <span className="t-dot" style={{ background: dotColor(t.type) }} />
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
