"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { initials } from "../lib/utils";
import { api } from "../lib/api";
import {
  DashboardIcon,
  SearchIcon,
  DatabaseIcon,
  LogoutIcon,
  ShieldIcon,
  TransferIcon,
  CheckIcon,
  BarChartIcon,
  UsersIcon,
  PenIcon,
  MapPinIcon,
  FileIcon,
  TrashIcon,
  SettingsIcon,
  PlusCircleIcon,
  FireIcon,
} from "./Icons";

type NavItem = {
  href?: string;
  label?: string;
  icon?: React.ComponentType<any>;
  badgeKey?: string;
  section?: string;
};

const ADMIN_NAV: NavItem[] = [
  { section: "Overview" },
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/search", label: "Search", icon: SearchIcon },
  { section: "Database" },
  { href: "/database", label: "All Records", icon: DatabaseIcon, badgeKey: "total" },
  { href: "/employees/resigned", label: "Resigned", icon: LogoutIcon, badgeKey: "resigned" },
  { href: "/employees/fired", label: "Fired", icon: FireIcon, badgeKey: "fired" },
  { href: "/employees/blacklisted", label: "Blacklisted", icon: ShieldIcon, badgeKey: "blacklisted" },
  { href: "/employees/transfer", label: "Transfer", icon: TransferIcon, badgeKey: "transfer" },
  { section: "Workflow" },
  { href: "/approvals", label: "Approvals", icon: CheckIcon, badgeKey: "pending" },
  { href: "/analytics", label: "Analytics", icon: BarChartIcon },
  { section: "System" },
  { href: "/users", label: "Users", icon: UsersIcon },
  { href: "/fields", label: "Field Config", icon: PenIcon },
  { href: "/sites", label: "Sites", icon: MapPinIcon },
  { href: "/logs", label: "Audit Logs", icon: FileIcon },
  { href: "/recycle", label: "Recycle Bin", icon: TrashIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

const SITE_NAV: NavItem[] = [
  { section: "Overview" },
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/search", label: "Search", icon: SearchIcon },
  { section: "Actions" },
  { href: "/add-record", label: "Add Record", icon: PlusCircleIcon },
  { href: "/transfer", label: "Transfer Request", icon: TransferIcon },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    api.get<{ data: any }>("/api/stats").then((r) => setStats(r.data)).catch(() => {});
  }, [user, pathname]);

  if (!user) return null;
  const nav = user.role === "admin" ? ADMIN_NAV : SITE_NAV;
  const roleLabel = user.role === "admin" ? "Administrator" : user.role === "editor" ? "Editor" : "Site User";
  const chip = user.role === "admin" ? "chip-admin" : user.role === "editor" ? "chip-editor" : "chip-site";

  async function handleLogout() {
    await logout();
    window.location.href = "/login";
  }

  return (
    <>
      <div className={`sb-ov ${open ? "show" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sb-hd">
          <div className="sb-brand">
            <span className="sb-bdg">PIONEER</span>
          </div>
          <div className="sb-org">㈱パイオニア・サービス · Records</div>
          <span className={`sb-chip ${chip}`}>{roleLabel}</span>
        </div>
        <nav className="sb-nav">
          {nav.map((item, i) => {
            if (item.section) {
              return (
                <span key={`s-${i}`} className="nav-sec">
                  {item.section}
                </span>
              );
            }
            const Icon = item.icon!;
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href!));
            const badge = item.badgeKey && stats?.[item.badgeKey] ? stats[item.badgeKey] : null;
            return (
              <Link
                key={item.href}
                href={item.href!}
                className={`nav-item ${active ? "active" : ""}`}
                onClick={onClose}
              >
                <Icon />
                <span>{item.label}</span>
                {!!badge && <span className="nav-bd">{badge}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="sb-ft">
          <div className="sb-user">
            <div className="sb-av">{initials(user.username)}</div>
            <div>
              <div className="sb-name">{user.username}</div>
              <div className="sb-role">
                {roleLabel}
                {user.site ? ` · ${user.site}` : ""}
              </div>
            </div>
          </div>
          <button className="btn-so" onClick={handleLogout}>
            <LogoutIcon />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
