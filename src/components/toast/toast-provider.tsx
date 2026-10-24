"use client";

import { createContext, useContext, useMemo, useRef, useState } from "react";
import { Toast, type ToastData, type ToastType } from "./toast";
import styles from "./toast.module.css";

type ToastApi = {
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
};

const MAX_VISIBLE = 3;

const ToastContext = createContext<ToastApi | null>(null);

export function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error("useToast must be used inside <ToastProvider>");
  return toast;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const nextId = useRef(0);

  const api = useMemo<ToastApi>(() => {
    function show(type: ToastType, title: string, message?: string) {
      const toast = { id: ++nextId.current, type, title, message };
      setToasts((list) => [...list, toast].slice(-MAX_VISIBLE));
    }
    return {
      success: (title, message) => show("success", title, message),
      error: (title, message) => show("error", title, message),
    };
  }, []);

  function remove(id: number) {
    setToasts((list) => list.filter((toast) => toast.id !== id));
  }

  return (
    <ToastContext value={api}>
      {children}
      <section
        className={styles.viewport}
        aria-label="Notifications"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={remove} />
        ))}
      </section>
    </ToastContext>
  );
}
