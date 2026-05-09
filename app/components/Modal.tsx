"use client";

import { useEffect } from "react";
import { XIcon } from "./Icons";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg";
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export function Modal({ open, onClose, title, size = "md", footer, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="ov" onClick={onClose}>
      <div className={`modal ${size === "lg" ? "lg" : size === "sm" ? "sm" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="mhd">
          <span className="m-title">{title}</span>
          <button className="m-cls" onClick={onClose}>
            <XIcon />
          </button>
        </div>
        <div className="mb">{children}</div>
        {footer && <div className="mf">{footer}</div>}
      </div>
    </div>
  );
}
