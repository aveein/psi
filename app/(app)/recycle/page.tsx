"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { RecycleItem } from "../../lib/types";
import { useToast } from "../../components/Toast";
import { PageTop } from "../../components/PageTop";
import { Empty } from "../../components/Empty";
import { RotateIcon, TrashIcon } from "../../components/Icons";
import { fmtDate } from "../../lib/utils";

export default function RecyclePage() {
  const { toast } = useToast();
  const [items, setItems] = useState<RecycleItem[]>([]);

  async function load() {
    const r = await api.get<{ data: RecycleItem[] }>("/api/recycle");
    setItems(r.data || []);
  }
  useEffect(() => {
    load();
  }, []);

  async function restore(id: number) {
    try {
      await api.post(`/api/recycle/${id}/restore`);
      toast("Restored", "success");
      load();
    } catch (e: any) {
      toast(e.message, "error");
    }
  }

  async function permaDelete(id: number) {
    if (!confirm("Permanently delete? Cannot be undone.")) return;
    try {
      await api.del(`/api/recycle/${id}`);
      toast("Permanently deleted", "info");
      load();
    } catch (e: any) {
      toast(e.message, "error");
    }
  }

  async function emptyAll() {
    if (!confirm("Permanently delete ALL? Cannot undo.")) return;
    try {
      await api.del("/api/recycle");
      toast("Bin emptied", "info");
      load();
    } catch (e: any) {
      toast(e.message, "error");
    }
  }

  return (
    <>
      <PageTop
        title="Recycle Bin"
        sub={`${items.length} deleted items`}
        actions={
          items.length > 0 && (
            <button className="btn btn-d btn-sm" onClick={emptyAll}>
              <TrashIcon /> Empty Bin
            </button>
          )
        }
      />
      <div className="pg-body">
        <div className="card">
          {items.length === 0 ? (
            <Empty title="Bin is empty" sub="Deleted records appear here" />
          ) : (
            items.map((i) => (
              <div key={i.id} className="lrow">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{i.label || i.entityType}</div>
                  <div style={{ fontSize: 11, color: "var(--t3)" }}>
                    Deleted {fmtDate(i.createdAt)} by {i.deletedBy} · from {i.deletedFrom}
                  </div>
                </div>
                <button className="btn btn-s btn-sm" onClick={() => restore(i.id)}>
                  <RotateIcon size={12} /> Restore
                </button>
                <button className="ib del" onClick={() => permaDelete(i.id)}>
                  <TrashIcon size={12} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
