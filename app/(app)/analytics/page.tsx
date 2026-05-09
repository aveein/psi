"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "../../lib/api";
import { Employee } from "../../lib/types";
import { PageTop } from "../../components/PageTop";
import { Empty } from "../../components/Empty";
import { BarChart, LineChart } from "../../components/Charts";
import { DownloadIcon } from "../../components/Icons";

export default function AnalyticsPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get<{ data: Employee[] }>("/api/employees").then((r) => setEmployees(r.data || []));
    api.get<{ data: any }>("/api/stats").then((r) => setStats(r.data));
  }, []);

  const allRecords = useMemo(() => employees.flatMap((e) => (e.records || []).filter((r) => r.approved)), [employees]);

  const reasons = useMemo(() => {
    const map: Record<string, Record<string, number>> = { resigned: {}, fired: {}, blacklisted: {} };
    allRecords.forEach((r) => {
      if (!r.reason || !map[r.status]) return;
      const k = r.reason.trim().slice(0, 60);
      map[r.status][k] = (map[r.status][k] || 0) + 1;
    });
    return map;
  }, [allRecords]);

  const sites = useMemo(() => {
    const data: Record<string, { resigned: number; fired: number; blacklisted: number; transfer: number; total: number }> = {};
    allRecords.forEach((r) => {
      if (!r.site) return;
      if (!data[r.site]) data[r.site] = { resigned: 0, fired: 0, blacklisted: 0, transfer: 0, total: 0 };
      (data[r.site] as any)[r.status] = ((data[r.site] as any)[r.status] || 0) + 1;
      data[r.site].total++;
    });
    return Object.entries(data).sort((a, b) => b[1].total - a[1].total);
  }, [allRecords]);

  const months = useMemo(() => {
    const arr: { l: string; v: number }[] = [];
    const nd = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(nd.getFullYear(), nd.getMonth() - i, 1);
      const monthLabel = d.toLocaleString("en-US", { month: "short" });
      let count = 0;
      allRecords.forEach((r) => {
        if (!r.createdAt) return;
        const dt = new Date(r.createdAt);
        if (dt.getFullYear() === d.getFullYear() && dt.getMonth() === d.getMonth()) count++;
      });
      arr.push({ l: monthLabel, v: count });
    }
    return arr;
  }, [allRecords]);

  const total = stats?.total || 0;
  const maxSite = sites[0]?.[1].total || 1;

  const renderReasons = (st: string) => {
    const entries = Object.entries(reasons[st] || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    if (!entries.length) return <Empty title="No data" />;
    return (
      <div>
        {entries.map(([r, c]) => (
          <div
            key={r}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid var(--bd)",
              gap: 10,
              fontSize: 13,
            }}
          >
            <span
              style={{
                flex: 1,
                color: "var(--t1)",
                lineHeight: 1.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={r}
            >
              {r.slice(0, 50)}
            </span>
            <span style={{ fontSize: 16, fontWeight: 800, color: "var(--blue)" }}>{c}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <PageTop
        title="Analytics"
        sub="Comprehensive data insights and exit reason analysis"
        actions={
          <button className="btn btn-p btn-sm">
            <DownloadIcon /> Export All
          </button>
        }
      />
      <div className="pg-body">
        <div className="an-kpi">
          <div className="an-kpi-card">
            <div className="an-kpi-val" style={{ color: "var(--blue)" }}>
              {total}
            </div>
            <div className="an-kpi-lbl">Total Employees</div>
          </div>
          <div className="an-kpi-card">
            <div className="an-kpi-val">{stats?.resigned || 0}</div>
            <div className="an-kpi-lbl">Resigned</div>
          </div>
          <div className="an-kpi-card">
            <div className="an-kpi-val" style={{ color: "var(--red)" }}>
              {stats?.fired || 0}
            </div>
            <div className="an-kpi-lbl">Fired</div>
          </div>
          <div className="an-kpi-card">
            <div className="an-kpi-val" style={{ color: "#636366" }}>
              {stats?.blacklisted || 0}
            </div>
            <div className="an-kpi-lbl">Blacklisted</div>
          </div>
          <div className="an-kpi-card">
            <div className="an-kpi-val" style={{ color: "var(--green)" }}>
              {stats?.transfer || 0}
            </div>
            <div className="an-kpi-lbl">Transferred</div>
          </div>
          <div className="an-kpi-card">
            <div className="an-kpi-val" style={{ color: "var(--orange)" }}>
              {stats?.pendingTransfers || 0}
            </div>
            <div className="an-kpi-lbl">Pending Transfers</div>
          </div>
          <div className="an-kpi-card">
            <div className="an-kpi-val">
              {total > 0 ? Math.round(((stats?.fired || 0) / total) * 100) : 0}%
            </div>
            <div className="an-kpi-lbl">Termination Rate</div>
          </div>
          <div className="an-kpi-card">
            <div className="an-kpi-val">
              {total > 0 ? Math.round(((stats?.resigned || 0) / total) * 100) : 0}%
            </div>
            <div className="an-kpi-lbl">Resignation Rate</div>
          </div>
        </div>

        <div className="charts-row">
          <div className="chart-card">
            <div className="chart-t">Top Exit Reasons</div>
            <BarChart
              data={Object.entries(
                allRecords
                  .filter((r) => r.reason)
                  .reduce((m: Record<string, number>, r) => {
                    const k = (r.reason || "").trim().slice(0, 45);
                    m[k] = (m[k] || 0) + 1;
                    return m;
                  }, {})
              )
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([l, v]) => ({ label: l, value: v as number }))}
            />
          </div>
          <div className="chart-card">
            <div className="chart-t">Records by Site</div>
            <BarChart
              data={sites.slice(0, 5).map(([s, v]) => ({ label: s.slice(0, 16), value: v.total }))}
            />
          </div>
        </div>

        <div className="charts-row">
          <div className="chart-card" style={{ gridColumn: "1/-1" }}>
            <div className="chart-t">Monthly Activity (12 months)</div>
            <LineChart data={months.map((m) => ({ label: m.l, value: m.v }))} height={140} />
          </div>
        </div>

        <div className="card">
          <div className="card-hdr">
            <div className="card-hdr-t">Site-wise Breakdown</div>
            <div className="card-hdr-s">Approved records · all sites</div>
          </div>
          {sites.length === 0 ? (
            <Empty title="No data" sub="Records appear here after approval" />
          ) : (
            <div className="tbl-wrap">
              <table className="dtbl">
                <thead>
                  <tr>
                    <th>Site</th>
                    <th style={{ textAlign: "center" }}>Resigned</th>
                    <th style={{ textAlign: "center" }}>Fired</th>
                    <th style={{ textAlign: "center" }}>Blacklisted</th>
                    <th style={{ textAlign: "center" }}>Transfer</th>
                    <th style={{ textAlign: "center" }}>Total</th>
                    <th>Distribution</th>
                  </tr>
                </thead>
                <tbody>
                  {sites.map(([s, v]) => (
                    <tr key={s}>
                      <td style={{ fontWeight: 600, fontSize: 13, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {s}
                      </td>
                      <td style={{ textAlign: "center" }}>{v.resigned}</td>
                      <td style={{ textAlign: "center", color: "var(--red)", fontWeight: 600 }}>{v.fired}</td>
                      <td style={{ textAlign: "center" }}>{v.blacklisted}</td>
                      <td style={{ textAlign: "center", color: "var(--green)", fontWeight: 600 }}>{v.transfer}</td>
                      <td style={{ textAlign: "center", fontSize: 15, fontWeight: 800, color: "var(--blue)" }}>
                        {v.total}
                      </td>
                      <td style={{ width: 90 }}>
                        <div className="site-bar">
                          <div className="site-bar-fill" style={{ width: `${Math.round((v.total / maxSite) * 100)}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
          <div className="card card-body">
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--t3)", marginBottom: 10 }}>
              Top Resignation Reasons
            </div>
            {renderReasons("resigned")}
          </div>
          <div className="card card-body">
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", marginBottom: 10 }}>
              Top Termination Reasons
            </div>
            {renderReasons("fired")}
          </div>
          <div className="card card-body">
            <div style={{ fontSize: 13, fontWeight: 700, color: "#636366", marginBottom: 10 }}>
              Top Blacklist Reasons
            </div>
            {renderReasons("blacklisted")}
          </div>
        </div>
      </div>
    </>
  );
}
