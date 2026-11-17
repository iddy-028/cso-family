import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Eye, Target } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { useSiteContent } from "../context/SiteContentContext.jsx";

export default function MissionVision() {
  const translationLanguage = useTranslationLanguage().language;
  const getContent = useSiteContent();
  const strategies = getContent("home.cso.strategies.items", "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  return (
    translateNode(<section className="section bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
      <div className="container-cso grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow={getContent("home.cso.identity.eyebrow", "Who we are")}
            title={getContent("home.cso.identity.title", "A student-founded family called to serve.")}
            description={getContent("home.cso.identity.description", "CSO Family began with 15 students on 29 June 2024. Its purpose is to serve God by helping people and sharing the Word of God.")}
          />
          <Link to="/about" className="btn-outline mt-7 shadow-[0_16px_35px_-24px_rgba(15,23,42,0.45)]">
            Discover our story <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <article className="card card-hover bg-sky-50/80 p-7 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.35)]">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-accent">
              <Target className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-heading text-2xl text-primary-950">{getContent("home.cso.mission.title", "Our mission")}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {getContent("home.cso.mission.text", "To serve God by helping people in need, supporting students, visiting patients, sharing the Word of God, and encouraging people who need support.")}
            </p>
          </article>
          <article className="card card-hover bg-amber-50/80 p-7 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.35)]">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-primary-950">
              <Eye className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-heading text-2xl text-primary-950">{getContent("home.cso.vision.title", "Our vision")}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {getContent("home.cso.vision.text", "Serving God by helping people.")}
            </p>
          </article>
          <div className="card bg-primary-950 p-7 text-white shadow-[0_25px_60px_-25px_rgba(15,23,42,0.5)] sm:col-span-2">
            <h3 className="font-heading text-2xl text-white">{getContent("home.cso.strategies.title", "Our strategies")}</h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              {strategies.map((strategy) => (
                <li key={strategy} className="flex items-start gap-3 text-sm leading-relaxed text-white/80">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  {strategy}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>, translationLanguage)
  );
}
