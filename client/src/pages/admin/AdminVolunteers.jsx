import { useState } from "react";
import { Eye, MapPin, Search, Trash2, Users } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import { ErrorAlert, SuccessAlert } from "../../components/Alerts";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import useApiData from "../../hooks/useApiData";
import { adminApi, getErrorMessage } from "../../services/api";
import { formatDateTime } from "../../utils/format";

const volunteerStatuses = ["pending", "approved", "rejected"];

function statusClass(status) {
  if (status === "approved") return "badge-green";
  if (status === "rejected") return "badge-red";
  return "badge-gold";
}

export default function AdminVolunteers() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const { data, loading, error, refresh } = useApiData(
    () => adminApi.volunteers({ search, status }),
    [],
    [search, status],
  );
  const volunteers = data || [];
  const [selected, setSelected] = useState(null);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");

  async function updateStatus(volunteer, nextStatus) {
    setActionError("");
    try {
      await adminApi.updateVolunteerStatus(volunteer.id, nextStatus);
      setNotice(`${volunteer.full_name}'s application marked ${nextStatus}.`);
      refresh();
      if (selected?.id === volunteer.id) setSelected({ ...selected, status: nextStatus });
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  async function deleteVolunteer(volunteer) {
    if (!window.confirm(`Delete the volunteer application from ${volunteer.full_name}? This cannot be undone.`)) return;
    setActionError("");
    try {
      await adminApi.deleteVolunteer(volunteer.id);
      setNotice("Volunteer application deleted.");
      if (selected?.id === volunteer.id) setSelected(null);
      refresh();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl text-primary-950">Volunteers</h1>
        <p className="mt-1 text-sm text-slate-500">Review volunteer applications and update their status.</p>
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
            placeholder="Search volunteers..."
            className="input pl-11"
            aria-label="Search volunteers"
          />
        </div>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="input sm:max-w-xs"
          aria-label="Filter volunteers by status"
        >
          <option value="">All applications</option>
          {volunteerStatuses.map((item) => (
            <option key={item} value={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader label="Loading volunteers..." />
      ) : volunteers.length === 0 ? (
        <EmptyState
          icon={Users}
          title={search || status ? "No volunteers found" : "No volunteer applications yet"}
          description={search || status ? "Try changing your search or status filter." : "Applications submitted through the website will appear here."}
        />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Volunteer</th>
                <th>Location & interests</th>
                <th>Applied</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((volunteer) => (
                <tr key={volunteer.id}>
                  <td>
                    <p className="font-medium text-primary-950">{volunteer.full_name}</p>
                    <a href={`mailto:${volunteer.email}`} className="text-xs text-primary-700 hover:underline">
                      {volunteer.email}
                    </a>
                    {volunteer.phone && (
                      <a href={`tel:${volunteer.phone}`} className="mt-0.5 block text-xs text-slate-500 hover:text-primary-700">
                        {volunteer.phone}
                      </a>
                    )}
                  </td>
                  <td className="max-w-xs">
                    <p className="flex items-center gap-1 text-xs text-slate-600">
                      <MapPin className="h-3.5 w-3.5 shrink-0" /> {volunteer.location || "Not provided"}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-400">{volunteer.skills || "No interests listed"}</p>
                  </td>
                  <td className="whitespace-nowrap text-xs text-slate-500">{formatDateTime(volunteer.created_at)}</td>
                  <td>
                    <select
                      value={volunteer.status}
                      onChange={(event) => updateStatus(volunteer, event.target.value)}
                      className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold capitalize focus:ring-2 focus:ring-primary/20 ${
                        volunteer.status === "approved"
                          ? "bg-secondary text-primary-800"
                          : volunteer.status === "rejected"
                            ? "bg-red-50 text-red-700"
                            : "bg-accent/15 text-accent-dark"
                      }`}
                      aria-label={`Update status for ${volunteer.full_name}`}
                    >
                      {volunteerStatuses.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelected(volunteer)}
                        className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-primary/30 hover:text-primary-800"
                        aria-label={`View ${volunteer.full_name}'s application`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteVolunteer(volunteer)}
                        className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete ${volunteer.full_name}'s application`}
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
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.full_name || "Volunteer application"}
        description={selected ? `Applied ${formatDateTime(selected.created_at)}` : ""}
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-400">Email</p>
                <a href={`mailto:${selected.email}`} className="font-medium text-primary-700 hover:underline">{selected.email}</a>
              </div>
              <div>
                <p className="text-xs text-slate-400">Phone</p>
                {selected.phone ? (
                  <a href={`tel:${selected.phone}`} className="font-medium text-primary-700 hover:underline">{selected.phone}</a>
                ) : <p className="font-medium text-slate-700">Not provided</p>}
              </div>
              <div>
                <p className="text-xs text-slate-400">Location</p>
                <p className="font-medium text-slate-700">{selected.location || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Gender</p>
                <p className="font-medium text-slate-700">{selected.gender || "Not provided"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-slate-400">Skills or interests</p>
                <p className="font-medium text-slate-700">{selected.skills || "Not provided"}</p>
              </div>
            </div>
            <div>
              <p className="label">Motivation</p>
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">{selected.motivation || "No message provided."}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <span className={statusClass(selected.status)}>{selected.status}</span>
              <div className="flex flex-wrap gap-2">
                {volunteerStatuses.filter((item) => item !== selected.status).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => updateStatus(selected, item)}
                    className="btn-outline btn-sm capitalize"
                  >
                    Mark {item}
                  </button>
                ))}
              </div>
            </div>
            <ErrorAlert message={actionError} />
          </div>
        )}
      </Modal>
    </div>
  );
}
