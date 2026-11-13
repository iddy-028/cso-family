import { useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import { ErrorAlert, SuccessAlert } from "../../components/Alerts";
import { SelectField, TextArea, TextField } from "../../components/FormFields";
import useApiData from "../../hooks/useApiData";
import { adminApi, getErrorMessage, resolveImage } from "../../services/api";
import { activityCategories } from "../../data/fallbackData";
import { formatDate } from "../../utils/format";

const emptyForm = {
  title: "",
  description: "",
  category: activityCategories[0],
  activity_date: "",
  location: "",
};

export default function AdminActivities() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const { data: activities, loading, error, refresh } = useApiData(
    () => adminApi.activities({ search, category }),
    [],
    [search, category],
  );

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

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

  function openEdit(activity) {
    setEditing(activity);
    setForm({
      title: activity.title || "",
      description: activity.description || "",
      category: activity.category || activityCategories[0],
      activity_date: (activity.activity_date || "").slice(0, 10),
      location: activity.location || "",
    });
    setFile(null);
    setFormError("");
    setOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value ?? ""));
      if (file) payload.append("image", file);

      if (editing) {
        await adminApi.updateActivity(editing.id, payload);
        setNotice("Activity updated successfully.");
      } else {
        await adminApi.createActivity(payload);
        setNotice("Activity created successfully.");
      }
      setOpen(false);
      refresh();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(activity) {
    if (!window.confirm(`Delete "${activity.title}"? This cannot be undone.`)) return;
    try {
      await adminApi.deleteActivity(activity.id);
      setNotice("Activity deleted successfully.");
      refresh();
    } catch (err) {
      setNotice(getErrorMessage(err));
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-primary-950">Activities</h1>
          <p className="mt-1 text-sm text-slate-500">Create, edit, and remove community service activities.</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary btn-sm">
          <Plus className="h-4 w-4" /> New activity
        </button>
      </div>

      <SuccessAlert message={notice} />
      <ErrorAlert message={error} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search activities..."
            className="input pl-11"
            aria-label="Search activities"
          />
        </div>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="input sm:max-w-xs"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {activityCategories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader label="Loading activities..." />
      ) : activities.length === 0 ? (
        <EmptyState
          title="No activities found"
          description="Create a new activity or adjust your search filters."
          action={
            <button type="button" onClick={openCreate} className="btn-primary btn-sm">
              <Plus className="h-4 w-4" /> New activity
            </button>
          }
        />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Category</th>
                <th>Date</th>
                <th>Location</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        src={resolveImage(activity.image)}
                        alt=""
                        className="h-11 w-11 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <p className="max-w-xs truncate font-medium text-primary-950">{activity.title}</p>
                        <p className="max-w-xs truncate text-xs text-slate-400">{activity.description}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge-gold">{activity.category}</span>
                  </td>
                  <td className="text-xs text-slate-500">{formatDate(activity.activity_date)}</td>
                  <td className="text-xs text-slate-500">{activity.location || "-"}</td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(activity)}
                        className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-primary/30 hover:text-primary-800"
                        aria-label={`Edit ${activity.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(activity)}
                        className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete ${activity.title}`}
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
        title={editing ? "Edit activity" : "New activity"}
        description="Provide the activity details and an optional image."
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Activity title"
            required
          />
          <TextArea
            label="Description"
            name="description"
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Describe the activity..."
            rows={4}
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Category"
              name="category"
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
              options={activityCategories}
              required
            />
            <TextField
              label="Activity date"
              name="activity_date"
              type="date"
              value={form.activity_date}
              onChange={(event) => updateField("activity_date", event.target.value)}
            />
          </div>
          <TextField
            label="Location"
            name="location"
            value={form.location}
            onChange={(event) => updateField("location", event.target.value)}
            placeholder="City / district"
          />
          <div>
            <label className="label" htmlFor="activity-image">
              Image {editing ? "(leave empty to keep current)" : "(optional)"}
            </label>
            <input
              id="activity-image"
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              className="input file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-800"
            />
            {editing?.image && !file && (
              <p className="mt-2 text-xs text-slate-400">Current image will be kept.</p>
            )}
          </div>

          <ErrorAlert message={formError} />

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : editing ? "Save changes" : "Create activity"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
