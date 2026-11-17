import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
export default function SectionHeading({ eyebrow, title, description, align = "left", className = "" }) {
  const translationLanguage = useTranslationLanguage().language;
  const alignment = align === "center" ? "mx-auto text-center" : "";
  return (
    translateNode(<div className={`max-w-2xl ${alignment} ${className}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 font-heading text-3xl leading-tight text-primary-950 sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 body-muted">{description}</p>}
    </div>, translationLanguage)
  );
}
