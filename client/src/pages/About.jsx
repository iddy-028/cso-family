import { translateNode, translateText, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Eye, Target } from "lucide-react";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import { useSiteContent } from "../context/SiteContentContext.jsx";

export default function About() {
  const translationLanguage = useTranslationLanguage().language;
  const t = (value) => translateText(value, translationLanguage);
  const getContent = useSiteContent();
  const cms = (key, fallback) => getContent(key, t(fallback));
  const missionItems = cms("about.family.mission.items", "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  const strategies = cms("about.family.strategies.items", "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  const principles = cms("about.family.principles.items", "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  const memberRules = cms("about.family.rules.items", "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    translateNode(<>
      <PageHero
        eyebrow={cms("about.hero.eyebrow", "About CSO")}
        title={cms("about.hero.title", "Called to Serve Others")}
        description={cms("about.family.subtitle", "CSO Family (Called to Serve Others) is a family of students united by a mission to serve God by helping people.")}
        image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80"
        breadcrumb={t("About Us")}
      />

      <section className="section bg-[radial-gradient(circle_at_top,_rgba(220,252,231,0.7),_rgba(255,255,255,0.96)_35%,_rgba(248,250,252,1)_100%)]">
        <div className="container-cso grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow={cms("about.identity.eyebrow", "Our identity")}
              title={cms("about.family.heading", "A family of students called to serve others.")}
              description={cms("about.family.introduction", "CSO Family was founded by 15 students to serve God by helping people in need, sharing the Word of God, and doing other work to transform lives.")}
            />
            <p className="mt-5 body-muted">
              {cms("about.family.summary", "Since its beginning, the family has continued to serve and grow with faith, unity, and God's help.")}
            </p>
            <div className="mt-7 rounded-[26px] border border-primary/10 bg-secondary/50 p-5 shadow-soft">
              <p className="text-sm font-semibold text-primary-900">{cms("about.family.history.heading", "Our history")}</p>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {cms("about.family.history.story", "CSO Family (Called to Serve Others) was founded on 29 June 2024 by 15 students.")}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80"
              alt={t("Volunteers serving the community")}
              className="col-span-2 aspect-[16/10] w-full rounded-3xl object-cover shadow-card"
              loading="lazy"
            />
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80"
              alt={t("Children in the community")}
              className="aspect-square w-full rounded-3xl object-cover shadow-card"
              loading="lazy"
            />
            <img
              src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=600&q=80"
              alt={t("Prayer and worship")}
              className="aspect-square w-full rounded-3xl object-cover shadow-card"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="section bg-slate-50/80">
        <div className="container-cso">
          <SectionHeading
            eyebrow={cms("about.family.mission.section.eyebrow", "Mission & vision")}
            title={cms("about.family.mission.section.heading", "Serving God by helping people.")}
            description={cms("about.family.mission.section.description", "CSO Family helps people in need, supports students, visits patients, shares the Word of God, and encourages people who need support.")}
            align="center"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="card border-primary/10 bg-gradient-to-br from-white to-emerald-50/70 p-8 shadow-soft">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-accent shadow-sm">
                <Target className="h-7 w-7" />
              </span>
              <h3 className="mt-5 font-heading text-2xl text-primary-950">{cms("about.family.mission.heading", "Mission of the CSO Family")}</h3>
              <p className="mt-3 leading-relaxed text-slate-600">{cms("about.family.mission.introduction", "We serve God through practical care and support for people in need.")}</p>
              <ul className="mt-5 space-y-3">
                {missionItems.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
            <article className="card border-primary/10 bg-gradient-to-br from-white to-amber-50/60 p-8 shadow-soft">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-primary-950 shadow-sm">
                <Eye className="h-7 w-7" />
              </span>
              <h3 className="mt-5 font-heading text-2xl text-primary-950">{cms("about.family.vision.heading", "Vision of the CSO Family")}</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                {cms("about.family.vision.statement", "Serving God by helping people.")}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-cso grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow={cms("about.family.strategies.label", "Our strategies")}
              title={cms("about.family.strategies.heading", "How the family supports its mission.")}
            />
            <ul className="mt-7 space-y-4">
              {strategies.map((strategy) => (
                <li key={strategy} className="flex gap-3 text-sm leading-relaxed text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                  {strategy}
                </li>
              ))}
            </ul>
            <Link to="/get-involved" className="btn-primary mt-8">
              {t("Join the mission")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <SectionHeading
              eyebrow={cms("about.family.principles.label", "Our principles")}
              title={cms("about.family.principles.heading", "The principles that guide our family.")}
            />
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {principles.map((principle, index) => (
                <div key={principle} className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-secondary/50 p-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary text-xs font-semibold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm font-medium text-primary-950">{principle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-slate-50/80">
        <div className="container-cso">
          <SectionHeading
            eyebrow={t("Our community")}
            title={cms("about.family.rules.heading", "CSO Family member rules")}
            align="center"
          />
          <ul className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
            {memberRules.map((rule, index) => (
              <li key={`${index}-${rule}`} className="flex gap-3 rounded-2xl border border-primary/10 bg-white p-5 text-sm leading-relaxed text-slate-600 shadow-soft">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>, translationLanguage)
  );
}
