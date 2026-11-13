import { useState } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import { ErrorAlert, SuccessAlert } from "../components/Alerts";
import { TextArea, TextField } from "../components/FormFields";
import { getErrorMessage, publicApi } from "../services/api";

const initialForm = {
  full_name: "",
  email: "",
  subject: "",
  message: "",
};

const contactDetails = [
  {
    icon: MapPin,
    title: "Our location",
    lines: ["Kigali, Rwanda", "Exact address pending verification"],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: ["+250 XXX XXX XXX", "Official number pending confirmation"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["info@example.com", "Official address pending confirmation"],
  },
  {
    icon: Clock,
    title: "Office hours",
    lines: ["Monday - Friday", "Details to be confirmed"],
  },
];

export default function Contact() {
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
      const result = await publicApi.message(form);
      setSuccess(result.message || "Thank you for reaching out. Your message has been received.");
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
        eyebrow="Contact us"
        title="We would love to hear from you"
        description="Send a message, ask a question, share a prayer request, or find out how to get involved with CSO."
        image="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1600&q=80"
        breadcrumb="Contact"
      />

      <section className="section bg-white">
        <div className="container-cso grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="card p-6 sm:p-8">
            <SectionHeading
              eyebrow="Send a message"
              title="How can we help?"
              description="Fields marked * are required. The CSO team will respond as soon as possible."
            />
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Full name"
                  name="full_name"
                  value={form.full_name}
                  onChange={(event) => updateField("full_name", event.target.value)}
                  placeholder="Your full name"
                  required
                />
                <TextField
                  label="Email address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <TextField
                label="Subject"
                name="subject"
                value={form.subject}
                onChange={(event) => updateField("subject", event.target.value)}
                placeholder="What is your message about?"
                required
              />
              <TextArea
                label="Message"
                name="message"
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                placeholder="Write your message here..."
                rows={6}
                required
              />

              <ErrorAlert message={error} />
              <SuccessAlert message={success} />

              <button type="submit" className="btn-primary w-full" disabled={submitting}>
                {submitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Send message
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {contactDetails.map(({ icon: Icon, title, lines }) => (
                <div key={title} className="card p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary text-primary-800">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-heading text-lg text-primary-950">{title}</h3>
                  {lines.map((line) => (
                    <p key={line} className="mt-1 text-sm text-slate-600">
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>
            <div className="rounded-3xl bg-primary-950 p-6 text-white">
              <h3 className="font-heading text-xl text-white">Prayer requests</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                You are welcome to share a prayer request through this form. Select a subject that reflects your
                request and the team will pray with you.
              </p>
            </div>
            <div className="rounded-3xl bg-accent/10 p-6">
              <h3 className="font-heading text-xl text-primary-950">Please note</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Official contact details, leadership information, and the organization address are placeholders until
                verified by CSO.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
