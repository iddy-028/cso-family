import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLanguage } from "./LanguageContext.jsx";
import { SITE_CONTENT_FIELDS } from "../data/siteContent.js";
import { publicApi } from "../services/api";

const SiteContentContext = createContext(null);

export function SiteContentProvider({ children }) {
  const { language } = useLanguage();
  const [values, setValues] = useState({});

  useEffect(() => {
    let active = true;
    publicApi.content()
      .then((rows) => {
        if (!active) return;
        const nextValues = {};
        rows.forEach(({ content_key: key, language: locale, content }) => {
          nextValues[key] = { ...nextValues[key], [locale]: content };
        });
        setValues(nextValues);
      })
      .catch((error) => {
        console.error("Failed to load editable website content.", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const getContent = useMemo(() => (key, fallback = "") => {
    const stored = values[key]?.[language];
    if (stored !== undefined) return stored;
    const defaults = SITE_CONTENT_FIELDS.find((field) => field.key === key);
    if (defaults && (language === "en" || language === "rw")) return defaults[language];
    return fallback;
  }, [language, values]);

  return (
    <SiteContentContext.Provider value={getContent}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) throw new Error("useSiteContent must be used within a SiteContentProvider.");
  return context;
}
