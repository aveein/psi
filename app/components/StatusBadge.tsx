import { Status, STATUS_META } from "../lib/types";

export function StatusBadge({ status }: { status: Status }) {
  const meta = STATUS_META[status];
  if (!meta) return <span className="badge b-resigned">{status}</span>;
  return <span className={`badge ${meta.badge}`}>{meta.label}</span>;
}
