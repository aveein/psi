"use client";

import { useState } from "react";
import { api } from "../../lib/api";
import { Employee } from "../../lib/types";
import { PageTop } from "../../components/PageTop";
import { Empty } from "../../components/Empty";
import { SearchIcon } from "../../components/Icons";
import { EmployeeDetail } from "../../components/EmployeeDetail";
import { initials, photoUrl } from "../../lib/utils";
import { StatusBadge } from "../../components/StatusBadge";

export default function SearchPage() {
  const [type, setType] = useState<"name" | "zairo">("name");
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Employee[] | null>(null);
  const [detail, setDetail] = useState<Employee | null>(null);

  async function doSearch() {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    const r = await api.get<{ data: Employee[] }>(
      `/api/employees?search=${encodeURIComponent(q)}`
    );
    const filtered = (r.data || []).filter((e) =>
      type === "name"
        ? e.name.toLowerCase().includes(q.toLowerCase())
        : e.zairo.toLowerCase().includes(q.toLowerCase())
    );
    setResults(filtered);
  }

  return (
    <>
      <PageTop title="Search Records" sub="Results open in a detailed popup — click any result" />
      <div className="pg-body">
        <div className="card card-body" style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                background: "var(--s2)",
                borderRadius: "var(--rfull)",
                padding: 3,
                gap: 2,
              }}
            >
              {(["name", "zairo"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setType(t);
                    setQ("");
                    setResults(null);
                  }}
                  style={{
                    padding: "6px 13px",
                    borderRadius: "var(--rfull)",
                    fontSize: 12,
                    fontWeight: 600,
                    background: type === t ? "#fff" : "transparent",
                    color: type === t ? "var(--blue)" : "var(--t3)",
                    boxShadow: type === t ? "var(--sh0)" : "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {t === "name" ? "By Name" : "By Zairo Card"}
                </button>
              ))}
            </div>
            <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
              <SearchIcon
                size={14}
                style={{
                  position: "absolute",
                  left: 11,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--t4)",
                  pointerEvents: "none",
                }}
              />
              <input
                className="fi"
                style={{ paddingLeft: 34, fontSize: 14 }}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
                placeholder={type === "name" ? "Enter name…" : "Enter Zairo Card No…"}
              />
            </div>
            <button className="btn btn-p" onClick={doSearch}>
              <SearchIcon /> Search
            </button>
          </div>
        </div>

        {results !== null && (
          <div className="card">
            {results.length === 0 ? (
              <Empty title="No results found" sub="Try a different term" />
            ) : (
              <>
                <div
                  style={{
                    padding: "9px 18px",
                    borderBottom: "1px solid var(--bd)",
                    fontSize: 13,
                    color: "var(--t3)",
                  }}
                >
                  <strong style={{ color: "var(--t1)" }}>{results.length}</strong> result
                  {results.length !== 1 ? "s" : ""} — click to view full details
                </div>
                {results.map((e) => {
                  const last = e.records?.filter((r) => r.approved).pop();
                  return (
                    <div key={e.id} className="lrow" onClick={() => setDetail(e)}>
                      {e.photo ? (
                        <img className="tbl-av" src={photoUrl(e.photo) || ""} alt={e.name} />
                      ) : (
                        <div className="tbl-avp">{initials(e.name)}</div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{e.name}</div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--t3)",
                            fontFamily: "var(--mono)",
                            marginTop: 1,
                          }}
                        >
                          {e.zairo}
                        </div>
                      </div>
                      {last && (
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 11, color: "var(--t3)" }}>{last.site || "—"}</div>
                          <div style={{ marginTop: 3 }}>
                            <StatusBadge status={last.status} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>

      <EmployeeDetail employee={detail} open={!!detail} onClose={() => setDetail(null)} />
    </>
  );
}
