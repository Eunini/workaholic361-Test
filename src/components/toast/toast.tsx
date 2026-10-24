"use client";

import { useState } from "react";
import { CircleAlert, CircleCheck, X } from "lucide-react";
import styles from "./toast.module.css";

export type ToastType = "success" | "error";

export type ToastData = {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
};

const ICONS = { success: CircleCheck, error: CircleAlert };

type Props = {
  toast: ToastData;
  onRemove: (id: number) => void;
};

// The progress bar is the timer: when it finishes, the toast slides out.
// Hovering pauses it (see toast.module.css).
export function Toast({ toast, onRemove }: Props) {
  const [leaving, setLeaving] = useState(false);
  const Icon = ICONS[toast.type];

  function handleAnimationEnd(event: React.AnimationEvent) {
    if (leaving && event.target === event.currentTarget) onRemove(toast.id);
  }

  return (
    <div
      className={styles.toast}
      data-type={toast.type}
      data-leaving={leaving}
      onAnimationEnd={handleAnimationEnd}
    >
      <Icon size={20} className={styles.icon} aria-hidden="true" />
      <div className={styles.body}>
        <p className={styles.title}>{toast.title}</p>
        {toast.message && <p className={styles.message}>{toast.message}</p>}
      </div>
      <button
        type="button"
        className={styles.close}
        aria-label="Dismiss notification"
        onClick={() => setLeaving(true)}
      >
        <X size={16} />
      </button>
      <span
        className={styles.progress}
        onAnimationEnd={(event) => {
          event.stopPropagation();
          setLeaving(true);
        }}
      />
    </div>
  );
}
