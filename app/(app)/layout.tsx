"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { Sidebar } from "../components/Sidebar";
import { MenuIcon } from "../components/Icons";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sbOpen, setSbOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t3)" }}>
        Loading…
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="app-shell">
      <Sidebar open={sbOpen} onClose={() => setSbOpen(false)} />
      <main className="main">
        <header className="mob-hdr">
          <div className="mob-hdr-l">
            <span className="mob-badge">PIONEER</span>
            <span className="mob-t">Employee Records</span>
          </div>
          <button className="btn-mob" onClick={() => setSbOpen(true)}>
            <MenuIcon size={15} />
          </button>
        </header>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>{children}</div>
      </main>
    </div>
  );
}
