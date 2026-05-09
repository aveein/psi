"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { Employee, Site, Status } from "../../lib/types";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../components/Toast";
import { PageTop } from "../../components/PageTop";
import { Empty } from "../../components/Empty";
import { EmployeeCard, EmployeeTable } from "../../components/EmployeeCard";
import { EmployeeDetail } from "../../components/EmployeeDetail";
import {
  DatabaseIcon,
  DownloadIcon,
  FireIcon,
  GridIcon,
  ListIcon,
  LogoutIcon,
  PlusIcon,
  SearchIcon,
  ShieldIcon,
  TransferIcon,
} from "../../components/Icons";
import { Modal } from "../../components/Modal";

const FILTERS: { key: "all" | Status; label: string; cls: string }[] = [
  { key: "all", label: "All", cls: "" },
  { key: "resigned", label: "Resigned", cls: "" },
  { key: "fired", label: "Fired", cls: "fired-f" },
  { key: "blacklisted", label: "Blacklisted", cls: "bl-f" },
  { key: "transfer", label: "Transfer", cls: "tr-f" },
];

export default function DatabasePage() {
  const router = useRouter();
  const { can } = useAuth();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [q, setQ] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "name">("newest");
  const [view, setView] = useState<"card" | "table">("card");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<Employee | null>(null);
  const [delTarget, setDelTarget] = useState<Employee | null>(null);
  const pageSize = 20;

  async function load() {
    const r = await api.get<{ data: Employee[] }>("/api/employees");
    setEmployees(r.data || []);
  }

  useEffect(() => {
    load();
    api.get<{ data: Site[] }>("/api/sites").then((r) => setSites(r.data || []));
  }, []);

  const filtered = useMemo(() => {
    let result = employees.filter((e) => {
      const records = (e.records || []).filter((r) => r.approved);
      const filteredRecs = filter === "all" ? records : records.filter((r) => r.status === filter);
      if (filter !== "all" && !filteredRecs.length) return false;
      if (siteFilter && !records.some((r) => r.site === siteFilter)) return false;
      if (!q) return true;
      const ql = q.toLowerCase();
      return (
        e.name.toLowerCase().includes(ql) ||
        e.zairo.toLowerCase().includes(ql) ||
        (e.nationality || "").toLowerCase().includes(ql) ||
        records.some(
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
  }, [employees, filter, q, siteFilter, sort]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: employees.length };
    (["resigned", "fired", "blacklisted", "transfer"] as Status[]).forEach((s) => {
      c[s] = employees.filter((e) =>
        e.records?.some((r) => r.approved && r.status === s)
      ).length;
    });
    return c;
  }, [employees]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

  async function handleDelete() {
    if (!delTarget) return;
    try {
      await api.del(`/api/employees/${delTarget.id}`);
      toast("Moved to Recycle Bin", "info");
      setDelTarget(null);
      load();
    } catch (e: any) {
      toast(e.message || "Failed", "error");
    }
  }

  return (
    <>
      <PageTop
        title="All Records Database"
        sub={`Complete employee record repository — ${employees.length} employees`}
        actions={
          <>
            {can("export") && (
              <button className="btn btn-s btn-sm">
                <DownloadIcon /> Export All
              </button>
            )}
            <button className="btn btn-p btn-sm" onClick={() => router.push("/add-record")}>
              <PlusIcon /> Add Record
            </button>
          </>
        }
      />
      <div className="pg-body">
        <div className="card">
          <div className="db-filters">
            {FILTERS.map((f) => {
              const Icon =
                f.key === "all"
                  ? DatabaseIcon
                  : f.key === "resigned"
                  ? LogoutIcon
                  : f.key === "fired"
                  ? FireIcon
                  : f.key === "blacklisted"
                  ? ShieldIcon
                  : TransferIcon;
              return (
                <button
                  key={f.key}
                  className={`db-filter-btn ${f.cls} ${filter === f.key ? "on" : ""}`}
                  onClick={() => {
                    setFilter(f.key);
                    setPage(1);
                  }}
                >
                  <Icon size={11} /> {f.label} ({counts[f.key] ?? 0})
                </button>
              );
            })}
          </div>
          <div className="tbar">
            <div className="tbar-sw">
              <span className="tbar-ico">
                <SearchIcon />
              </span>
              <input
                className="tb-inp"
                placeholder="Search name, Zairo, site, reason…"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <select
              className="tb-sel"
              value={siteFilter}
              onChange={(e) => {
                setSiteFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Sites</option>
              {sites.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              className="tb-sel"
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A–Z</option>
            </select>
            <div className="view-tgl">
              <button className={`vt-b ${view === "card" ? "on" : ""}`} onClick={() => setView("card")}>
                <GridIcon size={13} />
              </button>
              <button className={`vt-b ${view === "table" ? "on" : ""}`} onClick={() => setView("table")}>
                <ListIcon size={13} />
              </button>
            </div>
            <span className="tb-cnt">
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {slice.length === 0 ? (
            <Empty title="No records found" sub="Adjust filters or add a new record" />
          ) : view === "card" ? (
            <div className="cg">
              {slice.map((e) => (
                <EmployeeCard
                  key={e.id}
                  employee={e}
                  status={filter === "all" ? "" : filter}
                  onClick={() => setDetail(e)}
                  onDelete={() => setDelTarget(e)}
                  showDelete={can("delete")}
                />
              ))}
            </div>
          ) : (
            <EmployeeTable
              employees={slice}
              status={filter === "all" ? "" : filter}
              onRowClick={setDetail}
              onDelete={setDelTarget}
              showDelete={can("delete")}
            />
          )}

          {totalPages > 1 && (
            <div className="pag">
              <span className="pi">
                Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
              </span>
              <button className="pb" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                ‹
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1;
                if (totalPages > 7 && n > 2 && n < totalPages - 1 && Math.abs(n - page) > 1) {
                  if (n === 3 || n === totalPages - 2) {
                    return (
                      <span key={n} style={{ color: "var(--t4)", fontSize: 12, padding: "0 2px" }}>
                        …
                      </span>
                    );
                  }
                  return null;
                }
                return (
                  <button
                    key={n}
                    className={`pb ${n === page ? "on" : ""}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                );
              })}
              <button
                className="pb"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                ›
              </button>
            </div>
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
        onDelete={() => {
          setDelTarget(detail);
          setDetail(null);
        }}
      />

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
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "var(--r12)",
            background: "var(--red-lt)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <ShieldIcon size={22} style={{ color: "var(--red)" }} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 7 }}>Delete this record?</div>
        <p style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.7 }}>
          Moves to Recycle Bin. Can be restored anytime.
        </p>
      </Modal>
    </>
  );
}
