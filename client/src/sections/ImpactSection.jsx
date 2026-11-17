import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { BookOpen, HeartPulse, MessageCircle, School, ShieldCheck, Users } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { useSiteContent } from "../context/SiteContentContext.jsx";

const missionIcons = [HeartPulse, School, School, Users, BookOpen, MessageCircle];

export default function ImpactSection() {
  const translationLanguage = useTranslationLanguage().language;
  const getContent = useSiteContent();
  const missionItems = getContent("about.family.mission.items", "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  return (
    translateNode(<section className="section relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.15),_transparent_30%),linear-gradient(135deg,#0f172a_0%,#111827_45%,#0f766e_100%)] text-white">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="container-cso relative">
        <SectionHeading
          eyebrow={getContent("home.cso.mission.title", "Our mission")}
          title={getContent("home.cso.vision.text", "Serving God by helping people.")}
          description={getContent("about.family.mission.introduction", "These are the mission activities shared by CSO Family.")}
          align="center"
          className="[&_h2]:text-white [&_p]:text-white/65"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {missionItems.map((item, index) => {
            const Icon = missionIcons[index] || ShieldCheck;
            return (
              <div
                key={item}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.6)] transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-white/[0.08]"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/15 text-accent">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-heading text-xl text-white">{item}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>, translationLanguage)
  );
}
