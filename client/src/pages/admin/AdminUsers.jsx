import { useState } from "react";
import { Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { ErrorAlert, SuccessAlert } from "../../components/Alerts";
import EmptyState from "../../components/EmptyState";
import { SelectField, TextField } from "../../components/FormFields";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import useApiData from "../../hooks/useApiData";
import { useAuth } from "../../context/AuthContext";
import { adminApi, getErrorMessage } from "../../services/api";
import { formatDateTime } from "../../utils/format";

const userRoles = ["admin", "staff", "volunteer"];
const emptyForm = {
  full_name: "",
  email: "",
  phone: "",
  role: "staff",
  is_active: "1",
  password: "",
};

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const { data, loading, error, refresh } = useApiData(
    () => adminApi.users({ search, role }),
    [],
    [search, role],
  );
  const users = data || [];
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");

  function openCreate() {
    setEditing(null);
    setCreating(true);
    setForm(emptyForm);
    setFormError("");
  }

  function openEdit(account) {
    setCreating(false);
    setEditing(account);
    setForm({
      full_name: account.full_name || "",
      email: account.email || "",
      phone: account.phone || "",
      role: account.role || "staff",
      is_active: Number(account.is_active) ? "1" : "0",
      password: "",
    });
    setFormError("");
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFormError("");

    const payload = {
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      is_active: Number(form.is_active),
    };
    if (form.password || creating) payload.password = form.password;

    try {
      const result = creating
        ? await adminApi.createUser(payload)
        : await adminApi.updateUser(editing.id, payload);
      setNotice(creating ? "User created successfully." : "User updated successfully.");
      setCreating(false);
      setEditing(null);
      if (!creating && Number(currentUser?.id) === Number(editing.id)) {
        window.dispatchEvent(new CustomEvent("cso:user-updated", { detail: result.user }));
      }
      refresh();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function deleteUser(account) {
    if (Number(currentUser?.id) === Number(account.id)) {
      setActionError("You cannot delete your own account.");
      return;
    }
    if (!window.confirm(`Delete the account for ${account.full_name}? This cannot be undone.`)) return;
    setActionError("");
    try {
      await adminApi.deleteUser(account.id);
      setNotice("User deleted successfully.");
      refresh();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-primary-950">Users</h1>
          <p className="mt-1 text-sm text-slate-500">Create and manage administrator, staff, and volunteer accounts.</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary btn-sm">
          <Plus className="h-4 w-4" /> Add user
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
            placeholder="Search users..."
            className="input pl-11"
            aria-label="Search users"
          />
        </div>
        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="input sm:max-w-xs"
          aria-label="Filter users by role"
        >
          <option value="">All roles</option>
          {userRoles.map((item) => (
            <option key={item} value={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader label="Loading users..." />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title={search || role ? "No users found" : "No users yet"}
          description={search || role ? "Try changing your search or role filter." : "User accounts will appear here."}
        />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((account) => (
                <tr key={account.id}>
                  <td>
                    <p className="font-medium text-primary-950">
                      {account.full_name}
                      {Number(currentUser?.id) === Number(account.id) && (
                        <span className="ml-2 text-xs font-normal text-slate-400">(you)</span>
                      )}
                    </p>
                    <a href={`mailto:${account.email}`} className="text-xs text-primary-700 hover:underline">
                      {account.email}
                    </a>
                  </td>
                  <td className="text-xs text-slate-500">{account.phone || "—"}</td>
                  <td><span className="badge-blue capitalize">{account.role}</span></td>
                  <td>
                    <span className={Number(account.is_active) ? "badge-green" : "badge-gray"}>
                      {Number(account.is_active) ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap text-xs text-slate-500">{formatDateTime(account.created_at)}</td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(account)}
                        className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-primary/30 hover:text-primary-800"
                        aria-label={`Edit ${account.full_name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteUser(account)}
                        disabled={Number(currentUser?.id) === Number(account.id)}
                        className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Delete ${account.full_name}`}
                        title={Number(currentUser?.id) === Number(account.id) ? "You cannot delete your own account" : undefined}
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
        open={Boolean(editing) || creating}
        onClose={() => { setEditing(null); setCreating(false); }}
        title={creating ? "Create user account" : "Update user"}
        description={creating
          ? "Create an account for an administrator, staff member, or volunteer."
          : "Edit account details, access role, or status. Leave password blank to keep it unchanged."}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Full name"
            name="full_name"
            value={form.full_name}
            onChange={(event) => updateField("full_name", event.target.value)}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
          />
          <TextField
            label="Phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Role"
              name="role"
              value={form.role}
              onChange={(event) => updateField("role", event.target.value)}
              options={userRoles}
              required
            />
            <SelectField
              label="Account status"
              name="is_active"
              value={form.is_active}
              onChange={(event) => updateField("is_active", event.target.value)}
              options={[
                { value: "1", label: "Active" },
                { value: "0", label: "Inactive" },
              ]}
              required
            />
          </div>
          <TextField
            label={creating ? "Password" : "New password (optional)"}
            name="password"
            type="password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required={creating}
            hint={creating ? "Must be at least 8 characters." : "Leave blank to keep the current password."}
          />
          <ErrorAlert message={formError} />
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button type="button" onClick={() => { setEditing(null); setCreating(false); }} className="btn-outline" disabled={saving}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? (creating ? "Creating..." : "Saving...") : (creating ? "Create user" : "Save changes")}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
