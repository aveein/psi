"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Site, User } from "../../lib/types";
import { useToast } from "../../components/Toast";
import { PageTop } from "../../components/PageTop";
import { Empty } from "../../components/Empty";
import { Modal } from "../../components/Modal";
import { EditIcon, PlusIcon, TrashIcon } from "../../components/Icons";

export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [un, setUn] = useState("");
  const [pw, setPw] = useState("");
  const [role, setRole] = useState<"admin" | "editor" | "site">("site");
  const [site, setSite] = useState("");
  const [delTarget, setDelTarget] = useState<User | null>(null);

  async function load() {
    const r = await api.get<{ data: User[] }>("/api/users");
    setUsers(r.data || []);
  }
  useEffect(() => {
    load();
    api.get<{ data: Site[] }>("/api/sites").then((r) => setSites(r.data || []));
  }, []);

  function openForm(u: User | null) {
    setEditing(u);
    setUn(u?.username || "");
    setPw("");
    setRole((u?.role as any) || "site");
    setSite(u?.site || "");
    setOpen(true);
  }

  async function save() {
    if (!un || (!editing && !pw)) {
      toast("Username and password required", "error");
      return;
    }
    if (role === "site" && !site) {
      toast("Select a site for site users", "error");
      return;
    }
    try {
      const body: any = { username: un, role, site: role === "site" ? site : null };
      if (pw) body.password = pw;
      if (editing) await api.put(`/api/users/${editing.id}`, body);
      else await api.post("/api/users", body);
      toast("User saved", "success");
      setOpen(false);
      load();
    } catch (e: any) {
      toast(e.message, "error");
    }
  }

  async function handleDelete() {
    if (!delTarget) return;
    try {
      await api.del(`/api/users/${delTarget.id}`);
      toast("User deleted", "info");
      setDelTarget(null);
      load();
    } catch (e: any) {
      toast(e.message, "error");
    }
  }

  return (
    <>
      <PageTop
        title="Users"
        sub={`${users.length} accounts`}
        actions={
          <button className="btn btn-p btn-sm" onClick={() => openForm(null)}>
            <PlusIcon /> Add User
          </button>
        }
      />
      <div className="pg-body">
        <div className="card">
          {users.length === 0 ? (
            <Empty title="No users" />
          ) : (
            users.map((u) => (
              <div key={u.id} className="lrow">
                <div
                  className="sb-av"
                  style={{
                    background:
                      u.role === "admin"
                        ? "var(--blue)"
                        : u.role === "editor"
                        ? "var(--purple)"
                        : "var(--green)",
                  }}
                >
                  {u.username.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{u.username}</div>
                  <div style={{ fontSize: 11, color: "var(--t3)" }}>
                    {u.role}
                    {u.site ? ` · ${u.site}` : ""}
                  </div>
                </div>
                <span
                  className={`badge ${
                    u.role === "admin" ? "b-admin" : u.role === "editor" ? "b-editor" : "b-site-u"
                  }`}
                >
                  {u.role}
                </span>
                <div style={{ display: "flex", gap: 5 }}>
                  <button className="ib edit" onClick={() => openForm(u)}>
                    <EditIcon size={12} />
                  </button>
                  {u.username !== "admin" && (
                    <button className="ib del" onClick={() => setDelTarget(u)}>
                      <TrashIcon size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit User" : "Add User"}
        footer={
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-p btn-sm" onClick={save}>
              {editing ? "Save Changes" : "Create User"}
            </button>
          </>
        }
      >
        <div className="fgrid">
          <div className="fg">
            <label>
              Username<span className="req">*</span>
            </label>
            <input className="fi" value={un} onChange={(e) => setUn(e.target.value)} maxLength={30} />
          </div>
          <div className="fg">
            <label>
              Password{!editing && <span className="req">*</span>}
            </label>
            <input
              type="text"
              className="fi"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder={editing ? "Leave empty to keep current" : ""}
              maxLength={50}
            />
          </div>
          <div className="fg">
            <label>
              Role<span className="req">*</span>
            </label>
            <select className="fi" value={role} onChange={(e) => setRole(e.target.value as any)}>
              <option value="site">Site User</option>
              <option value="editor">Editor (all sites)</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {role === "site" && (
            <div className="fg">
              <label>Assigned Site</label>
              <select className="fi" value={site} onChange={(e) => setSite(e.target.value)}>
                <option value="">None</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        title="Confirm Delete"
        size="sm"
        footer={
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => setDelTarget(null)}>
              Cancel
            </button>
            <button className="btn btn-d btn-sm" onClick={handleDelete}>
              Delete
            </button>
          </>
        }
      >
        <p>Delete user "{delTarget?.username}"?</p>
      </Modal>
    </>
  );
}
