import { translateNode, useLanguage as useTranslationLanguage } from "../../context/LanguageContext.jsx";
import { useState } from "react";
import { Clapperboard, Plus, Trash2 } from "lucide-react";
import { ErrorAlert, SuccessAlert } from "../../components/Alerts";
import EmptyState from "../../components/EmptyState";
import { TextArea, TextField } from "../../components/FormFields";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import useApiData from "../../hooks/useApiData";
import { adminApi, getErrorMessage, publicApi, resolveImage } from "../../services/api";

const emptyForm = { title: "", description: "" };

export default function AdminVideos() {
  const translationLanguage = useTranslationLanguage().language;
  const { data, loading, error, refresh } = useApiData(() => publicApi.videos(), [], []);
  const videos = data || [];
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");

  function openUpload() {
    setForm(emptyForm);
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
    if (file) payload.append("video", file);

    try {
      await adminApi.uploadVideo(payload);
      setNotice("Video uploaded and published.");
      setOpen(false);
      refresh();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(video) {
    if (!window.confirm(`Delete "${video.title}" from the video gallery? This cannot be undone.`)) return;
    setActionError("");
    try {
      await adminApi.deleteVideo(video.id);
      setNotice("Video removed from the website.");
      refresh();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  return (
    translateNode(<div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-primary-950">Video gallery</h1>
          <p className="mt-1 text-sm text-slate-500">Upload videos to show on the Home and Gallery pages.</p>
        </div>
        <button type="button" onClick={openUpload} className="btn-primary btn-sm">
          <Plus className="h-4 w-4" /> Upload video
        </button>
      </div>

      <SuccessAlert message={notice} />
      <ErrorAlert message={error || actionError} />

      {loading ? (
        <Loader label="Loading videos..." />
      ) : videos.length === 0 ? (
        <EmptyState
          icon={Clapperboard}
          title="No videos yet"
          description="Upload an MP4, WEBM, OGV, or OGG video up to 100 MB. Uploaded videos appear on the public website."
          action={<button type="button" onClick={openUpload} className="btn-primary btn-sm"><Plus className="h-4 w-4" /> Upload video</button>}
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {videos.map((video) => (
            <article key={video.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <video src={resolveImage(video.video_url)} controls preload="metadata" className="aspect-video w-full bg-black" />
              <div className="flex items-start justify-between gap-4 p-4">
                <div className="min-w-0">
                  <h2 className="font-semibold text-primary-950">{video.title}</h2>
                  {video.description && <p className="mt-2 text-sm text-slate-500">{video.description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(video)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  aria-label={`Delete ${video.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Upload a video"
        description="Videos will be published on both the Home and Gallery pages."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Video title"
            name="title"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Describe this video"
            required
            maxLength={150}
          />
          <TextArea
            label="Description (optional)"
            name="description"
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            placeholder="Add a short description"
            rows={3}
          />
          <div>
            <label className="label" htmlFor="video-file">Video file <span className="text-red-500">*</span></label>
            <input
              id="video-file"
              type="file"
              accept="video/mp4,video/webm,video/ogg,.mp4,.webm,.ogv,.ogg"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              className="input file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary-800"
              required
            />
            <p className="mt-1.5 text-xs text-slate-400">MP4, WEBM, OGV, or OGG; maximum file size 100 MB.</p>
          </div>
          <ErrorAlert message={formError} />
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button type="button" onClick={() => setOpen(false)} className="btn-outline" disabled={saving}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving || !file}>
              {saving ? "Uploading…" : "Upload video"}
            </button>
          </div>
        </form>
      </Modal>
    </div>, translationLanguage)
  );
}
