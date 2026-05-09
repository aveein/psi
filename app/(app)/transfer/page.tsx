"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { Employee, Site } from "../../lib/types";
import { useToast } from "../../components/Toast";
import { PageTop } from "../../components/PageTop";
import { SendIcon, TransferIcon } from "../../components/Icons";

export default function TransferPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [empId, setEmpId] = useState("");
  const [toSite, setToSite] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    api.get<{ data: Employee[] }>("/api/employees").then((r) => setEmployees(r.data || []));
    api.get<{ data: Site[] }>("/api/sites").then((r) => setSites(r.data || []));
  }, []);

  const fromSite = useMemo(() => {
    const e = employees.find((x) => x.id === +empId);
    if (!e) return "";
    const last = (e.records || []).filter((r) => r.approved).pop();
    return last?.site || "No previous site";
  }, [empId, employees]);

  async function submit() {
    if (!empId) {
      toast("Select an employee", "error");
      return;
    }
    if (!toSite) {
      toast("Select destination site", "error");
      return;
    }
    try {
      await api.post("/api/transfers", {
        empId: +empId,
        fromSite,
        toSite,
        notes,
      });
      toast("Transfer request submitted", "success");
      router.push("/dashboard");
    } catch (e: any) {
      toast(e.message || "Failed", "error");
    }
  }

  return (
    <>
      <PageTop title="Transfer Request" sub="Submit a site transfer — requires admin approval" />
      <div className="pg-body">
        <div className="card card-body" style={{ maxWidth: 580 }}>
          <div className="banner banner-ok">
            <TransferIcon />
            <span>
              <strong>Transfer Workflow:</strong> Submit → Admin reviews → On approval, new record created
              at destination.
            </span>
          </div>
          <div className="fgrid">
            <div className="fg s2">
              <label>
                Employee<span className="req">*</span>
              </label>
              <select className="fi" value={empId} onChange={(e) => setEmpId(e.target.value)}>
                <option value="">Select employee…</option>
                {employees
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((e) => {
                    const last = (e.records || []).filter((r) => r.approved).pop();
                    return (
                      <option key={e.id} value={e.id}>
                        {e.name} — {e.zairo} [{last?.site || "No site"}]
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="fg">
              <label>From Site (auto-filled)</label>
              <input className="fi" readOnly value={fromSite} style={{ background: "var(--s2)", color: "var(--t3)" }} />
            </div>
            <div className="fg">
              <label>
                To Site<span className="req">*</span>
              </label>
              <select className="fi" value={toSite} onChange={(e) => setToSite(e.target.value)}>
                <option value="">Select destination…</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="fg s2">
              <label>Notes / Reason</label>
              <textarea
                className="fi"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 20,
              paddingTop: 18,
              borderTop: "1px solid var(--bd)",
            }}
          >
            <button className="btn btn-ghost" onClick={() => router.push("/dashboard")}>
              Cancel
            </button>
            <div style={{ marginLeft: "auto" }}>
              <button className="btn btn-p" onClick={submit}>
                <SendIcon /> Submit Transfer Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
