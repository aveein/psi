"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { EmploymentRecord, Employee, TransferRequest } from "../../lib/types";
import { useToast } from "../../components/Toast";
import { PageTop } from "../../components/PageTop";
import { Empty } from "../../components/Empty";
import { ArrowRightIcon, CheckIcon, TransferIcon, XIcon } from "../../components/Icons";
import { StatusBadge } from "../../components/StatusBadge";
import { initials, fmtDate, fmtDateTime } from "../../lib/utils";

type RecWithEmp = EmploymentRecord & { employee?: Employee };

export default function ApprovalsPage() {
  const { toast } = useToast();
  const [records, setRecords] = useState<RecWithEmp[]>([]);
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);

  async function load() {
    const r = await api.get<{ data: RecWithEmp[] }>("/api/records/pending");
    setRecords(r.data || []);
    const t = await api.get<{ data: TransferRequest[] }>("/api/transfers");
    setTransfers((t.data || []).filter((x) => x.status === "pending"));
  }

  useEffect(() => {
    load();
  }, []);

  async function approveRec(id: number) {
    try {
      await api.post(`/api/records/${id}/approve`);
      toast("Record approved", "success");
      load();
    } catch (e: any) {
      toast(e.message, "error");
    }
  }
  async function rejectRec(id: number) {
    try {
      await api.post(`/api/records/${id}/reject`);
      toast("Record rejected", "info");
      load();
    } catch (e: any) {
      toast(e.message, "error");
    }
  }
  async function approveTr(id: number) {
    try {
      await api.post(`/api/transfers/${id}/approve`);
      toast("Transfer approved", "success");
      load();
    } catch (e: any) {
      toast(e.message, "error");
    }
  }
  async function rejectTr(id: number) {
    try {
      await api.post(`/api/transfers/${id}/reject`);
      toast("Transfer rejected", "info");
      load();
    } catch (e: any) {
      toast(e.message, "error");
    }
  }
  async function approveAll() {
    try {
      await api.post("/api/records/approve-all");
      toast("All records approved", "success");
      load();
    } catch (e: any) {
      toast(e.message, "error");
    }
  }

  const groups = { resigned: [] as RecWithEmp[], fired: [] as RecWithEmp[], blacklisted: [] as RecWithEmp[] };
  records.forEach((r) => {
    if (groups[r.status as keyof typeof groups]) groups[r.status as keyof typeof groups].push(r);
  });
  const total = records.length + transfers.length;
  const dotColors: Record<string, string> = {
    resigned: "#8e8e93",
    fired: "var(--red)",
    blacklisted: "#636366",
  };
  const labels: Record<string, string> = {
    resigned: "Resigned",
    fired: "Fired",
    blacklisted: "Blacklisted",
  };

  return (
    <>
      <PageTop
        title="Approvals"
        sub={`${total} item${total !== 1 ? "s" : ""} pending review`}
        actions={
          total > 0 && (
            <button className="btn btn-g btn-sm" onClick={approveAll}>
              <CheckIcon /> Approve All Records
            </button>
          )
        }
      />
      <div className="pg-body">
        {total === 0 ? (
          <Empty title="All up to date" sub="No pending approvals" />
        ) : (
          <>
            {transfers.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "9px 0 7px",
                  }}
                >
                  <div style={{ width: 4, height: 16, borderRadius: 2, background: "var(--green)" }} />
                  <span style={{ fontSize: 13, fontWeight: 700 }}>
                    Transfer Requests ({transfers.length})
                  </span>
                </div>
                <div className="card">
                  {transfers.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: "13px 18px",
                        borderBottom: "1px solid var(--bd)",
                      }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "var(--r8)",
                          background: "var(--green-lt)",
                          color: "var(--green)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <TransferIcon size={15} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>
                          {t.employee?.name || "Unknown"}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            marginTop: 3,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            flexWrap: "wrap",
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{t.fromSite || "—"}</span>
                          <ArrowRightIcon size={11} />
                          <span style={{ fontWeight: 600, color: "var(--blue)" }}>{t.toSite || "—"}</span>
                        </div>
                        {t.notes && (
                          <div
                            style={{
                              marginTop: 5,
                              padding: "6px 9px",
                              background: "var(--green-lt)",
                              borderRadius: "var(--r6)",
                              fontSize: 12,
                              color: "#1a7a32",
                            }}
                          >
                            {t.notes}
                          </div>
                        )}
                        <div style={{ fontSize: 11, color: "var(--t4)", marginTop: 3 }}>
                          By {t.requestedBy} · {fmtDateTime(t.requestedAt)}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 5,
                          flexShrink: 0,
                          alignItems: "flex-end",
                        }}
                      >
                        <span className="badge b-transfer">Transfer</span>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button className="btn btn-g btn-xs" onClick={() => approveTr(t.id)}>
                            <CheckIcon size={11} /> Approve
                          </button>
                          <button className="btn btn-d btn-xs" onClick={() => rejectTr(t.id)}>
                            <XIcon size={11} /> Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(["resigned", "fired", "blacklisted"] as const).map((st) => {
              const g = groups[st];
              if (!g.length) return null;
              return (
                <div key={st} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 0 7px" }}>
                    <div style={{ width: 4, height: 16, borderRadius: 2, background: dotColors[st] }} />
                    <span style={{ fontSize: 13, fontWeight: 700 }}>
                      {labels[st]} Records ({g.length})
                    </span>
                  </div>
                  <div className="card">
                    {g.map((r) => (
                      <div
                        key={r.id}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                          padding: "13px 18px",
                          borderBottom: "1px solid var(--bd)",
                        }}
                      >
                        <div className="tbl-avp" style={{ flexShrink: 0 }}>
                          {initials(r.employee?.name)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>
                            {r.employee?.name || "Unknown"}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--t3)",
                              marginTop: 2,
                              display: "flex",
                              gap: 10,
                              flexWrap: "wrap",
                            }}
                          >
                            <span style={{ fontFamily: "var(--mono)" }}>{r.employee?.zairo}</span>
                            <span>{r.site || "—"}</span>
                            <span>
                              {fmtDate(r.joining)}
                              {r.leaving ? ` → ${fmtDate(r.leaving)}` : ""}
                            </span>
                            <span>By: {r.requestedBy || "—"}</span>
                          </div>
                          {r.reason && (
                            <div
                              style={{
                                marginTop: 6,
                                padding: "6px 9px",
                                background: "var(--bg2)",
                                borderRadius: "var(--r6)",
                                fontSize: 12,
                                color: "var(--t2)",
                                borderLeft: `3px solid ${dotColors[st]}`,
                              }}
                            >
                              {r.reason.slice(0, 100)}
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 5,
                            flexShrink: 0,
                            alignItems: "flex-end",
                          }}
                        >
                          <StatusBadge status={r.status} />
                          <div style={{ display: "flex", gap: 5 }}>
                            <button className="btn btn-g btn-xs" onClick={() => approveRec(r.id)}>
                              <CheckIcon size={11} /> Approve
                            </button>
                            <button className="btn btn-d btn-xs" onClick={() => rejectRec(r.id)}>
                              <XIcon size={11} /> Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}
