import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
export function Spinner({ className = "h-5 w-5" }) {
  const translationLanguage = useTranslationLanguage().language;
  return (
    translateNode(<span
      className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${className}`}
      aria-hidden="true"
    />, translationLanguage)
  );
}

export default function Loader({ label = "Loading…", full = false }) {
  const translationLanguage = useTranslationLanguage().language;
  return (
    translateNode(<div
      className={`flex flex-col items-center justify-center gap-3 text-primary-800 ${
        full ? "min-h-[60vh]" : "py-16"
      }`}
      role="status"
    >
      <Spinner className="h-8 w-8" />
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>, translationLanguage)
  );
}
