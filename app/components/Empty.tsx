import { DatabaseIcon } from "./Icons";

export function Empty({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="empty">
      <div className="empty-ico">
        <DatabaseIcon size={22} />
      </div>
      <div className="empty-t">{title}</div>
      {sub && <div className="empty-s">{sub}</div>}
    </div>
  );
}
