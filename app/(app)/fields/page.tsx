"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { CustomField, FIELD_TYPES } from "../../lib/types";
import { useToast } from "../../components/Toast";
import { PageTop } from "../../components/PageTop";
import { Empty } from "../../components/Empty";
import { Modal } from "../../components/Modal";
import { EditIcon, PlusIcon, TrashIcon } from "../../components/Icons";

const TYPE_ICONS: Record<string, string> = {
  text: "T",
  number: "#",
  date: "📅",
  email: "@",
  select: "▼",
  textarea: "¶",
  image: "🖼",
  file: "📎",
  phone: "☎",
};

export default function FieldsPage() {
  const { toast } = useToast();
  const [fields, setFields] = useState<CustomField[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CustomField | null>(null);
  const [label, setLabel] = useState("");
  const [type, setType] = useState<typeof FIELD_TYPES[number]>("text");
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState("");
  const [delTarget, setDelTarget] = useState<CustomField | null>(null);

  async function load() {
    const r = await api.get<{ data: CustomField[] }>("/api/fields");
    setFields(r.data || []);
  }
  useEffect(() => {
    load();
  }, []);

  function openForm(f: CustomField | null) {
    setEditing(f);
    setLabel(f?.label || "");
    setType(f?.type || "text");
    setRequired(f?.required || false);
    setOptions(f?.options || "");
    setOpen(true);
  }

  async function save() {
    if (!label.trim()) {
      toast("Field name required", "error");
      return;
    }
    try {
      const body = { label, type, required, options };
      if (editing) await api.put(`/api/fields/${editing.id}`, body);
      else await api.post("/api/fields", { ...body, enabled: true });
      toast("Field saved", "success");
      setOpen(false);
      load();
    } catch (e: any) {
      toast(e.message, "error");
    }
  }

  async function toggle(f: CustomField) {
    try {
      await api.put(`/api/fields/${f.id}`, { enabled: !f.enabled });
      load();
    } catch (e: any) {
      toast(e.message, "error");
    }
  }

  async function handleDelete() {
    if (!delTarget) return;
    try {
      await api.del(`/api/fields/${delTarget.id}`);
      toast("Field deleted", "info");
      setDelTarget(null);
      load();
    } catch (e: any) {
      toast(e.message, "error");
    }
  }

  return (
    <>
      <PageTop
        title="Field Configuration"
        sub="Customize Add Record form · supports 9 input types"
        actions={
          <button className="btn btn-p btn-sm" onClick={() => openForm(null)}>
            <PlusIcon /> Add Field
          </button>
        }
      />
      <div className="pg-body">
        <div className="card">
          {fields.length === 0 ? (
            <Empty title="No custom fields" sub="Add fields to extend the form" />
          ) : (
            fields.map((f) => (
              <div key={f.id} className="lrow">
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
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {TYPE_ICONS[f.type]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{f.label}</div>
                  <div style={{ fontSize: 11, color: "var(--t3)" }}>
                    {f.type}
                    {f.options ? ` · ${f.options.slice(0, 40)}` : ""}
                  </div>
                </div>
                {f.required ? (
                  <span className="badge b-fired" style={{ fontSize: 10 }}>
                    required
                  </span>
                ) : (
                  <span className="badge b-resigned" style={{ fontSize: 10 }}>
                    optional
                  </span>
                )}
                <button className={`toggle ${f.enabled ? "on" : ""}`} onClick={() => toggle(f)} />
                <div style={{ display: "flex", gap: 5 }}>
                  <button className="ib edit" onClick={() => openForm(f)}>
                    <EditIcon size={12} />
                  </button>
                  <button className="ib del" onClick={() => setDelTarget(f)}>
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
        title={editing ? "Edit Field" : "Add Custom Field"}
        footer={
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-p btn-sm" onClick={save}>
              Save Field
            </button>
          </>
        }
      >
        <div className="fgrid">
          <div className="fg s2">
            <label>
              Field Label<span className="req">*</span>
            </label>
            <input
              className="fi"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Department"
            />
          </div>
          <div className="fg">
            <label>Input Type</label>
            <select className="fi" value={type} onChange={(e) => setType(e.target.value as any)}>
              {FIELD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="fg">
            <label>Required</label>
            <select
              className="fi"
              value={required ? "1" : "0"}
              onChange={(e) => setRequired(e.target.value === "1")}
            >
              <option value="0">Optional</option>
              <option value="1">Required</option>
            </select>
          </div>
          {type === "select" && (
            <div className="fg s2">
              <label>Dropdown Options (comma-separated)</label>
              <input
                className="fi"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
                placeholder="Option A, Option B, Option C"
              />
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
        <p>Delete field "{delTarget?.label}"?</p>
      </Modal>
    </>
  );
}
