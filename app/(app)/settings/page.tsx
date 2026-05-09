"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Permissions, Role } from "../../lib/types";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../components/Toast";
import { PageTop } from "../../components/PageTop";

const PERM_KEYS = [
  "view",
  "add",
  "edit",
  "delete",
  "approve",
  "users",
  "fields",
  "sites",
  "logs",
  "recycle",
  "analytics",
  "export",
];

export default function SettingsPage() {
  const { user, refresh } = useAuth();
  const { toast } = useToast();
  const [perms, setPerms] = useState<Permissions | null>(null);

  async function load() {
    const r = await api.get<{ data: Permissions }>("/api/permissions");
    setPerms(r.data);
  }
  useEffect(() => {
    load();
  }, []);

  async function toggle(role: Role, key: string) {
    if (!perms) return;
    const next: Permissions = JSON.parse(JSON.stringify(perms));
    if (!next[role]) next[role] = {};
    next[role][key] = !next[role][key];
    setPerms(next);
    try {
      await api.put(`/api/permissions/${role}`, { perms: next[role] });
      toast(`${role}.${key} ${next[role][key] ? "enabled" : "disabled"}`, "info");
      refresh();
    } catch (e: any) {
      toast(e.message, "error");
      load();
    }
  }

  const colors: Record<Role, string> = {
    admin: "var(--blue)",
    editor: "var(--purple)",
    site: "var(--green)",
  };

  return (
    <>
      <PageTop title="Settings" sub="App preferences and role permissions" />
      <div className="pg-body">
        <div className="card card-body" style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
            Roles &amp; Permissions
          </div>
          <div style={{ fontSize: 13, color: "var(--t3)", marginBottom: 16 }}>
            Admin can toggle permissions for each role. Changes take effect immediately.
          </div>
          {perms && (
            <div className="role-matrix">
              {(["admin", "editor", "site"] as Role[]).map((role) => (
                <div key={role} className={`role-card ${role === user?.role ? "me" : ""}`}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
                    <div className="sb-av" style={{ background: colors[role] }}>
                      {role.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, textTransform: "capitalize" }}>
                        {role}
                      </div>
                      {role === user?.role && (
                        <div style={{ fontSize: 11, color: "var(--blue)", fontWeight: 600 }}>
                          Current Role
                        </div>
                      )}
                    </div>
                  </div>
                  {PERM_KEYS.map((k) => (
                    <div key={k} className="perm-row">
                      <span style={{ color: "var(--t2)" }}>{k}</span>
                      <button
                        className={`toggle ${perms[role]?.[k] ? "on" : ""}`}
                        onClick={() => toggle(role, k)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
