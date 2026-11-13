import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, MapPin, Users } from "lucide-react";
import PageHero from "../components/PageHero";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { ErrorAlert, SuccessAlert } from "../components/Alerts";
import { TextField } from "../components/FormFields";
import { fallbackEvents } from "../data/fallbackData";
import { getErrorMessage, publicApi, resolveImage } from "../services/api";
import useApiData from "../hooks/useApiData";
import { formatDateTime } from "../utils/format";

const initialForm = { full_name: "", email: "", phone: "" };

export default function EventDetails() {
  const { id } = useParams();
  const fallback = fallbackEvents.find((event) => String(event.id) === String(id)) || null;
  const { data: event, loading } = useApiData(() => publicApi.event(id), fallback, [id]);

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSuccess("");
    setError("");
    try {
      const result = await publicApi.registerForEvent(id, form);
      setSuccess(result.message || "You are registered for this event.");
      setForm(initialForm);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loader full label="Loading event…" />;

  if (!event) {
    return (
      <div className="container-cso py-20">
        <EmptyState
          icon={CalendarDays}
          title="Event not found"
          description="This event may have been removed or the link may be incorrect."
          action={
            <Link to="/events" className="btn-primary">
              Back to events
            </Link>
          }
        />
      </div>
    );
  }

  const isOpen = event.status === "upcoming";

  return (
    <>
      <PageHero
        eyebrow={isOpen ? "Upcoming event" : "Past event"}
        title={event.title}
        description={`${formatDateTime(event.event_date)}${event.location ? ` · ${event.location}` : ""}`}
        image={resolveImage(event.image)}
        breadcrumb="Event Details"
      />

      <section className="section bg-white">
        <div className="container-cso grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <article>
            <Link to="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-800">
              <ArrowLeft className="h-4 w-4" /> All events
            </Link>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className={isOpen ? "badge-green" : "badge-gray"}>{event.status}</span>
              <span className="badge-gray inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> {event.registered_count ?? 0} registered
              </span>
            </div>
            <h2 className="mt-6 font-heading text-3xl text-primary-950">About this event</h2>
            <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-slate-600">{event.description}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <CalendarDays className="h-5 w-5 text-primary-700" />
                <p className="mt-3 text-xs uppercase tracking-wider text-slate-400">Date & time</p>
                <p className="mt-1 text-sm font-medium text-primary-950">{formatDateTime(event.event_date)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5">
                <MapPin className="h-5 w-5 text-primary-700" />
                <p className="mt-3 text-xs uppercase tracking-wider text-slate-400">Location</p>
                <p className="mt-1 text-sm font-medium text-primary-950">{event.location || "To be confirmed"}</p>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-secondary bg-secondary/40 p-5 text-sm text-slate-600">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
              <p>
                Please arrive a few minutes early. Event details may be updated by the CSO team. Contact us if you have
                questions about accessibility or what to bring.
              </p>
            </div>
          </article>

          <aside>
            <div className="card p-6 sm:p-7">
              <h3 className="font-heading text-2xl text-primary-950">Register for this event</h3>
              {isOpen ? (
                <>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Reserve your place and the CSO team will be in touch. Registration is free.
                  </p>
                  <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <TextField
                      label="Full name"
                      name="full_name"
                      value={form.full_name}
                      onChange={(e) => updateField("full_name", e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                    <TextField
                      label="Email address"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                    <TextField
                      label="Phone number"
                      name="phone"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+250 …"
                      required
                    />
                    <ErrorAlert message={error} />
                    <SuccessAlert message={success} />
                    <button type="submit" className="btn-primary w-full" disabled={submitting}>
                      {submitting ? "Registering…" : "Register"}
                    </button>
                    <p className="text-center text-xs text-slate-400">
                      By registering you agree to be contacted about this event.
                    </p>
                  </form>
                </>
              ) : (
                <div className="mt-4 rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
                  Registration is closed because this event is {event.status}. Follow our events page for upcoming
                  gatherings, or{" "}
                  <Link to="/get-involved" className="font-semibold text-primary-800 underline-offset-2 hover:underline">
                    join as a volunteer
                  </Link>
                  .
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
