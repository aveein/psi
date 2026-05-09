"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Site } from "../../lib/types";
import { useToast } from "../../components/Toast";
import { PageTop } from "../../components/PageTop";
import { Empty } from "../../components/Empty";
import { Modal } from "../../components/Modal";
import { EditIcon, MapPinIcon, PlusIcon, TrashIcon } from "../../components/Icons";

export default function SitesPage() {
  const { toast } = useToast();
  const [sites, setSites] = useState<Site[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Site | null>(null);
  const [name, setName] = useState("");
  const [delTarget, setDelTarget] = useState<Site | null>(null);

  async function load() {
    const r = await api.get<{ data: Site[] }>("/api/sites");
    setSites(r.data || []);
  }
  useEffect(() => {
    load();
  }, []);

  function openForm(s: Site | null) {
    setEditing(s);
    setName(s?.name || "");
    setOpen(true);
  }

  async function save() {
    if (!name.trim()) {
      toast("Site name required", "error");
      return;
    }
    try {
      if (editing) await api.put(`/api/sites/${editing.id}`, { name });
      else await api.post("/api/sites", { name });
      toast("Site saved", "success");
      setOpen(false);
      load();
    } catch (e: any) {
      toast(e.message, "error");
    }
  }

  async function handleDelete() {
    if (!delTarget) return;
    try {
      await api.del(`/api/sites/${delTarget.id}`);
      toast("Site deleted", "info");
      setDelTarget(null);
      load();
    } catch (e: any) {
      toast(e.message, "error");
    }
  }

  return (
    <>
      <PageTop
        title="Sites"
        sub={`${sites.length} registered work sites`}
        actions={
          <button className="btn btn-p btn-sm" onClick={() => openForm(null)}>
            <PlusIcon /> Add Site
          </button>
        }
      />
      <div className="pg-body">
        <div className="card">
          {sites.length === 0 ? (
            <Empty title="No sites" sub="Add work sites" />
          ) : (
            sites.map((s) => (
              <div key={s.id} className="lrow">
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "var(--r6)",
                    background: "var(--blue-lt)",
                    color: "var(--blue)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MapPinIcon size={13} />
                </div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                <div style={{ display: "flex", gap: 5 }}>
                  <button className="ib edit" onClick={() => openForm(s)}>
                    <EditIcon size={12} />
                  </button>
                  <button className="ib del" onClick={() => setDelTarget(s)}>
                    <TrashIcon size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Site" : "Add Site"}
        footer={
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-p btn-sm" onClick={save}>
              Save
            </button>
          </>
        }
      >
        <div className="fg">
          <label>
            Site Name<span className="req">*</span>
          </label>
          <input className="fi" value={name} onChange={(e) => setName(e.target.value)} />
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
        <p>Delete site "{delTarget?.name}"?</p>
      </Modal>
    </>
  );
}
