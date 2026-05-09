import { API_BASE } from "./api";

export function initials(name: string | null | undefined): string {
  if (!name) return "?";
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  );
}

export function fmtDate(s: string | null | undefined): string {
  if (!s) return "—";
  return s.slice(0, 10);
}

export function fmtDateTime(s: string | null | undefined): string {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return s.slice(0, 16).replace("T", " ");
  }
}

export function photoUrl(filename: string | null | undefined): string | null {
  if (!filename) return null;
  if (filename.startsWith("http") || filename.startsWith("data:")) return filename;
  return `${API_BASE}/uploads/${filename}`;
}
