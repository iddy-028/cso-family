import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { useEffect } from "react";
import { X } from "lucide-react";

const sizes = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
};

export default function Modal({ open, onClose, title, description, children, footer, size = "md" }) {
  const translationLanguage = useTranslationLanguage().language;
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    translateNode(<div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto p-4 sm:p-6" role="dialog" aria-modal="true">
      <button
        type="button"
        onClick={onClose}
        className="fixed inset-0 cursor-default bg-slate-950/60 backdrop-blur-sm"
        aria-label="Close dialog"
      />
      <div className={`relative my-6 w-full ${sizes[size]} animate-fade-up rounded-3xl bg-white shadow-2xl`}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="font-heading text-2xl text-primary-950">{title}</h2>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 px-6 py-4">{footer}</div>}
      </div>
    </div>, translationLanguage)
  );
}
