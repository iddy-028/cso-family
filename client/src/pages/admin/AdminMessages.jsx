import { useState } from "react";
import { Mail, MailOpen, Search, Trash2 } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import { ErrorAlert, SuccessAlert } from "../../components/Alerts";
import useApiData from "../../hooks/useApiData";
import { adminApi, getErrorMessage } from "../../services/api";
import { formatDateTime } from "../../utils/format";

export default function AdminMessages() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const { data, loading, error, refresh } = useApiData(
    () => adminApi.messages({ search, status }),
    [],
    [search, status],
  );
  const messages = data || [];
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");

  async function openMessage(message) {
    setSelected(message);
    setNotice("");
    setActionError("");
    if (message.status !== "unread") return;

    try {
      await adminApi.markMessageRead(message.id);
      setSelected({ ...message, status: "read" });
      setNotice("Message marked as read.");
      refresh();
      window.dispatchEvent(new Event("cso:messages-updated"));
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  async function deleteMessage(message) {
    if (!window.confirm(`Delete the message from ${message.full_name}? This cannot be undone.`)) return;
    setActionError("");
    try {
      await adminApi.deleteMessage(message.id);
      if (selected?.id === message.id) setSelected(null);
      setNotice("Message deleted.");
      refresh();
      window.dispatchEvent(new Event("cso:messages-updated"));
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl text-primary-950">Contact messages</h1>
        <p className="mt-1 text-sm text-slate-500">Read and manage messages sent through the website contact form.</p>
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
            placeholder="Search messages..."
            className="input pl-11"
            aria-label="Search contact messages"
          />
        </div>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="input sm:max-w-xs"
          aria-label="Filter messages by status"
        >
          <option value="">All messages</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      {loading ? (
        <Loader label="Loading messages..." />
      ) : messages.length === 0 ? (
        <EmptyState
          title={search || status ? "No messages found" : "No messages yet"}
          description={search || status ? "Try changing your search or filter." : "Messages sent through the contact form will appear here."}
          icon={Mail}
        />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>From</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Received</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id}>
                  <td>
                    <p className="font-medium text-primary-950">{message.full_name}</p>
                    <a href={`mailto:${message.email}`} className="text-xs text-primary-700 hover:underline">
                      {message.email}
                    </a>
                  </td>
                  <td className="max-w-xs truncate">{message.subject}</td>
                  <td>
                    <span className={message.status === "unread" ? "badge-gold" : "badge-gray"}>{message.status}</span>
                  </td>
                  <td className="text-xs text-slate-500">{formatDateTime(message.created_at)}</td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openMessage(message)}
                        className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-primary/30 hover:text-primary-800"
                        aria-label={`Read message from ${message.full_name}`}
                      >
                        {message.status === "unread" ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMessage(message)}
                        className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete message from ${message.full_name}`}
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
        title={selected?.subject || "Contact message"}
        description={selected ? `Received ${formatDateTime(selected.created_at)}` : ""}
      >
        {selected && (
          <div className="space-y-4">
            <ErrorAlert message={actionError} />
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-primary-950">{selected.full_name}</p>
              <a href={`mailto:${selected.email}`} className="mt-1 block text-sm text-primary-700 hover:underline">
                {selected.email}
              </a>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">{selected.message}</p>
            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
              <button type="button" onClick={() => deleteMessage(selected)} className="btn-outline text-red-600">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject || ""}`)}`}
                className="btn-primary"
              >
                Reply by email
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
