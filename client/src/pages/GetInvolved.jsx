import { useState } from "react";
import { HandHeart, Heart, Megaphone, Send, Sparkles } from "lucide-react";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import { ErrorAlert, SuccessAlert } from "../components/Alerts";
import { SelectField, TextArea, TextField } from "../components/FormFields";
import { getErrorMessage, publicApi } from "../services/api";

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
    title: "Become a volunteer",
    text: "Give your time and skills to community activities, visits, events, and outreach.",
  },
  {
    icon: Heart,
    title: "Pray with us",
    text: "Support the work through prayer for the team, the people served, and the community.",
  },
  {
    icon: Megaphone,
    title: "Share the mission",
    text: "Tell your friends, church, and community about CSO and invite them to join.",
  },
  {
    icon: Sparkles,
    title: "Support activities",
    text: "Donation and partnership details will be published only after official confirmation by CSO.",
  },
];

export default function GetInvolved() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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
      setSuccess(result.message || "Thank you for volunteering!");
      setForm(initialForm);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Get involved"
        title="Serve with us"
        description="There is a place for everyone in the work of serving God by helping people. Volunteer, pray, share, or support an activity."
        image="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1600&q=80"
        breadcrumb="Get Involved"
      />

      <section className="section bg-white">
        <div className="container-cso">
          <SectionHeading
            eyebrow="Ways to support"
            title="Every act of love matters."
            description="You do not need special experience to begin. A willing heart and a little time can make a real difference."
            align="center"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {supportWays.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card card-hover p-6">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary-800">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-heading text-xl text-primary-950">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-cso grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Volunteer registration"
              title="Join the CSO volunteer community."
              description="Tell us a little about yourself and how you would like to serve. The team will review your application and contact you."
            />
            <div className="card mt-7 p-6">
              <h3 className="font-heading text-lg text-primary-950">What happens next?</h3>
              <ol className="mt-4 space-y-3 text-sm text-slate-600">
                {[
                  "Your application is received and reviewed by the CSO team.",
                  "We contact you using the phone number or email you provide.",
                  "You are invited to an orientation or an upcoming activity.",
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
            <div className="mt-4 rounded-2xl bg-accent/10 p-5 text-sm leading-relaxed text-slate-600">
              <strong className="text-primary-900">Prayer support:</strong> If you prefer to support through prayer,
              you are warmly welcome. You can also use the contact page to share a prayer request.
            </div>
          </div>

          <div className="card p-6 sm:p-8">
            <h2 className="font-heading text-2xl text-primary-950">Volunteer application</h2>
            <p className="mt-1 text-sm text-slate-500">Fields marked * are required.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <TextField
                label="Full name"
                name="full_name"
                value={form.full_name}
                onChange={(event) => updateField("full_name", event.target.value)}
                placeholder="Your full name"
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Email address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="you@example.com"
                  required
                />
                <TextField
                  label="Phone number"
                  name="phone"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="+250 …"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Gender (optional)"
                  name="gender"
                  value={form.gender}
                  onChange={(event) => updateField("gender", event.target.value)}
                >
                  <option value="">Prefer not to say</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </SelectField>
                <TextField
                  label="Location"
                  name="location"
                  value={form.location}
                  onChange={(event) => updateField("location", event.target.value)}
                  placeholder="City / district"
                  required
                />
              </div>
              <TextField
                label="Skills or interests"
                name="skills"
                value={form.skills}
                onChange={(event) => updateField("skills", event.target.value)}
                placeholder="e.g. teaching, prayer, photography, logistics"
                required
              />
              <TextArea
                label="Why do you want to volunteer?"
                name="motivation"
                value={form.motivation}
                onChange={(event) => updateField("motivation", event.target.value)}
                placeholder="Share a short message about your motivation…"
                rows={5}
                required
              />

              <ErrorAlert message={error} />
              <SuccessAlert message={success} />

              <button type="submit" className="btn-primary w-full" disabled={submitting}>
                {submitting ? (
                  "Submitting application…"
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Submit application
                  </>
                )}
              </button>
              <p className="text-center text-xs leading-relaxed text-slate-400">
                Your information is used only to process your volunteer application and communicate about CSO
                activities.
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
