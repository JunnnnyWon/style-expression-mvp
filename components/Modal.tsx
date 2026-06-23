"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, handleEscape]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-[720px] bg-surface-elevated rounded-xl p-6 space-y-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between">
          {title && (
            <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          )}
          <button
            onClick={onClose}
            className="ml-auto p-1 rounded-full bg-white/10 text-text-muted hover:text-text-primary transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
