"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import { Employee, Status } from "../../../lib/types";
import { useAuth } from "../../../contexts/AuthContext";
import { PageTop } from "../../../components/PageTop";
import { Empty } from "../../../components/Empty";
import { EmployeeCard, EmployeeTable } from "../../../components/EmployeeCard";
import { EmployeeDetail } from "../../../components/EmployeeDetail";
import {
  DownloadIcon,
  GridIcon,
  ListIcon,
  SearchIcon,
} from "../../../components/Icons";

const META: Record<Status, { t: string; s: string }> = {
  resigned: { t: "Resigned | 退職者", s: "Voluntary resignations" },
  fired: { t: "Fired | 解雇者", s: "Company terminations" },
  blacklisted: { t: "Blacklisted | 入社拒否", s: "Do not rehire" },
  transfer: { t: "Transfer | 異動", s: "Approved employee transfers" },
};

export default function StatusListPage() {
  const params = useParams();
  const status = params.status as Status;
  const router = useRouter();
  const { can } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "name">("newest");
  const [view, setView] = useState<"card" | "table">("card");
  const [detail, setDetail] = useState<Employee | null>(null);

  useEffect(() => {
    api.get<{ data: Employee[] }>("/api/employees").then((r) => setEmployees(r.data || []));
  }, []);

  if (!META[status]) {
    return (
      <>
        <PageTop title="Not found" />
        <div className="pg-body">
          <Empty title="Page not found" />
        </div>
      </>
    );
  }

  const meta = META[status];
  const filtered = useMemo(() => {
    let result = employees.filter((e) => {
      const recs = (e.records || []).filter((r) => r.approved && r.status === status);
      if (!recs.length) return false;
      if (!q) return true;
      const ql = q.toLowerCase();
      return (
        e.name.toLowerCase().includes(ql) ||
        e.zairo.toLowerCase().includes(ql) ||
        (e.nationality || "").toLowerCase().includes(ql) ||
        recs.some(
          (r) =>
            (r.site || "").toLowerCase().includes(ql) ||
            (r.reason || "").toLowerCase().includes(ql)
        )
      );
    });
    if (sort === "newest") result.sort((a, b) => b.id - a.id);
    else if (sort === "oldest") result.sort((a, b) => a.id - b.id);
    else result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [employees, q, sort, status]);

  return (
    <>
      <PageTop
        title={meta.t}
        sub={meta.s}
        actions={
          <>
            <div className="view-tgl">
              <button className={`vt-b ${view === "card" ? "on" : ""}`} onClick={() => setView("card")}>
                <GridIcon size={13} />
              </button>
              <button className={`vt-b ${view === "table" ? "on" : ""}`} onClick={() => setView("table")}>
                <ListIcon size={13} />
              </button>
            </div>
            {can("export") && (
              <button className="btn btn-s btn-sm">
                <DownloadIcon /> Export
              </button>
            )}
          </>
        }
      />
      <div className="pg-body">
        <div className="card">
          <div className="tbar">
            <div className="tbar-sw">
              <span className="tbar-ico">
                <SearchIcon />
              </span>
              <input
                className="tb-inp"
                placeholder="Filter by name, site, reason…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <select className="tb-sel" value={sort} onChange={(e) => setSort(e.target.value as any)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name">Name A–Z</option>
            </select>
            <span className="tb-cnt">
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
          {filtered.length === 0 ? (
            <Empty title="No records" sub="Adjust your filters" />
          ) : view === "card" ? (
            <div className="cg">
              {filtered.map((e) => (
                <EmployeeCard
                  key={e.id}
                  employee={e}
                  status={status}
                  onClick={() => setDetail(e)}
                />
              ))}
            </div>
          ) : (
            <EmployeeTable employees={filtered} status={status} onRowClick={setDetail} />
          )}
        </div>
      </div>
      <EmployeeDetail
        employee={detail}
        open={!!detail}
        onClose={() => setDetail(null)}
        onEdit={() => {
          if (detail) router.push(`/add-record?id=${detail.id}`);
          setDetail(null);
        }}
      />
    </>
  );
}
