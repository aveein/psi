"use client";

import { Employee } from "../lib/types";
import { initials, photoUrl, fmtDate } from "../lib/utils";
import { Modal } from "./Modal";
import { StatusBadge } from "./StatusBadge";
import { Empty } from "./Empty";
import { EditIcon, TrashIcon } from "./Icons";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  employee: Employee | null;
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function EmployeeDetail({ employee, open, onClose, onEdit, onDelete }: Props) {
  const { can } = useAuth();
  if (!employee) return null;
  const approved = (employee.records || []).filter((r) => r.approved);
  const pending = (employee.records || []).filter((r) => !r.approved);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Employee Details"
      size="lg"
      footer={
        <>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Close
          </button>
          {can("edit") && onEdit && (
            <button className="btn btn-s btn-sm" onClick={onEdit}>
              <EditIcon /> Edit
            </button>
          )}
          {can("delete") && onDelete && (
            <button className="btn btn-d btn-sm" onClick={onDelete}>
              <TrashIcon /> Delete
            </button>
          )}
        </>
      }
    >
      <div className="det-hd">
        {employee.photo ? (
          <img className="det-ph" src={photoUrl(employee.photo) || ""} alt={employee.name} />
        ) : (
          <div className="det-avp">{initials(employee.name)}</div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="det-name">{employee.name}</div>
          <div className="det-zairo">{employee.zairo}</div>
          {approved.length > 0 && (
            <div style={{ marginTop: 8, display: "flex", gap: 5, flexWrap: "wrap" }}>
              <StatusBadge status={approved[approved.length - 1].status} />
            </div>
          )}
        </div>
      </div>

      <div className="det-grid">
        <div className="di">
          <div className="di-l">Katakana</div>
          <div className="di-v">{employee.kana || "—"}</div>
        </div>
        <div className="di">
          <div className="di-l">Date of Birth</div>
          <div className="di-v">{employee.dob || "—"}</div>
        </div>
        <div className="di">
          <div className="di-l">Gender</div>
          <div className="di-v">{employee.gender || "—"}</div>
        </div>
        <div className="di">
          <div className="di-l">Nationality</div>
          <div className="di-v">{employee.nationality || "—"}</div>
        </div>
        <div className="di s2">
          <div className="di-l">Visa Type</div>
          <div className="di-v">{employee.visa || "—"}</div>
        </div>
        {employee.custom &&
          Object.entries(employee.custom).map(([k, v]) => {
            if (!v) return null;
            const isImg = typeof v === "string" && (v.startsWith("data:image") || v.startsWith("http"));
            if (isImg) {
              return (
                <div key={k} className="di s2">
                  <div className="di-l">{k}</div>
                  <img
                    src={v as string}
                    style={{
                      maxWidth: "100%",
                      maxHeight: 160,
                      borderRadius: "var(--r8)",
                      marginTop: 5,
                      border: "1px solid var(--bd)",
                      objectFit: "cover",
                    }}
                  />
                </div>
              );
            }
            return (
              <div key={k} className="di">
                <div className="di-l">{k}</div>
                <div className="di-v">{String(v)}</div>
              </div>
            );
          })}
      </div>

      {approved.length > 0 ? (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--t2)", marginBottom: 8 }}>
            Employment History ({approved.length} records)
          </div>
          <div className="hist-box">
            <table className="hist-tbl">
              <thead>
                <tr>
                  <th>Site</th>
                  <th>Joining</th>
                  <th>Leaving</th>
                  <th>Status</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {approved.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{r.site || "—"}</td>
                    <td style={{ fontSize: 12, color: "var(--t2)" }}>{fmtDate(r.joining)}</td>
                    <td style={{ fontSize: 12, color: "var(--t2)" }}>{fmtDate(r.leaving)}</td>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
                    <td
                      style={{
                        fontSize: 12,
                        color: "var(--t2)",
                        maxWidth: 160,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={r.reason || ""}
                    >
                      {r.reason?.slice(0, 60) || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <Empty title="No approved records" />
      )}

      {pending.length > 0 && (
        <div
          style={{
            marginTop: 12,
            background: "var(--orange-lt)",
            border: "1px solid rgba(255,149,0,.2)",
            borderRadius: "var(--r10)",
            padding: "11px 14px",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--orange)", marginBottom: 7 }}>
            ⏳ {pending.length} Pending Approval
          </div>
          {pending.map((r) => (
            <div
              key={r.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "4px 0",
                fontSize: 12,
              }}
            >
              <span>
                {r.site || "—"} · {fmtDate(r.joining)}
              </span>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
