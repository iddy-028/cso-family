import { translateNode, translateText, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { useState } from "react";
import { HandHeart, Heart, Megaphone, Send } from "lucide-react";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import { ErrorAlert, SuccessAlert } from "../components/Alerts";
import { SelectField, TextArea, TextField } from "../components/FormFields";
import { getErrorMessage, publicApi } from "../services/api";
import { useSiteContent } from "../context/SiteContentContext.jsx";

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  gender: "",
  location: "",
  skills: "",
  motivation: "",
};

const supportWays = [
  {
    icon: HandHeart,
    title: "Contributions from family members",
    text: "Every family member is invited to contribute to the CSO Family mission.",
  },
  {
    icon: Heart,
    title: "Contributions from volunteers",
    text: "Volunteers contribute to the family's work of serving God by helping people.",
  },
  {
    icon: Megaphone,
    title: "Contributions from supporters",
    text: "Supporters help the family continue its mission and activities.",
  },
];

export default function GetInvolved() {
  const translationLanguage = useTranslationLanguage().language;
  const getContent = useSiteContent();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const t = (value) => translateText(value, translationLanguage);

  const translatedSupportWays = supportWays.map((support) => ({
    ...support,
    title: t(support.title),
    text: t(support.text),
  }));

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const result = await publicApi.volunteer(form);
      setSuccess(result.message || t("Thank you for volunteering!"));
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
          eyebrow={getContent("involved.cso.hero.eyebrow", t("Take part in the mission"))}
          title={getContent("involved.cso.hero.title", t("Help CSO Family serve people"))}
          description={getContent("involved.cso.hero.description", t("CSO Family's strategies include contributions from family members, volunteers, and supporters."))}
        image="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1600&q=80"
        breadcrumb={t("Get Involved")}
      />

      <section className="section bg-[radial-gradient(circle_at_top,_rgba(220,252,231,0.7),_rgba(255,255,255,0.96)_35%,_rgba(248,250,252,1)_100%)]">
        <div className="container-cso">
          <SectionHeading
            eyebrow={t("Ways to support")}
            title={t("Contribute to the CSO mission.")}
            description={t("CSO Family's strategies include contributions from family members, volunteers, and supporters.")}
            align="center"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {translatedSupportWays.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card card-hover border-primary/10 bg-gradient-to-br from-white to-emerald-50/70 p-6 shadow-soft">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary-800 shadow-sm">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-heading text-xl text-primary-950">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-slate-50/80">
        <div className="container-cso grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow={t("Volunteer registration")}
              title={t("Join the CSO volunteer community.")}
              description={t("Tell us a little about yourself and how you would like to serve. The team will review your application and contact you.")}
            />
            <div className="card mt-7 border-primary/10 bg-white/80 p-6 shadow-soft">
              <h3 className="font-heading text-lg text-primary-950">{t("What happens next?")}</h3>
              <ol className="mt-4 space-y-3 text-sm text-slate-600">
                {[
                  t("Your application is received and reviewed by the CSO team."),
                  t("We contact you using the phone number or email you provide."),
                  t("You are invited to an orientation or an upcoming activity."),
                ].map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-white">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-4 rounded-[24px] border border-primary/10 bg-accent/10 p-5 text-sm leading-relaxed text-slate-600 shadow-soft">
              <strong className="text-primary-900">{t("Prayer support")}:</strong> {t("If you prefer to support through prayer, you are warmly welcome. You can also use the contact page to share a prayer request.")}
            </div>
          </div>

          <div className="card border-primary/10 bg-gradient-to-br from-white to-emerald-50/70 p-6 shadow-soft sm:p-8">
            <h2 className="font-heading text-2xl text-primary-950">{t("Volunteer application")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("Fields marked * are required.")}</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <TextField
                label={t("Full name")}
                name="full_name"
                value={form.full_name}
                onChange={(event) => updateField("full_name", event.target.value)}
                placeholder={t("Your full name")}
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label={t("Email address")}
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="you@example.com"
                  required
                />
                <TextField
                  label={t("Phone number")}
                  name="phone"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="+250 …"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label={t("Gender (optional)")}
                  name="gender"
                  value={form.gender}
                  onChange={(event) => updateField("gender", event.target.value)}
                >
                  <option value="">{t("Prefer not to say")}</option>
                  <option value="Female">{t("Female")}</option>
                  <option value="Male">{t("Male")}</option>
                  <option value="Other">{t("Other")}</option>
                </SelectField>
                <TextField
                  label={t("Location")}
                  name="location"
                  value={form.location}
                  onChange={(event) => updateField("location", event.target.value)}
                  placeholder={t("City / district")}
                  required
                />
              </div>
              <TextField
                label={t("Skills or interests")}
                name="skills"
                value={form.skills}
                onChange={(event) => updateField("skills", event.target.value)}
                placeholder={t("e.g. teaching, prayer, photography, logistics")}
                required
              />
              <TextArea
                label={t("Why do you want to volunteer?")}
                name="motivation"
                value={form.motivation}
                onChange={(event) => updateField("motivation", event.target.value)}
                placeholder={t("Share a short message about your motivation…")}
                rows={5}
                required
              />

              <ErrorAlert message={error} />
              <SuccessAlert message={success} />

              <button type="submit" className="btn-primary mt-2 w-full" disabled={submitting}>
                {submitting ? (
                  t("Submitting application…")
                ) : (
                  <>
                    <Send className="h-4 w-4" /> {t("Submit application")}
                  </>
                )}
              </button>
              <p className="text-center text-xs leading-relaxed text-slate-400">
                {t("Your information is used only to process your volunteer application and communicate about CSO activities.")}
              </p>
            </form>
          </div>
        </div>
      </section>
    </>, translationLanguage)
  );
}
