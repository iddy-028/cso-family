 import { translateNode, translateText, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
 import { Link } from "react-router-dom";
import { useState } from "react";
 import { Send } from "lucide-react";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import { ErrorAlert, SuccessAlert } from "../components/Alerts";
import { TextArea, TextField } from "../components/FormFields";
import { getErrorMessage, publicApi } from "../services/api";
import { useSiteContent } from "../context/SiteContentContext.jsx";

const initialForm = {
  full_name: "",
  email: "",
  subject: "",
  message: "",
};

export default function Contact() {
  const translationLanguage = useTranslationLanguage().language;
  const getContent = useSiteContent();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const t = (value) => translateText(value, translationLanguage);

  const missionItems = getContent("about.family.mission.items", "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const result = await publicApi.message(form);
      setSuccess(result.message || t("Thank you for reaching out. Your message has been received."));
      setForm(initialForm);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    translateNode(<>
      <PageHero
        eyebrow={getContent("contact.cso.hero.eyebrow", t("Contact CSO Family"))}
        title={getContent("contact.cso.hero.title", t("Send a message to CSO Family"))}
        description={getContent("contact.cso.hero.description", t("Use the contact form to ask about CSO Family and its mission of serving God by helping people."))}
        image="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1600&q=80"
        breadcrumb={t("Contact")}
      />

      <section className="section bg-[radial-gradient(circle_at_top,_rgba(220,252,231,0.7),_rgba(255,255,255,0.96)_35%,_rgba(248,250,252,1)_100%)]">
        <div className="container-cso grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="card border-primary/10 bg-gradient-to-br from-white via-emerald-50/70 to-white p-6 shadow-soft sm:p-8">
            <SectionHeading
              eyebrow={t("Send a message")}
              title={t("How can we help?")}
              description={t("Fields marked * are required. The CSO team will respond as soon as possible.")}
            />
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label={t("Full name")}
                  name="full_name"
                  value={form.full_name}
                  onChange={(event) => updateField("full_name", event.target.value)}
                  placeholder={t("Your full name")}
                  required
                />
                <TextField
                  label={t("Email address")}
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <TextField
                label={t("Subject")}
                name="subject"
                value={form.subject}
                onChange={(event) => updateField("subject", event.target.value)}
                placeholder={t("What is your message about?")}
                required
              />
              <TextArea
                label={t("Message")}
                name="message"
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                placeholder={t("Write your message here...")}
                rows={6}
                required
              />

              <ErrorAlert message={error} />
              <SuccessAlert message={success} />

              <button type="submit" className="btn-primary mt-2 w-full" disabled={submitting}>
                {submitting ? (
                  t("Sending...")
                ) : (
                  <>
                    <Send className="h-4 w-4" /> {t("Send message")}
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="space-y-5">
            <div className="rounded-[28px] bg-primary-950 p-6 text-white shadow-soft ring-1 ring-white/10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">CSO Family</p>
              <h3 className="mt-3 font-heading text-2xl text-white">
                {getContent("about.family.vision.statement", "Serving God by helping people.")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                {getContent("about.family.introduction", "CSO Family was founded by 15 students to serve God by helping people in need and sharing the Word of God.")}
              </p>
              <Link to="/about" className="btn-accent btn-sm mt-5">
                {t("Learn about CSO")}
              </Link>
            </div>

            <div className="card p-6">
              <h3 className="font-heading text-xl text-primary-950">{t("Our mission")}</h3>
              <ul className="mt-4 space-y-3">
                {missionItems.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-slate-600">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>, translationLanguage)
  );
}
