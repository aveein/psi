"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { AuditLog } from "../../lib/types";
import { useToast } from "../../components/Toast";
import { PageTop } from "../../components/PageTop";
import { Empty } from "../../components/Empty";
import { TrashIcon } from "../../components/Icons";
import { fmtDateTime } from "../../lib/utils";

const DOT: Record<string, string> = {
  login: "var(--blue)",
  logout: "var(--t3)",
  create: "var(--green)",
  edit: "var(--blue)",
  delete: "var(--red)",
  approve: "var(--green)",
  reject: "var(--red)",
  "transfer-req": "var(--orange)",
  export: "var(--purple)",
};

export default function LogsPage() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<AuditLog[]>([]);

  async function load() {
    const r = await api.get<{ data: AuditLog[] }>("/api/logs");
    setLogs(r.data || []);
  }
  useEffect(() => {
    load();
  }, []);

  async function clear() {
    if (!confirm("Clear all logs?")) return;
    try {
      await api.del("/api/logs");
      toast("Logs cleared", "info");
      load();
    } catch (e: any) {
      toast(e.message, "error");
    }
  }

  return (
    <>
      <PageTop
        title="Audit Logs"
        sub={`${logs.length} events tracked`}
        actions={
          <button className="btn btn-s btn-sm" onClick={clear}>
            <TrashIcon /> Clear Logs
          </button>
        }
      />
      <div className="pg-body">
        <div className="card card-body">
          {logs.length === 0 ? (
            <Empty title="No logs yet" sub="Actions are tracked here" />
          ) : (
            logs.map((l) => (
              <div key={l.id} className="log-row">
                <div className="log-dot" style={{ background: DOT[l.action] || "var(--t3)" }} />
                <div style={{ flex: 1 }}>
                  <div className="log-txt">{l.detail}</div>
                  <div className="log-meta">
                    {fmtDateTime(l.createdAt)} · by {l.user}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
