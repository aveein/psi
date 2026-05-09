"use client";

import { Employee, Status } from "../lib/types";
import { initials, photoUrl, fmtDate } from "../lib/utils";
import { StatusBadge } from "./StatusBadge";
import { TrashIcon } from "./Icons";

type Props = {
  employee: Employee;
  status?: Status | "";
  onClick?: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
};

export function EmployeeCard({ employee, status, onClick, onDelete, showDelete }: Props) {
  const records = (employee.records || []).filter((r) => r.approved);
  const filtered = status ? records.filter((r) => r.status === status) : records;
  const last = filtered[filtered.length - 1];

  return (
    <div className="rc" onClick={onClick}>
      <div className="rc-top">
        {employee.photo ? (
          <img className="rc-av" src={photoUrl(employee.photo) || ""} alt={employee.name} />
        ) : (
          <div className="rc-avp">{initials(employee.name)}</div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="rc-name">{employee.name}</div>
          <div className="rc-zairo">{employee.zairo}</div>
          <div className="rc-bdgs">
            {last && <StatusBadge status={last.status} />}
            {filtered.length > 1 && (
              <span
                className="badge"
                style={{ background: "var(--blue-lt)", color: "var(--blue)" }}
              >
                {filtered.length} sites
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="rc-fields">
        <div className="rf">
          <div className="rf-l">Nationality</div>
          <div className="rf-v">{employee.nationality || "—"}</div>
        </div>
        <div className="rf">
          <div className="rf-l">Visa</div>
          <div className="rf-v">{(employee.visa || "—").split(" ")[0]}</div>
        </div>
        {last && (
          <div className="rf s2">
            <div className="rf-l">Last Site</div>
            <div className="rf-v">{last.site || "—"}</div>
          </div>
        )}
      </div>
      {showDelete && onDelete && (
        <div
          style={{
            paddingTop: 8,
            borderTop: "1px solid var(--bd)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            className="ib del"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <TrashIcon size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

export function EmployeeTable({
  employees,
  status,
  onRowClick,
  onDelete,
  showDelete,
}: {
  employees: Employee[];
  status?: Status | "";
  onRowClick: (e: Employee) => void;
  onDelete?: (e: Employee) => void;
  showDelete?: boolean;
}) {
  return (
    <div className="tbl-wrap">
      <table className="dtbl">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name / Zairo</th>
            <th>Nationality</th>
            <th>Visa</th>
            <th>Site</th>
            <th>Joined</th>
            <th>Left</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => {
            const records = (e.records || []).filter((r) => r.approved);
            const filtered = status ? records.filter((r) => r.status === status) : records;
            const last = filtered[filtered.length - 1];
            return (
              <tr key={e.id} onClick={() => onRowClick(e)}>
                <td style={{ width: 48 }}>
                  {e.photo ? (
                    <img className="tbl-av" src={photoUrl(e.photo) || ""} alt={e.name} />
                  ) : (
                    <div className="tbl-avp">{initials(e.name)}</div>
                  )}
                </td>
                <td>
                  <div className="tbl-name">{e.name}</div>
                  <div className="tbl-sub">{e.zairo}</div>
                </td>
                <td>{e.nationality || "—"}</td>
                <td style={{ fontSize: 12 }}>{(e.visa || "—").split("(")[0].trim()}</td>
                <td>{last ? last.site || "—" : "—"}</td>
                <td>{last ? fmtDate(last.joining) : "—"}</td>
                <td>{last ? fmtDate(last.leaving) : "—"}</td>
                <td>{last && <StatusBadge status={last.status} />}</td>
                <td>
                  {showDelete && onDelete && (
                    <button
                      className="ib del"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onDelete(e);
                      }}
                    >
                      <TrashIcon size={12} />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
