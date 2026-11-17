import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { Languages } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const languageNames = {
  en: "English",
  rw: "Kinyarwanda",
  fr: "Français",
};

export default function LanguageSwitcher({ className = "" }) {
  const translationLanguage = useTranslationLanguage().language;
  const { language, setLanguage } = useLanguage();

  return (
    translateNode(<label className={`inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 ${className}`}>
      <Languages className="h-4 w-4 shrink-0 text-primary-700" aria-hidden="true" />
      <span className="sr-only">Language</span>
      <select
        aria-label="Select language"
        className="min-w-0 cursor-pointer bg-transparent font-medium outline-none"
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
      >
        {Object.entries(languageNames).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </label>, translationLanguage)
  );
}
