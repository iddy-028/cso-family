import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function PageHero({ eyebrow, title, description, image, breadcrumb }) {
  const translationLanguage = useTranslationLanguage().language;
  return (
    translateNode(<section className="relative isolate overflow-hidden bg-primary-950">
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-950 via-primary-950/85 to-primary-900/50" />
      <div className="container-cso py-20 sm:py-24 lg:py-28">
        <div className="max-w-3xl animate-fade-up">
          {breadcrumb && (
            <div className="mb-5 flex flex-wrap items-center gap-1.5 text-xs font-medium text-white/60">
              <Link to="/" className="transition hover:text-accent">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-white/90">{breadcrumb}</span>
            </div>
          )}
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">{eyebrow}</p>}
          <h1 className="mt-3 font-heading text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">{title}</h1>
          {description && <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{description}</p>}
        </div>
      </div>
    </section>, translationLanguage)
  );
}
