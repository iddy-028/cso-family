import { translateNode, translateText, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { Link } from "react-router-dom";
import { ArrowRight, HandHeart, HeartHandshake, Sparkles, Users } from "lucide-react";

export default function VolunteerCTA() {
  const translationLanguage = useTranslationLanguage().language;
  const translatedSupportItems = [
    { icon: Users, title: "Family members", text: "Each family member contributes to the CSO mission." },
    { icon: HeartHandshake, title: "Volunteers", text: "Volunteers contribute to the family's work." },
    { icon: HandHeart, title: "Supporters", text: "Supporters help the family carry out its mission." },
  ].map((item) => ({
    ...item,
    title: translateText(item.title, translationLanguage),
    text: translateText(item.text, translationLanguage),
  }));
  return (
    translateNode(<section className="section bg-white">
      <div className="container-cso">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[linear-gradient(135deg,#e0f2fe_0%,#fef3c7_100%)] px-6 py-14 shadow-[0_28px_60px_-30px_rgba(15,23,42,0.45)] sm:px-12 lg:px-16">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/25 blur-2xl" />
          <div className="absolute -bottom-20 left-10 h-52 w-52 rounded-full bg-sky-300/20 blur-2xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="eyebrow">
                <Sparkles className="h-3.5 w-3.5" /> {translateText("Contribute to the mission", translationLanguage)}
              </p>
              <h2 className="mt-3 font-heading text-3xl leading-tight text-primary-950 sm:text-4xl lg:text-5xl">
                CSO Family serves God by helping people.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-700 sm:text-base">
                Family members, volunteers, and supporters contribute to the mission of CSO Family.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/get-involved" className="btn-primary shadow-[0_18px_35px_-18px_rgba(15,23,42,0.7)]">
                  {translateText("Join CSO Family", translationLanguage)} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/contact" className="btn-outline border-primary/20 bg-white/85 text-primary-900 hover:bg-white">
                  {translateText("Contact us", translationLanguage)}
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              {translatedSupportItems.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4 rounded-2xl bg-white/90 px-5 py-4 shadow-[0_15px_30px_-20px_rgba(15,23,42,0.5)] ring-1 ring-primary/5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-accent shadow-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-heading text-lg text-primary-950">{title}</p>
                    <p className="text-xs leading-relaxed text-slate-600">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>, translationLanguage)
  );
}
