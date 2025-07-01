import { useEffect } from "react";
import type { ReactNode } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  position?: "left" | "right";
}

export const Sidebar = ({
  isOpen,
  onClose,
  title,
  children,
  position = "right",
}: SidebarProps) => {
  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevenir scroll del body cuando el sidebar está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const slideDirection = position === "right"
    ? "translate-x-full"
    : "-translate-x-full";

  const slideInDirection = position === "right"
    ? "translate-x-0"
    : "translate-x-0";

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 ${
          position === "right" ? "right-0" : "left-0"
        } z-50 h-full w-full max-w-md transform bg-slate-900 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? slideInDirection : slideDirection
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
            </div>
            <h2 className="text-lg font-semibold text-white">
              {title || "Panel"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="group rounded-full p-2 text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-white"
          >
            <svg
              className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer opcional con gradiente para indicar scroll */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-900 to-transparent">
        </div>
      </div>
    </>
  );
};
