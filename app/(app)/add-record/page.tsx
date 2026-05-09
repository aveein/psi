"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "../../lib/api";
import { CustomField, Employee, JP_VISAS, NATIONS, Site } from "../../lib/types";
import { useToast } from "../../components/Toast";
import { PageTop } from "../../components/PageTop";
import { PlusIcon, SendIcon, TrashIcon, UploadIcon, XIcon } from "../../components/Icons";

type HRow = {
  uid: number;
  site: string;
  status: string;
  joining: string;
  leaving: string;
  reason: string;
  toSite: string;
};

let rowCounter = 0;

export default function AddRecordPage() {
  const router = useRouter();
  const search = useSearchParams();
  const editId = search.get("id");
  const { toast } = useToast();

  const [zairo, setZairo] = useState("");
  const [name, setName] = useState("");
  const [kana, setKana] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [visa, setVisa] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPrev, setPhotoPrev] = useState<string | null>(null);
  const [custom, setCustom] = useState<Record<string, string>>({});
  const [rows, setRows] = useState<HRow[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [fields, setFields] = useState<CustomField[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get<{ data: Site[] }>("/api/sites").then((r) => setSites(r.data || []));
    api.get<{ data: CustomField[] }>("/api/fields").then((r) => setFields(r.data || []));
  }, []);

  useEffect(() => {
    if (!editId) return;
    api.get<{ data: Employee }>(`/api/employees/${editId}`).then(({ data }) => {
      setZairo(data.zairo);
      setName(data.name);
      setKana(data.kana || "");
      setDob(data.dob || "");
      setGender(data.gender || "");
      setNationality(data.nationality || "");
      setVisa(data.visa || "");
      setCustom((data.custom as any) || {});
      const approved = (data.records || []).filter((r) => r.approved);
      setRows(
        approved.map((r) => ({
          uid: ++rowCounter,
          site: r.site || "",
          status: r.status,
          joining: r.joining || "",
          leaving: r.leaving || "",
          reason: r.reason || "",
          toSite: "",
        }))
      );
    });
  }, [editId]);

  function addRow() {
    setRows((p) => [...p, { uid: ++rowCounter, site: "", status: "", joining: "", leaving: "", reason: "", toSite: "" }]);
  }
  function updateRow(uid: number, patch: Partial<HRow>) {
    setRows((p) => p.map((r) => (r.uid === uid ? { ...r, ...patch } : r)));
  }
  function removeRow(uid: number) {
    setRows((p) => p.filter((r) => r.uid !== uid));
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast("Select an image file", "error");
      return;
    }
    setPhotoFile(f);
    const r = new FileReader();
    r.onload = (ev) => setPhotoPrev(ev.target?.result as string);
    r.readAsDataURL(f);
  }

  async function submit() {
    if (!zairo.trim() || !name.trim()) {
      toast("Zairo Card and Name required", "error");
      return;
    }
    if (!nationality) {
      toast("Nationality required", "error");
      return;
    }
    if (!visa) {
      toast("Visa Type required", "error");
      return;
    }
    const validRows = rows.filter((r) => r.site && r.status && r.joining);
    if (!validRows.length) {
      toast("Add at least one site entry", "error");
      return;
    }
    for (const r of validRows) {
      if (r.status === "transfer" && !r.toSite) {
        toast(`Select destination for transfer from "${r.site}"`, "error");
        return;
      }
      if (r.leaving && r.joining > r.leaving) {
        toast(`Leaving before joining for "${r.site}"`, "error");
        return;
      }
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("zairo", zairo);
      fd.append("name", name);
      fd.append("kana", kana);
      fd.append("dob", dob);
      fd.append("gender", gender);
      fd.append("nationality", nationality);
      fd.append("visa", visa);
      fd.append("custom", JSON.stringify(custom));
      fd.append("records", JSON.stringify(validRows));
      if (photoFile) fd.append("photo", photoFile);

      if (editId) {
        await api.put(`/api/employees/${editId}`, fd);
        toast("Record updated", "success");
      } else {
        await api.post("/api/employees", fd);
        toast("Record submitted for approval", "success");
      }
      router.push("/dashboard");
    } catch (e: any) {
      toast(e.message || "Failed to save", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageTop
        title={editId ? "Edit Record" : "Add New Record"}
        sub="Submit for admin approval · 管理者の承認が必要です"
      />
      <div className="pg-body">
        <div className="card card-body">
          <div className="fgrid">
            <div className="fsec">Identity | 基本情報</div>
            <div className="fg">
              <label>
                Zairo Card No.<span className="req">*</span>
              </label>
              <input className="fi" value={zairo} onChange={(e) => setZairo(e.target.value)} maxLength={20} />
            </div>
            <div className="fg">
              <label>
                Full Name | 氏名<span className="req">*</span>
              </label>
              <input className="fi" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
            </div>
            <div className="fg">
              <label>Katakana Name</label>
              <input className="fi" value={kana} onChange={(e) => setKana(e.target.value)} maxLength={80} />
            </div>
            <div className="fg">
              <label>Date of Birth</label>
              <input type="date" className="fi" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
            <div className="fg">
              <label>Gender</label>
              <select className="fi" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select…</option>
                <option>Male | 男性</option>
                <option>Female | 女性</option>
                <option>Other | その他</option>
              </select>
            </div>
            <div className="fg">
              <label>
                Nationality<span className="req">*</span>
              </label>
              <select className="fi" value={nationality} onChange={(e) => setNationality(e.target.value)}>
                <option value="">Select…</option>
                {NATIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="fg s2">
              <label>
                Visa Type (Japan)<span className="req">*</span>
              </label>
              <select className="fi" value={visa} onChange={(e) => setVisa(e.target.value)}>
                <option value="">Select…</option>
                {JP_VISAS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            {fields.filter((f) => f.enabled).length > 0 && (
              <>
                <div className="fsec">Additional Fields</div>
                {fields
                  .filter((f) => f.enabled)
                  .map((f) => {
                    const val = custom[f.label] || "";
                    const set = (v: string) => setCustom((p) => ({ ...p, [f.label]: v }));
                    if (f.type === "select") {
                      return (
                        <div key={f.id} className="fg">
                          <label>
                            {f.label}
                            {f.required && <span className="req">*</span>}
                          </label>
                          <select className="fi" value={val} onChange={(e) => set(e.target.value)}>
                            <option value=""></option>
                            {(f.options || "").split(",").map((o) => (
                              <option key={o} value={o.trim()}>
                                {o.trim()}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    }
                    if (f.type === "textarea") {
                      return (
                        <div key={f.id} className="fg s2">
                          <label>{f.label}</label>
                          <textarea
                            className="fi"
                            value={val}
                            onChange={(e) => set(e.target.value)}
                            rows={3}
                          />
                        </div>
                      );
                    }
                    return (
                      <div key={f.id} className="fg">
                        <label>
                          {f.label}
                          {f.required && <span className="req">*</span>}
                        </label>
                        <input
                          type={f.type === "date" ? "date" : f.type === "number" ? "number" : "text"}
                          className="fi"
                          value={val}
                          onChange={(e) => set(e.target.value)}
                        />
                      </div>
                    );
                  })}
              </>
            )}

            <div className="fsec">Employment History | 雇用履歴</div>
            <div className="fg s2">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {rows.map((r, i) => (
                  <div
                    key={r.uid}
                    style={{
                      background: "var(--bg3)",
                      border: "1.5px solid var(--bd)",
                      borderRadius: "var(--r12)",
                      padding: 13,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--t3)",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        Site Entry #{i + 1}
                      </span>
                      <button className="ib del" type="button" onClick={() => removeRow(r.uid)}>
                        <XIcon size={12} />
                      </button>
                    </div>
                    <div className="fgrid">
                      <div className="fg">
                        <label>
                          Work Site<span className="req">*</span>
                        </label>
                        <select
                          className="fi"
                          value={r.site}
                          onChange={(e) => updateRow(r.uid, { site: e.target.value })}
                        >
                          <option value="">Select…</option>
                          {sites.map((s) => (
                            <option key={s.id} value={s.name}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="fg">
                        <label>
                          Status<span className="req">*</span>
                        </label>
                        <select
                          className="fi"
                          value={r.status}
                          onChange={(e) => updateRow(r.uid, { status: e.target.value })}
                        >
                          <option value="">Select…</option>
                          <option value="resigned">Resigned | 退職</option>
                          <option value="fired">Fired | 解雇</option>
                          <option value="blacklisted">Blacklisted | 入社拒否</option>
                          <option value="transfer">Transfer | 異動 (admin approval)</option>
                        </select>
                      </div>
                      <div className="fg">
                        <label>
                          Joining<span className="req">*</span>
                        </label>
                        <input
                          type="date"
                          className="fi"
                          value={r.joining}
                          onChange={(e) => updateRow(r.uid, { joining: e.target.value })}
                        />
                      </div>
                      <div className="fg">
                        <label>Leaving</label>
                        <input
                          type="date"
                          className="fi"
                          value={r.leaving}
                          onChange={(e) => updateRow(r.uid, { leaving: e.target.value })}
                        />
                      </div>
                      {r.status === "transfer" && (
                        <div
                          className="fg s2"
                          style={{
                            background: "var(--green-lt)",
                            border: "1px solid rgba(40,205,65,.3)",
                            borderRadius: "var(--r8)",
                            padding: 9,
                          }}
                        >
                          <label>
                            Transfer To<span className="req">*</span>
                          </label>
                          <select
                            className="fi"
                            value={r.toSite}
                            onChange={(e) => updateRow(r.uid, { toSite: e.target.value })}
                          >
                            <option value="">Select destination…</option>
                            {sites.map((s) => (
                              <option key={s.id} value={s.name}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div className="fg s2">
                        <label>Comment / Notes</label>
                        <textarea
                          className="fi"
                          value={r.reason}
                          onChange={(e) => updateRow(r.uid, { reason: e.target.value })}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-s btn-sm"
                  style={{ width: "fit-content" }}
                  onClick={addRow}
                >
                  <PlusIcon /> Add Site Entry
                </button>
              </div>
            </div>

            <div className="fsec">Employee Photo | 写真</div>
            <div className="fg s2">
              <label
                style={{
                  border: "2px dashed var(--bd2)",
                  borderRadius: "var(--r12)",
                  padding: 20,
                  textAlign: "center",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  background: "var(--bg3)",
                  display: "block",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhoto}
                  style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                />
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "var(--r8)",
                    background: "var(--s3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 7px",
                  }}
                >
                  <UploadIcon size={15} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>Click or drag to upload</div>
                <div style={{ fontSize: 11, color: "var(--t4)", marginTop: 2 }}>PNG, JPG</div>
                {photoPrev && (
                  <img
                    src={photoPrev}
                    alt=""
                    style={{
                      maxWidth: 80,
                      maxHeight: 80,
                      borderRadius: "var(--r8)",
                      margin: "8px auto 0",
                      border: "1px solid var(--bd)",
                      objectFit: "cover",
                    }}
                  />
                )}
              </label>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 20,
              paddingTop: 18,
              borderTop: "1px solid var(--bd)",
              flexWrap: "wrap",
            }}
          >
            <button className="btn btn-ghost" onClick={() => router.push("/dashboard")}>
              Cancel
            </button>
            <div style={{ marginLeft: "auto", display: "flex", gap: 7 }}>
              <button className="btn btn-p" onClick={submit} disabled={submitting}>
                <SendIcon /> {submitting ? "Submitting…" : editId ? "Save Changes" : "Submit for Approval"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
