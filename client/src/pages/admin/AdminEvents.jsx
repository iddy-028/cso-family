import { translateNode, useLanguage as useTranslationLanguage } from "../../context/LanguageContext.jsx";
import { useState } from "react";
import { CalendarDays, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { ErrorAlert, SuccessAlert } from "../../components/Alerts";
import EmptyState from "../../components/EmptyState";
import { SelectField, TextArea, TextField } from "../../components/FormFields";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import useApiData from "../../hooks/useApiData";
import { adminApi, getErrorMessage, resolveImage } from "../../services/api";
import { formatDateTime, toInputDateTime } from "../../utils/format";

const emptyForm = {
  title: "",
  description: "",
  event_date: "",
  location: "",
  status: "upcoming",
};

const eventStatuses = ["upcoming", "completed", "cancelled"];

export default function AdminEvents() {
  const translationLanguage = useTranslationLanguage().language;
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const { data, loading, error, refresh } = useApiData(
    () => adminApi.events({ search, status: filter }),
    [],
    [search, filter],
  );
  const events = data || [];
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const [registrationsFor, setRegistrationsFor] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFile(null);
    setFormError("");
    setOpen(true);
  }

  function openEdit(event) {
    setEditing(event);
    setForm({
      title: event.title || "",
      description: event.description || "",
      event_date: toInputDateTime(event.event_date),
      location: event.location || "",
      status: event.status || "upcoming",
    });
    setFile(null);
    setFormError("");
    setOpen(true);
  }

  async function handleSubmit(formEvent) {
    formEvent.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value ?? ""));
      if (file) payload.append("image", file);

      if (editing) {
        await adminApi.updateEvent(editing.id, payload);
        setNotice("Event updated successfully.");
      } else {
        await adminApi.createEvent(payload);
        setNotice("Event created successfully.");
      }
      setOpen(false);
      refresh();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvent(event) {
    if (!window.confirm(`Delete "${event.title}"? This will also remove its event registrations.`)) return;
    setActionError("");
    try {
      await adminApi.deleteEvent(event.id);
      setNotice("Event deleted successfully.");
      refresh();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  async function openRegistrations(event) {
    setRegistrationsFor(event);
    setRegistrations([]);
    setRegistrationError("");
    setLoadingRegistrations(true);
    try {
      const result = await adminApi.eventRegistrations(event.id);
      setRegistrations(result || []);
    } catch (err) {
      setRegistrationError(getErrorMessage(err));
    } finally {
      setLoadingRegistrations(false);
    }
  }

  async function updateRegistration(registration, status) {
    setRegistrationError("");
    try {
      await adminApi.updateRegistration(registration.id, { status });
      setRegistrations((current) =>
        current.map((item) => (item.id === registration.id ? { ...item, status } : item)),
      );
      refresh();
    } catch (err) {
      setRegistrationError(getErrorMessage(err));
    }
  }

  async function deleteRegistration(registration) {
    if (!window.confirm(`Remove ${registration.full_name} from this event?`)) return;
    setRegistrationError("");
    try {
      await adminApi.deleteRegistration(registration.id);
      setRegistrations((current) => current.filter((item) => item.id !== registration.id));
      refresh();
    } catch (err) {
      setRegistrationError(getErrorMessage(err));
    }
  }

  return (
    translateNode(<div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-primary-950">Events</h1>
          <p className="mt-1 text-sm text-slate-500">Create and manage events, and review their registrations.</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary btn-sm">
          <Plus className="h-4 w-4" /> New event
        </button>
      </div>

      <SuccessAlert message={notice} />
      <ErrorAlert message={error || actionError} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search events..."
            className="input pl-11"
            aria-label="Search events"
          />
        </div>
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="input sm:max-w-xs"
          aria-label="Filter events"
        >
          <option value="">All events</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past events</option>
          {eventStatuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader label="Loading events..." />
      ) : events.length === 0 ? (
        <EmptyState
          title={search || filter ? "No events found" : "No events yet"}
          description={search || filter ? "Try changing your search or filter." : "Create your first event to get started."}
          icon={CalendarDays}
          action={
            <button type="button" onClick={openCreate} className="btn-primary btn-sm">
              <Plus className="h-4 w-4" /> New event
            </button>
          }
        />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Location</th>
                <th>Status</th>
                <th>Registrations</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {event.image ? (
                        <img src={resolveImage(event.image)} alt="" className="h-11 w-11 rounded-xl object-cover" />
                      ) : (
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-400">
                          <CalendarDays className="h-5 w-5" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="max-w-xs truncate font-medium text-primary-950">{event.title}</p>
                        <p className="max-w-xs truncate text-xs text-slate-400">{event.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-xs text-slate-500">{formatDateTime(event.event_date)}</td>
                  <td className="text-xs text-slate-500">{event.location || "-"}</td>
                  <td>
                    <span className={event.status === "upcoming" ? "badge-green" : "badge-gray"}>{event.status}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => openRegistrations(event)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-800 hover:underline"
                    >
                      <Users className="h-4 w-4" />
                      {Number(event.registered_count || 0)}
                    </button>
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(event)}
                        className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-primary/30 hover:text-primary-800"
                        aria-label={`Edit ${event.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteEvent(event)}
                        className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete ${event.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit event" : "New event"}
        description="Provide event details and an optional image."
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Event title"
            required
          />
          <TextArea
            label="Description"
            name="description"
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Describe the event..."
            rows={4}
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Event date and time"
              name="event_date"
              type="datetime-local"
              value={form.event_date}
              onChange={(event) => updateField("event_date", event.target.value)}
              required
            />
            <SelectField
              label="Status"
              name="status"
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
              options={eventStatuses}
              required
            />
          </div>
          <TextField
            label="Location"
            name="location"
            value={form.location}
            onChange={(event) => updateField("location", event.target.value)}
            placeholder="City / venue"
          />
          <div>
            <label className="label" htmlFor="event-image">
              Image {editing ? "(leave empty to keep current)" : "(optional)"}
            </label>
            <input
              id="event-image"
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              className="input file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-800"
            />
            {editing?.image && !file && <p className="mt-2 text-xs text-slate-400">Current image will be kept.</p>}
          </div>
          <ErrorAlert message={formError} />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : editing ? "Save changes" : "Create event"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(registrationsFor)}
        onClose={() => setRegistrationsFor(null)}
        title="Event registrations"
        description={registrationsFor?.title}
        size="lg"
      >
        <ErrorAlert message={registrationError} />
        {loadingRegistrations ? (
          <Loader label="Loading registrations..." />
        ) : registrations.length === 0 ? (
          <EmptyState title="No registrations yet" description="Registrations for this event will appear here." icon={Users} />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Registered</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((registration) => (
                  <tr key={registration.id}>
                    <td className="font-medium text-primary-950">{registration.full_name}</td>
                    <td>
                      <a href={`mailto:${registration.email}`} className="text-xs text-primary-700 hover:underline">
                        {registration.email}
                      </a>
                      <p className="text-xs text-slate-400">{registration.phone}</p>
                    </td>
                    <td className="text-xs text-slate-500">{formatDateTime(registration.registration_date)}</td>
                    <td>
                      <select
                        value={registration.status}
                        onChange={(event) => updateRegistration(registration, event.target.value)}
                        className="input min-w-32 py-2 text-xs"
                        aria-label={`Registration status for ${registration.full_name}`}
                      >
                        <option value="registered">Registered</option>
                        <option value="attended">Attended</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => deleteRegistration(registration)}
                          className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Remove ${registration.full_name} from event`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>, translationLanguage)
  );
}
