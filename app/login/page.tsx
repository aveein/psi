"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { ChevronLeftIcon, EyeIcon, EyeOffIcon, LockIcon, UserIcon } from "../components/Icons";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    if (!username || !password) {
      setErr("Username and password required");
      return;
    }
    setLoading(true);
    try {
      await login(username, password);
      router.push("/dashboard");
    } catch (e: any) {
      setErr(e?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg2)",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "var(--r24)",
          border: "1px solid var(--bd)",
          padding: "40px 36px",
          width: "100%",
          maxWidth: 400,
          boxShadow: "var(--sh2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 26 }}>
          <span
            style={{
              background: "var(--blue)",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "var(--r6)",
              letterSpacing: 0.5,
            }}
          >
            PIONEER
          </span>
          <div style={{ fontSize: 12, color: "var(--t3)", lineHeight: 1.5 }}>
            ㈱パイオニア・サービス
            <br />
            Employee Records & History System
          </div>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.5px", marginBottom: 4 }}>Sign in</h1>
        <p style={{ fontSize: 14, color: "var(--t3)", marginBottom: 20 }}>
          Access your employee records dashboard
        </p>

        <Link
          href="/"
          style={{
            background: "none",
            border: "none",
            color: "var(--blue)",
            fontSize: 14,
            cursor: "pointer",
            padding: 0,
            marginBottom: 18,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          <ChevronLeftIcon size={13} />
          Back to Search
        </Link>

        <div
          style={{
            background: "var(--blue-lt)",
            borderRadius: "var(--r10)",
            padding: "11px 14px",
            fontSize: 12,
            color: "var(--t2)",
            marginBottom: 20,
            lineHeight: 1.75,
          }}
        >
          <div>
            <b style={{ color: "var(--blue)", fontWeight: 700 }}>admin</b>/pioneer2025
            <span style={{ color: "var(--t4)", margin: "0 5px" }}>·</span>Admin
          </div>
          <div>
            <b style={{ color: "var(--blue)", fontWeight: 700 }}>editor</b>/editor2025
            <span style={{ color: "var(--t4)", margin: "0 5px" }}>·</span>Editor
          </div>
          <div>
            <b style={{ color: "var(--blue)", fontWeight: 700 }}>site1</b>/site2025
            <span style={{ color: "var(--t4)", margin: "0 5px" }}>·</span>Site user
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--t2)", marginBottom: 5 }}>
              Username | ユーザー名
            </label>
            <div style={{ position: "relative" }}>
              <UserIcon
                size={15}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--t4)",
                  pointerEvents: "none",
                }}
              />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="Enter username"
                style={{
                  width: "100%",
                  border: "1.5px solid var(--bd)",
                  borderRadius: "var(--r10)",
                  padding: "11px 38px",
                  fontSize: 15,
                  background: "var(--bg3)",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--t2)", marginBottom: 5 }}>
              Password | パスワード
            </label>
            <div style={{ position: "relative" }}>
              <LockIcon
                size={15}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--t4)",
                  pointerEvents: "none",
                }}
              />
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                style={{
                  width: "100%",
                  border: "1.5px solid var(--bd)",
                  borderRadius: "var(--r10)",
                  padding: "11px 38px",
                  fontSize: 15,
                  background: "var(--bg3)",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                style={{
                  position: "absolute",
                  right: 11,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--t4)",
                  cursor: "pointer",
                  padding: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPwd ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
              </button>
            </div>
          </div>

          {err && (
            <div
              style={{
                background: "var(--red-lt)",
                borderRadius: "var(--r8)",
                padding: "9px 12px",
                fontSize: 13,
                color: "var(--red)",
                fontWeight: 500,
                marginBottom: 12,
              }}
            >
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "var(--blue)",
              color: "#fff",
              border: "none",
              padding: 13,
              borderRadius: "var(--r12)",
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 3px 12px rgba(0,113,227,.28)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </form>
      </div>
    </div>
  );
}
