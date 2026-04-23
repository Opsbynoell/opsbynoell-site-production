"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AdminUser {
  id: string;
  email: string;
  is_super_admin: boolean;
  created_at: string;
  accessible_clients: string[];
}

function relativeDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "invite">("invite");
  const [form, setForm] = useState({
    email: "",
    password: "",
    isSuperAdmin: false,
    accessibleClients: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState({
    password: "",
    isSuperAdmin: false,
    accessibleClients: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  async function loadUsers() {
    const res = await fetch("/api/admin/users");
    if (res.status === 403) {
      router.replace("/admin");
      return;
    }
    if (res.status === 401) {
      router.replace("/admin/login");
      return;
    }
    const data = await res.json();
    setUsers(data.users ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setFormLoading(true);
    try {
      const endpoint =
        formMode === "invite" ? "/api/admin/users/invite" : "/api/admin/users";
      const payload: Record<string, unknown> = {
        email: form.email,
        isSuperAdmin: form.isSuperAdmin,
        accessibleClients: form.accessibleClients
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      if (formMode === "create") payload.password = form.password;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (!res.ok) {
        setFormError(d.error ?? "Failed to create user");
        return;
      }

      if (formMode === "invite") {
        if (d.emailSent) {
          setFormSuccess(`Invite sent to ${form.email}. Link expires in 48 hours.`);
        } else {
          setFormError(
            `User created, but email failed to send (${d.emailError ?? "unknown"}). Check RESEND_API_KEY.`
          );
        }
      }

      setForm({ email: "", password: "", isSuperAdmin: false, accessibleClients: "" });
      if (formMode === "create") setShowForm(false);
      await loadUsers();
    } finally {
      setFormLoading(false);
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editUser) return;
    setEditError("");
    setEditLoading(true);
    try {
      const payload: Record<string, unknown> = {
        isSuperAdmin: editForm.isSuperAdmin,
        accessibleClients: editForm.accessibleClients
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      if (editForm.password) payload.password = editForm.password;
      const res = await fetch(`/api/admin/users/${editUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json();
        setEditError(d.error ?? "Update failed");
        return;
      }
      setEditUser(null);
      await loadUsers();
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete(user: AdminUser) {
    if (!confirm(`Delete ${user.email}? This cannot be undone.`)) return;
    await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    await loadUsers();
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white border-b border-warm-border px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin")}
            className="text-xs text-charcoal/40 hover:text-charcoal transition-colors"
          >
            ← Inbox
          </button>
          <span className="font-serif text-lg font-semibold text-charcoal">
            Users
          </span>
          <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-wine/10 text-wine">
            super admin
          </span>
        </div>
        <button
          onClick={() => {
            setFormMode("invite");
            setFormError("");
            setFormSuccess("");
            setShowForm(true);
          }}
          className="text-xs bg-wine text-cream px-3 py-1.5 rounded-lg hover:bg-wine/90 transition-colors"
        >
          + New user
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-5 h-5 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
          </div>
        ) : (
          <div className="max-w-2xl">
            <div className="bg-white rounded-[16px] border border-warm-border overflow-hidden">
              {users.length === 0 ? (
                <p className="text-sm text-charcoal/50 px-6 py-8 text-center">
                  No admin users yet.
                </p>
              ) : (
                users.map((u, i) => (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between px-5 py-4 ${
                      i < users.length - 1 ? "border-b border-warm-border" : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-charcoal truncate">
                          {u.email}
                        </span>
                        {u.is_super_admin && (
                          <span className="shrink-0 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-wine/10 text-wine">
                            super admin
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] text-charcoal/40">
                          Created {relativeDate(u.created_at)}
                        </span>
                        {!u.is_super_admin && u.accessible_clients.length > 0 && (
                          <span className="text-[10px] text-charcoal/50">
                            Clients: {u.accessible_clients.join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <button
                        onClick={() => {
                          setEditUser(u);
                          setEditForm({
                            password: "",
                            isSuperAdmin: u.is_super_admin,
                            accessibleClients: u.accessible_clients.join(", "),
                          });
                          setEditError("");
                        }}
                        className="text-xs text-charcoal/50 hover:text-charcoal transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create / invite user modal */}
      {showForm && (
        <div className="fixed inset-0 bg-charcoal/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] border border-warm-border shadow-lg p-6 w-full max-w-sm">
            <h2 className="font-serif text-lg font-semibold text-charcoal mb-4">
              New admin user
            </h2>

            {/* Mode toggle */}
            <div className="flex gap-2 mb-5 p-1 bg-cream rounded-xl border border-warm-border">
              <button
                type="button"
                onClick={() => {
                  setFormMode("invite");
                  setFormError("");
                  setFormSuccess("");
                }}
                className={`flex-1 h-8 rounded-lg text-xs font-medium transition-colors ${
                  formMode === "invite"
                    ? "bg-wine text-cream"
                    : "text-charcoal/60 hover:text-charcoal"
                }`}
              >
                Invite via email
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormMode("create");
                  setFormError("");
                  setFormSuccess("");
                }}
                className={`flex-1 h-8 rounded-lg text-xs font-medium transition-colors ${
                  formMode === "create"
                    ? "bg-wine text-cream"
                    : "text-charcoal/60 hover:text-charcoal"
                }`}
              >
                Create with password
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-charcoal/70 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  autoFocus
                  placeholder="user@example.com"
                  className="w-full h-10 px-3 text-sm bg-cream rounded-xl border border-warm-border focus:outline-none focus:border-wine/50"
                />
              </div>
              {formMode === "create" && (
                <div>
                  <label className="block text-xs font-medium text-charcoal/70 mb-1">
                    Temporary password
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Strong password"
                    className="w-full h-10 px-3 text-sm bg-cream rounded-xl border border-warm-border focus:outline-none focus:border-wine/50"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-charcoal/70 mb-1">
                  Accessible clients (comma-separated, leave blank for super admin)
                </label>
                <input
                  type="text"
                  value={form.accessibleClients}
                  onChange={(e) => setForm({ ...form, accessibleClients: e.target.value })}
                  placeholder="santa, dentist_abc"
                  className="w-full h-10 px-3 text-sm bg-cream rounded-xl border border-warm-border focus:outline-none focus:border-wine/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isSuperAdmin"
                  checked={form.isSuperAdmin}
                  onChange={(e) => setForm({ ...form, isSuperAdmin: e.target.checked })}
                  className="accent-wine"
                />
                <label htmlFor="isSuperAdmin" className="text-sm text-charcoal/70">
                  Super admin (sees all clients)
                </label>
              </div>
              {formMode === "invite" && (
                <p className="text-[11px] text-charcoal/50 leading-relaxed">
                  An email from hello@opsbynoell.com will be sent with a link to set
                  their password. The link expires in 48 hours.
                </p>
              )}
              {formError && (
                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                  {formError}
                </p>
              )}
              {formSuccess && (
                <p className="text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                  {formSuccess}
                </p>
              )}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormSuccess("");
                    setFormError("");
                  }}
                  className="flex-1 h-10 rounded-xl border border-warm-border text-sm text-charcoal/60 hover:text-charcoal transition-colors"
                >
                  {formSuccess ? "Done" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={
                    !form.email ||
                    (formMode === "create" && !form.password) ||
                    formLoading
                  }
                  className="flex-1 h-10 rounded-xl bg-wine text-cream text-sm font-medium hover:bg-wine/90 disabled:opacity-40 transition-colors"
                >
                  {formLoading
                    ? formMode === "invite"
                      ? "Sending…"
                      : "Creating…"
                    : formMode === "invite"
                      ? "Send invite"
                      : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit user modal */}
      {editUser && (
        <div className="fixed inset-0 bg-charcoal/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] border border-warm-border shadow-lg p-6 w-full max-w-sm">
            <h2 className="font-serif text-lg font-semibold text-charcoal mb-1">
              Edit user
            </h2>
            <p className="text-xs text-charcoal/50 mb-4">{editUser.email}</p>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-charcoal/70 mb-1">
                  New password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="Leave blank to keep current"
                  className="w-full h-10 px-3 text-sm bg-cream rounded-xl border border-warm-border focus:outline-none focus:border-wine/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal/70 mb-1">
                  Accessible clients (comma-separated)
                </label>
                <input
                  type="text"
                  value={editForm.accessibleClients}
                  onChange={(e) => setEditForm({ ...editForm, accessibleClients: e.target.value })}
                  placeholder="santa, dentist_abc"
                  className="w-full h-10 px-3 text-sm bg-cream rounded-xl border border-warm-border focus:outline-none focus:border-wine/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editIsSuperAdmin"
                  checked={editForm.isSuperAdmin}
                  onChange={(e) => setEditForm({ ...editForm, isSuperAdmin: e.target.checked })}
                  className="accent-wine"
                />
                <label htmlFor="editIsSuperAdmin" className="text-sm text-charcoal/70">
                  Super admin
                </label>
              </div>
              {editError && (
                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                  {editError}
                </p>
              )}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="flex-1 h-10 rounded-xl border border-warm-border text-sm text-charcoal/60 hover:text-charcoal transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 h-10 rounded-xl bg-wine text-cream text-sm font-medium hover:bg-wine/90 disabled:opacity-40 transition-colors"
                >
                  {editLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
