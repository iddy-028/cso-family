import { translateNode, translateText, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { Link } from "react-router-dom";
import { ArrowRight, HeartHandshake, Sparkles } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext.jsx";

export default function Hero() {
  const translationLanguage = useTranslationLanguage().language;
  const getContent = useSiteContent();
  const missionActivities = getContent("about.family.mission.items", "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  return (
    translateNode(<section className="relative isolate overflow-hidden bg-hero-pattern">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.25),transparent_30%)]" />
      <div className="container-cso relative grid min-h-[620px] items-center gap-10 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> {getContent("home.cso.hero.eyebrow", "CSO Family · Called to Serve Others")}
          </span>
          <h1 className="mt-6 font-heading text-4xl leading-[1.08] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            {getContent("home.cso.hero.title", "Serving God by helping people.")}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
            {getContent("home.cso.hero.description", "Founded on 29 June 2024 by 15 students, CSO Family serves God by helping people in need, sharing the Word of God, and working to transform lives.")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/about" className="btn-accent shadow-[0_18px_40px_-18px_rgba(245,158,11,0.85)]">
              {translateText("Learn More", translationLanguage)} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/get-involved" className="btn border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/15">
              <HeartHandshake className="h-4 w-4" /> {translateText("Join Us", translationLanguage)}
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-2">
            {[
              translateText("Love", translationLanguage),
              translateText("Respect for God and people", translationLanguage),
              translateText("Humility", translationLanguage),
              translateText("Prayer", translationLanguage),
              translateText("Helping others", translationLanguage),
            ].map((value) => (
              <span
                key={value}
                className="rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-100 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.9)]"
              >
                {value}
              </span>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="animate-float rounded-[2rem] border border-white/20 bg-slate-900/30 p-2 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.8)] backdrop-blur-md">
            <div className="rounded-[1.6rem] bg-white p-7 shadow-[0_25px_60px_-25px_rgba(15,23,42,0.5)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-700">{getContent("home.cso.calling.label", "Our vision")}</p>
              <h2 className="mt-3 font-heading text-3xl leading-tight text-primary-950">
                {getContent("home.cso.calling.title", "Serving God by helping people.")}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {getContent("home.cso.calling.description", "Our mission includes hospital visits, school-fee and school-supply assistance, helping people in need, sharing God's Word, and encouraging those who need support.")}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {missionActivities.slice(0, 4).map((activity) => (
                  <div key={activity} className="rounded-2xl bg-sky-50 px-4 py-3 ring-1 ring-sky-100">
                    <p className="font-heading text-sm text-primary-950">{activity}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/activities"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-800 transition hover:gap-3"
              >
                {translateText("Explore our activities", translationLanguage)} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-8 rounded-2xl bg-accent px-5 py-4 text-primary-950 shadow-[0_18px_40px_-18px_rgba(245,158,11,0.9)]">
            <p className="font-heading text-lg leading-tight">CSO Family</p>
            <p className="text-xs font-medium">Called to Serve Others</p>
          </div>
        </div>
      </div>
    </section>, translationLanguage)
  );
}
