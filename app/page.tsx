"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, API_BASE } from "./lib/api";
import { Employee } from "./lib/types";
import { initials, photoUrl } from "./lib/utils";
import { LockIcon, SearchIcon } from "./components/Icons";
import { StatusBadge } from "./components/StatusBadge";

export default function PublicPage() {
  const [tab, setTab] = useState<"name" | "zairo">("name");
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Employee[] | null>(null);
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get<{ data: any }>("/api/public/stats").then((r) => setStats(r.data)).catch(() => {});
  }, []);

  async function doSearch() {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const r = await api.get<{ data: Employee[] }>(
        `/api/public/search?q=${encodeURIComponent(q)}&type=${tab}`
      );
      setResults(r.data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(180deg,#f0f4ff 0%,#fafbff 60%,#fff 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 28px",
          background: "rgba(255,255,255,.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,.06)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              background: "var(--blue)",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "var(--r6)",
              letterSpacing: ".5px",
            }}
          >
            PIONEER
          </span>
          <span style={{ fontSize: 13, color: "var(--t3)", fontWeight: 500 }}>
            ㈱パイオニア・サービス
          </span>
        </div>
        <Link
          href="/login"
          className="btn-staff"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "var(--blue)",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "var(--rfull)",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <LockIcon size={13} />
          <span>Staff Login</span>
        </Link>
      </nav>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "52px 24px 40px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "var(--blue-lt)",
            border: "1px solid rgba(0,113,227,.18)",
            color: "var(--blue)",
            fontSize: 12,
            fontWeight: 600,
            padding: "5px 14px",
            borderRadius: "var(--rfull)",
            marginBottom: 22,
            letterSpacing: ".3px",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--blue)",
              animation: "bdpulse 2s ease infinite",
            }}
          />
          Employee Records System · パイオニア・サービス
        </div>
        <h1
          style={{
            fontSize: "clamp(32px,6vw,62px)",
            fontWeight: 900,
            color: "var(--t1)",
            letterSpacing: "-1.2px",
            lineHeight: 1.08,
            marginBottom: 14,
          }}
        >
          Search Employee
          <br />
          <em style={{ fontStyle: "normal", color: "var(--blue)" }}>Exit Records</em>
        </h1>
        <p
          style={{
            fontSize: "clamp(15px,2vw,18px)",
            color: "var(--t3)",
            maxWidth: 480,
            marginBottom: 38,
            lineHeight: 1.65,
          }}
        >
          Search the Pioneer Service employee database by name or Zairo Card number — no login required
        </p>

        <div
          style={{
            width: "100%",
            maxWidth: 640,
            background: "#fff",
            borderRadius: "var(--r20)",
            border: "1px solid var(--bd)",
            boxShadow: "var(--sh2)",
            padding: "22px 24px",
          }}
        >
          <div
            style={{
              display: "flex",
              background: "var(--s2)",
              borderRadius: "var(--rfull)",
              padding: 3,
              gap: 2,
              marginBottom: 16,
              width: "fit-content",
            }}
          >
            {(["name", "zairo"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setQ("");
                  setResults(null);
                }}
                style={{
                  padding: "7px 18px",
                  borderRadius: "var(--rfull)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: tab === t ? "var(--blue)" : "var(--t3)",
                  background: tab === t ? "#fff" : "transparent",
                  boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,.1)" : "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {t === "name" ? "By Name | 名前" : "By Zairo Card | カード番号"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
              <SearchIcon
                size={16}
                style={{
                  position: "absolute",
                  left: 13,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--t4)",
                  pointerEvents: "none",
                }}
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
                placeholder={tab === "name" ? "Enter name… | 氏名を入力" : "Enter Zairo Card No…"}
                style={{
                  width: "100%",
                  border: "1.5px solid var(--bd)",
                  borderRadius: "var(--r12)",
                  padding: "12px 14px 12px 42px",
                  fontSize: 15,
                  background: "var(--bg3)",
                  outline: "none",
                }}
              />
            </div>
            <button
              onClick={doSearch}
              style={{
                background: "var(--blue)",
                color: "#fff",
                border: "none",
                padding: "12px 24px",
                borderRadius: "var(--r12)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <SearchIcon size={14} />
              <span>Search</span>
            </button>
          </div>
        </div>

        {results !== null && (
          <div style={{ width: "100%", maxWidth: 640, marginTop: 18 }}>
            {results.length === 0 ? (
              <div
                style={{
                  background: "#fff",
                  border: "1px solid var(--bd)",
                  borderRadius: "var(--r16)",
                  padding: 24,
                  textAlign: "center",
                  color: "var(--t3)",
                  fontSize: 14,
                }}
              >
                {loading ? "Searching…" : "No results found"}
              </div>
            ) : (
              <div
                style={{
                  background: "#fff",
                  border: "1px solid var(--bd)",
                  borderRadius: "var(--r16)",
                  overflow: "hidden",
                  boxShadow: "var(--sh1)",
                }}
              >
                <div
                  style={{
                    padding: "10px 18px",
                    borderBottom: "1px solid var(--bd)",
                    fontSize: 13,
                    color: "var(--t3)",
                  }}
                >
                  <strong style={{ color: "var(--t1)" }}>{results.length}</strong> result
                  {results.length !== 1 ? "s" : ""}
                </div>
                {results.map((e) => {
                  const last = e.records?.[e.records.length - 1];
                  return (
                    <div
                      key={e.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 13,
                        padding: "13px 18px",
                        borderBottom: "1px solid var(--bd)",
                      }}
                    >
                      {e.photo ? (
                        <img
                          src={photoUrl(e.photo) || ""}
                          alt={e.name}
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: "var(--r10)",
                            objectFit: "cover",
                            border: "1px solid var(--bd)",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: "var(--r10)",
                            background: "var(--blue-lt)",
                            color: "var(--blue)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            fontWeight: 700,
                          }}
                        >
                          {initials(e.name)}
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{e.name}</div>
                        <div style={{ fontSize: 12, color: "var(--t3)", marginTop: 2 }}>
                          {e.zairo} · {e.nationality || "—"}
                        </div>
                      </div>
                      {last && <StatusBadge status={last.status} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {stats && (
        <div
          style={{
            display: "flex",
            borderTop: "1px solid rgba(0,0,0,.07)",
            background: "#fff",
          }}
        >
          {[
            { v: stats.total, l: "TOTAL EMPLOYEES" },
            { v: stats.resigned, l: "RESIGNED" },
            { v: stats.fired, l: "FIRED" },
            { v: stats.blacklisted, l: "BLACKLISTED" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "14px 8px",
                borderRight: i < 3 ? "1px solid rgba(0,0,0,.07)" : "none",
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--t1)", letterSpacing: -0.4 }}>
                {s.v ?? 0}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--t3)",
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  fontWeight: 600,
                  marginTop: 3,
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
