"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Search from "./search";
import { SearchIcon } from "./helper";
import AddNewMember from "./addNewMember";
import MemberList from "./memberList";

export default function Dashboard() {
  const [active, setActive] = useState<"search" | "add" | "full">("full");

  const [data, setData] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [searchBy, setSearchBy] = useState("name");
  // Consolidated form state for "Add New Blacklist Entry"

  async function fetchData() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blacklist`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json().catch(() => null);
      if (!json) {
        setData([]);
        return;
      }

      if (Array.isArray(json.data)) setData(json.data);
      else setData([]);
    } catch (err) {
      setData([]);
    }
  }

  useEffect(() => {
    setMounted(true);
    if(active === "full"){

      fetchData();
    }
  }, [active]);



  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Gradient Header */}
      <header className="bg-gradient-to-r from-purple-800 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold leading-tight">
              Pioneer Service Kyoto
            </h1>
            <p className="text-sm opacity-90 -mt-1">
              Blacklist Management System
            </p>
          </div>
          <div className="pt-1">
            <button
              onClick={() => redirect("/login")}
              className="bg-pink-500 hover:bg-pink-600 transition-colors text-sm font-medium px-5 py-2 rounded-md flex items-center space-x-2 shadow-sm"
            >
              <LogoutIcon className="w-4 h-4" />
              <span>Logout | ログアウト</span>
            </button>
          </div>
        </div>
      </header>

      {/* Light Tabs Bar below header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <nav className="flex items-center space-x-10 text-sm font-medium">
            <button
              onClick={() => setActive("search")}
              className={`relative py-4 flex items-center space-x-2 px-1 ${
                active === "search"
                  ? "text-purple-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <SearchIcon className="w-5 h-5" />
              <span>Search | 検索</span>
              {active === "search" && (
                <span className="absolute left-0 right-0 bottom-0 h-[3px] rounded-full bg-purple-500" />
              )}
            </button>
            <button
              onClick={() => setActive("add")}
              className={`relative py-4 flex items-center space-x-2 px-1 ${
                active === "add"
                  ? "text-purple-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <UserPlusIcon className="w-5 h-5" />
              <span>Add New Member | 新しいメンバーを追加</span>
              {active === "add" && (
                <span className="absolute left-0 right-0 bottom-0 h-[3px] rounded-full bg-purple-500" />
              )}
            </button>

            <button
              onClick={() => setActive("full")}
              className={`relative py-4 flex items-center space-x-2 px-1 ${
                active === "full"
                  ? "text-purple-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <DatabaseIcon className="w-5 h-5" />
              <span>Full Database | フルデータベース</span>
              {active === "full" && (
                <span className="absolute left-0 right-0 bottom-0 h-[3px] rounded-full bg-purple-500" />
              )}
            </button>
          </nav>
        </div>
        <div className="h-px bg-gray-200" />
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-8">
          {active === "search" && (
           <Search searchBy={searchBy} setSearchBy={setSearchBy} />
          )}

          {active === "add" && (
           <AddNewMember />
          )}

          {active === "full" && (
           <MemberList  mounted={mounted} data={data} />
          )}
        </div>
      </main>
    </div>
  );
}

/* Inline SVG icon components */


function UserPlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {/* User head */}
      <circle cx="11" cy="7" r="4" />

      {/* User shoulders */}
      <path d="M15 14c2.761 0 5 2.239 5 5v1H4v-1c0-2.761 2.239-5 5-5h6Z" />

      {/* Plus icon (shifted right) */}
      <line x1="20.5" y1="4" x2="20.5" y2="10" />
      <line x1="17.5" y1="7" x2="23.5" y2="7" />
    </svg>
  );
}

function DatabaseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.657 3.582 3 8 3s8-1.343 8-3V5" />
      <path d="M4 11v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6" />
    </svg>
  );
}

function LogoutIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M15 3H5v18h10" />
      <path d="M10 12h10" />
      <path d="M17 9l3 3-3 3" />
    </svg>
  );
}

