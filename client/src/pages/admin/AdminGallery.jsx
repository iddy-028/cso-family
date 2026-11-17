import { translateNode, useLanguage as useTranslationLanguage } from "../../context/LanguageContext.jsx";
import { useState } from "react";
import { Images, Pencil, Plus, Search, Trash2 } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import { ErrorAlert, SuccessAlert } from "../../components/Alerts";
import { SelectField, TextArea, TextField } from "../../components/FormFields";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import useApiData from "../../hooks/useApiData";
import { galleryCategories } from "../../data/fallbackData";
import { adminApi, getErrorMessage, resolveImage } from "../../services/api";

const emptyForm = { title: "", description: "", category: galleryCategories[0] };

export default function AdminGallery() {
  const translationLanguage = useTranslationLanguage().language;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const { data, loading, error, refresh } = useApiData(
    () => adminApi.gallery({ search, category }),
    [],
    [search, category],
  );
  const images = data || [];
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openUpload() {
    setEditing(null);
    setForm(emptyForm);
    setFile(null);
    setFormError("");
    setOpen(true);
  }

  function openEdit(image) {
    setEditing(image);
    setForm({
      title: image.title || "",
      description: image.description || "",
      category: image.category || galleryCategories[0],
    });
    setFile(null);
    setFormError("");
    setOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (file) payload.append("image", file);

    try {
      if (editing) {
        await adminApi.updateGalleryItem(editing.id, payload);
        setNotice("Gallery photo updated.");
      } else {
        await adminApi.createGalleryItem(payload);
        setNotice("Photo added to the gallery.");
      }
      setOpen(false);
      refresh();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(image) {
    if (!window.confirm(`Delete "${image.title}" from the gallery? This cannot be undone.`)) return;
    setActionError("");
    try {
      await adminApi.deleteGalleryItem(image.id);
      setNotice("Photo removed from the gallery.");
      refresh();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  return (
    translateNode(<div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-primary-950">Gallery</h1>
          <p className="mt-1 text-sm text-slate-500">Add photos that appear in the public gallery, or remove old ones.</p>
        </div>
        <button type="button" onClick={openUpload} className="btn-primary btn-sm">
          <Plus className="h-4 w-4" /> Add photo
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
            placeholder="Search photos..."
            className="input pl-11"
            aria-label="Search gallery photos"
          />
        </div>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="input sm:max-w-xs"
          aria-label="Filter photos by category"
        >
          <option value="">All categories</option>
          {galleryCategories.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader label="Loading gallery..." />
      ) : images.length === 0 ? (
        <EmptyState
          icon={Images}
          title={search || category ? "No photos found" : "No gallery photos yet"}
          description={search || category ? "Try changing your search or category." : "Add a photo to share it in the public gallery."}
          action={
            <button type="button" onClick={openUpload} className="btn-primary btn-sm">
              <Plus className="h-4 w-4" /> Add photo
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image) => (
            <article key={image.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <img src={resolveImage(image.image_url)} alt={image.title} className="aspect-[4/3] w-full object-cover" />
              <div className="flex items-start justify-between gap-4 p-4">
                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-primary-950">{image.title}</h2>
                  <span className="badge-gold mt-2">{image.category}</span>
                  {image.description && <p className="mt-2 line-clamp-2 text-sm text-slate-500">{image.description}</p>}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(image)}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-primary/30 hover:text-primary-800"
                    aria-label={`Edit ${image.title}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(image)}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete ${image.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Update gallery photo" : "Add a gallery photo"}
        description={editing ? "Change the image or update its title, category, and caption." : "Uploaded photos appear on the public gallery page."}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Photo title"
            name="title"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Describe this moment"
            required
            maxLength={150}
          />
          <SelectField
            label="Category"
            name="category"
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            options={galleryCategories}
          />
          <TextArea
            label="Description (optional)"
            name="description"
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Add a short caption"
            rows={3}
          />
          <div>
            <label className="label" htmlFor="gallery-image">Photo <span className="text-red-500">*</span></label>
            {editing && (
              <img src={resolveImage(editing.image_url)} alt={editing.title} className="mb-3 aspect-video w-full rounded-2xl object-cover" />
            )}
            <input
              id="gallery-image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              className="input file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary-800"
              required={!editing}
            />
            <p className="mt-1.5 text-xs text-slate-400">
              {editing ? "Choose a new image only if you want to replace the current one. " : ""}
              JPG, PNG, WEBP, or GIF; maximum file size 5 MB.
            </p>
          </div>
          <ErrorAlert message={formError} />
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button type="button" onClick={() => setOpen(false)} className="btn-outline" disabled={saving}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving || !file}>
              {saving ? (editing ? "Saving..." : "Uploading...") : (editing ? "Save changes" : "Upload photo")}
            </button>
          </div>
        </form>
      </Modal>
    </div>, translationLanguage)
  );
}
