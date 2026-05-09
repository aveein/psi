"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { Employee, TransferRequest } from "../../lib/types";
import { useAuth } from "../../contexts/AuthContext";
import { PageTop } from "../../components/PageTop";
import { BarChart, LineChart } from "../../components/Charts";
import { EmployeeCard } from "../../components/EmployeeCard";
import { EmployeeDetail } from "../../components/EmployeeDetail";
import { Empty } from "../../components/Empty";
import {
  AlertIcon,
  ArrowRightIcon,
  DownloadIcon,
  FireIcon,
  LogoutIcon,
  PlusIcon,
  ShieldIcon,
  TransferIcon,
  UsersIcon,
  MapPinIcon,
} from "../../components/Icons";
import { StatusBadge } from "../../components/StatusBadge";
import { fmtDate } from "../../lib/utils";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [detailEmp, setDetailEmp] = useState<Employee | null>(null);

  useEffect(() => {
    api.get<{ data: any }>("/api/stats").then((r) => setStats(r.data));
    api.get<{ data: Employee[] }>("/api/employees").then((r) => setEmployees(r.data));
    api.get<{ data: TransferRequest[] }>("/api/transfers").then((r) => setTransfers(r.data)).catch(() => {});
  }, []);

  if (!user) return null;
  const isAdmin = user.role === "admin";
  const recent = employees.slice(0, 6);

  // Site widget
  const siteCounts: Record<string, number> = {};
  employees.forEach((e) => {
    e.records?.forEach((r) => {
      if (r.approved && r.site) siteCounts[r.site] = (siteCounts[r.site] || 0) + 1;
    });
  });
  const sortedSites = Object.entries(siteCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxSite = sortedSites[0]?.[1] || 1;

  // Monthly chart
  const months = (() => {
    const arr: { l: string; v: number }[] = [];
    const nd = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(nd.getFullYear(), nd.getMonth() - i, 1);
      const monthLabel = d.toLocaleString("en-US", { month: "short" });
      let count = 0;
      employees.forEach((e) => {
        e.records?.forEach((r) => {
          if (!r.createdAt) return;
          const dt = new Date(r.createdAt);
          if (dt.getFullYear() === d.getFullYear() && dt.getMonth() === d.getMonth()) count++;
        });
      });
      arr.push({ l: monthLabel, v: count });
    }
    return arr;
  })();

  if (!isAdmin) {
    // Site/editor dashboard
    const myTrns = transfers.filter((t) => t.requestedBy === user.username).sort((a, b) => b.id - a.id);
    return (
      <>
        <PageTop
          title={`${user.role === "editor" ? "Editor" : "Site"} Dashboard`}
          sub={user.site || ""}
          actions={
            <>
              <button className="btn btn-p btn-sm" onClick={() => router.push("/add-record")}>
                <PlusIcon /> Add Record
              </button>
              <button className="btn btn-s btn-sm" onClick={() => router.push("/transfer")}>
                <TransferIcon /> Transfer
              </button>
            </>
          }
        />
        <div className="pg-body">
          <div className="stats" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="sc sc-pend">
              <div className="sc-ico" style={{ background: "var(--blue-lt)" }}>
                <AlertIcon size={18} />
              </div>
              <div className="sc-val" style={{ color: "var(--blue)" }}>
                {stats?.pending ?? "—"}
              </div>
              <div className="sc-lbl">Pending Approvals</div>
            </div>
            <div className="sc sc-tr">
              <div className="sc-ico" style={{ background: "var(--green-lt)" }}>
                <TransferIcon size={18} />
              </div>
              <div className="sc-val" style={{ color: "var(--green)" }}>
                {myTrns.filter((t) => t.status === "pending").length}
              </div>
              <div className="sc-lbl">Transfer Requests</div>
            </div>
          </div>
          <div className="card">
            <div className="card-hdr">
              <div className="card-hdr-t">My Transfer Requests</div>
              <button className="btn btn-ghost btn-sm" onClick={() => router.push("/transfer")}>
                New →
              </button>
            </div>
            {myTrns.length ? (
              <div>
                {myTrns.map((t) => (
                  <div key={t.id} className="lrow">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        {t.employee?.name || "Unknown"}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--t3)",
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          marginTop: 1,
                        }}
                      >
                        {t.fromSite || "—"} <ArrowRightIcon size={11} /> {t.toSite || "—"}
                      </div>
                    </div>
                    <span
                      className={`badge ${
                        t.status === "pending"
                          ? "b-pending"
                          : t.status === "approved"
                          ? "b-approved"
                          : "b-rejected"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <Empty title="No transfers" sub="Use Transfer Request to initiate" />
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTop
        title="Dashboard"
        sub="Overview of all employee exit records"
        actions={
          <>
            <button className="btn btn-p btn-sm" onClick={() => router.push("/add-record")}>
              <PlusIcon /> Add Record
            </button>
            <button className="btn btn-s btn-sm">
              <DownloadIcon /> Export
            </button>
          </>
        }
      />
      <div className="pg-body">
        {!!stats?.pending && (
          <div className="banner banner-warn">
            <AlertIcon />
            <span>
              <strong>{stats.pending}</strong> item{stats.pending > 1 ? "s" : ""} pending approval —{" "}
              <button
                className="btn btn-ghost btn-sm"
                style={{ padding: "2px 8px", fontSize: 11 }}
                onClick={() => router.push("/approvals")}
              >
                Review now →
              </button>
            </span>
          </div>
        )}

        <div className="stats">
          <div className="sc sc-total">
            <div className="sc-ico" style={{ background: "var(--blue-lt)" }}>
              <UsersIcon size={18} />
            </div>
            <div className="sc-val">{stats?.total ?? "—"}</div>
            <div className="sc-lbl">Total Employees</div>
            <div className="sc-trend">All records in system</div>
          </div>
          <div className="sc sc-res">
            <div className="sc-ico" style={{ background: "#f0f0f0" }}>
              <LogoutIcon size={18} />
            </div>
            <div className="sc-val">{stats?.resigned ?? "—"}</div>
            <div className="sc-lbl">Resigned</div>
          </div>
          <div className="sc sc-fired">
            <div className="sc-ico" style={{ background: "var(--red-lt)" }}>
              <FireIcon size={18} />
            </div>
            <div className="sc-val" style={{ color: "var(--red)" }}>
              {stats?.fired ?? "—"}
            </div>
            <div className="sc-lbl">Fired</div>
          </div>
          <div className="sc sc-bl">
            <div className="sc-ico" style={{ background: "#2c2c2e" }}>
              <ShieldIcon size={18} />
            </div>
            <div className="sc-val">{stats?.blacklisted ?? "—"}</div>
            <div className="sc-lbl">Blacklisted</div>
          </div>
        </div>

        <div className="stats">
          <div className="sc sc-tr">
            <div className="sc-ico" style={{ background: "var(--green-lt)" }}>
              <TransferIcon size={18} />
            </div>
            <div className="sc-val" style={{ color: "var(--green)" }}>
              {stats?.transfer ?? "—"}
            </div>
            <div className="sc-lbl">Transferred</div>
          </div>
          <div className="sc sc-pend">
            <div className="sc-ico" style={{ background: "var(--orange-lt)" }}>
              <AlertIcon size={18} />
            </div>
            <div className="sc-val" style={{ color: "var(--orange)" }}>
              {stats?.pending ?? "—"}
            </div>
            <div className="sc-lbl">Pending Approval</div>
          </div>
          <div className="sc">
            <div className="sc-ico" style={{ background: "var(--purple-lt)" }}>
              <TransferIcon size={18} />
            </div>
            <div className="sc-val" style={{ color: "var(--purple)" }}>
              {stats?.pendingTransfers ?? 0}
            </div>
            <div className="sc-lbl">Transfer Requests</div>
          </div>
          <div className="sc">
            <div className="sc-ico" style={{ background: "var(--blue-lt)" }}>
              <MapPinIcon size={18} />
            </div>
            <div className="sc-val" style={{ color: "var(--blue)" }}>
              {stats?.sites ?? "—"}
            </div>
            <div className="sc-lbl">Active Sites</div>
          </div>
        </div>

        <div className="charts-row">
          <div className="chart-card">
            <div className="chart-t">Status Breakdown</div>
            <BarChart
              data={[
                { label: "Resigned", value: stats?.resigned || 0, color: "#8e8e93" },
                { label: "Fired", value: stats?.fired || 0, color: "var(--red)" },
                { label: "Blacklisted", value: stats?.blacklisted || 0, color: "#1c1c1e" },
                { label: "Transfer", value: stats?.transfer || 0, color: "var(--green)" },
              ]}
            />
          </div>
          <div className="chart-card">
            <div className="chart-t">Monthly Activity (6 months)</div>
            <LineChart data={months.map((m) => ({ label: m.l, value: m.v }))} />
          </div>
        </div>

        {sortedSites.length > 0 && (
          <div className="card">
            <div className="card-hdr">
              <div className="card-hdr-t">Site-wise Breakdown</div>
              <button className="btn btn-ghost btn-sm" onClick={() => router.push("/analytics")}>
                Full analytics →
              </button>
            </div>
            <div style={{ padding: "0 20px 6px" }}>
              {sortedSites.map(([s, c]) => (
                <div
                  key={s}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 0",
                    borderBottom: "1px solid var(--bd)",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      fontSize: 13,
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: "var(--blue)",
                      minWidth: 24,
                      textAlign: "right",
                    }}
                  >
                    {c}
                  </div>
                  <div className="site-bar">
                    <div className="site-bar-fill" style={{ width: `${Math.round((c / maxSite) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-hdr">
            <div className="card-hdr-t">Recent Employees</div>
            <button className="btn btn-ghost btn-sm" onClick={() => router.push("/database")}>
              View all →
            </button>
          </div>
          {recent.length ? (
            <div className="cg">
              {recent.map((e) => (
                <EmployeeCard key={e.id} employee={e} onClick={() => setDetailEmp(e)} />
              ))}
            </div>
          ) : (
            <Empty title="No employees" sub="Add records to get started" />
          )}
        </div>
      </div>

      <EmployeeDetail
        employee={detailEmp}
        open={!!detailEmp}
        onClose={() => setDetailEmp(null)}
        onEdit={() => {
          if (detailEmp) {
            router.push(`/add-record?id=${detailEmp.id}`);
          }
        }}
      />
    </>
  );
}
