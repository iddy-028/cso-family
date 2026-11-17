import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function ErrorAlert({ message, className = "" }) {
  const translationLanguage = useTranslationLanguage().language;
  if (!message) return null;
  return (
    translateNode(<div className={`flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 ${className}`}>
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>, translationLanguage)
  );
}

export function SuccessAlert({ message, className = "" }) {
  const translationLanguage = useTranslationLanguage().language;
  if (!message) return null;
  return (
    translateNode(<div
      className={`flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ${className}`}
    >
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>, translationLanguage)
  );
}
