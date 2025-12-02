"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

export default function Dashboard() {
  const [active, setActive] = useState<'search' | 'add' | 'full'>('full');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Gradient Header */}
      <header className="bg-gradient-to-r from-purple-800 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold leading-tight">Pioneer Service Kyoto</h1>
            <p className="text-sm opacity-90 -mt-1">Blacklist Management System</p>
          </div>
          <div className="pt-1">
            <button onClick={() => redirect('/login')} className="bg-pink-500 hover:bg-pink-600 transition-colors text-sm font-medium px-5 py-2 rounded-md flex items-center space-x-2 shadow-sm">
              <LogoutIcon className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Light Tabs Bar below header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <nav className="flex items-center space-x-10 text-sm font-medium">
            <button
              onClick={() => setActive('search')}
              className={`relative py-4 flex items-center space-x-2 px-1 ${active === 'search' ? 'text-purple-700' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <SearchIcon className="w-5 h-5" />
              <span>Search</span>
              {active === 'search' && <span className="absolute left-0 right-0 bottom-0 h-[3px] rounded-full bg-purple-500" />}
            </button>

            <button
              onClick={() => setActive('add')}
              className={`relative py-4 flex items-center space-x-2 px-1 ${active === 'add' ? 'text-purple-700' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <UserPlusIcon className="w-5 h-5" />
              <span>Add New Member</span>
              {active === 'add' && <span className="absolute left-0 right-0 bottom-0 h-[3px] rounded-full bg-purple-500" />}
            </button>

            <button
              onClick={() => setActive('full')}
              className={`relative py-4 flex items-center space-x-2 px-1 ${active === 'full' ? 'text-purple-700' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <DatabaseIcon className="w-5 h-5" />
              <span>Full Database</span>
              {active === 'full' && <span className="absolute left-0 right-0 bottom-0 h-[3px] rounded-full bg-purple-500" />}
            </button>
          </nav>
        </div>
        <div className="h-px bg-gray-200" />
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-8">
          {active === 'search' && (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-black">Search Blacklist</h2>
                 <form className="flex flex-col md:flex-row md:items-center gap-6 mt-4">
                  <div className="md:w-64">
                    <label className="sr-only" htmlFor="searchBy">Search by</label>
                    <select
                      id="searchBy"
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                      defaultValue="name"
                    >
                      <option value="name">Search by Name</option>
                      <option value="id">Search by ID</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="sr-only" htmlFor="query">Query</label>
                    <input
                      id="query"
                      type="text"
                      placeholder="Enter name..."
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <div className="md:pt-0 pt-1">
                    <button
                      type="submit"
                      className="inline-flex items-center space-x-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-5 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <SearchIcon className="w-4 h-4" />
                      <span>Search</span>
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 flex flex-col items-center justify-center text-center min-h-[220px]">
                <SearchLargeIcon className="w-20 h-20 text-gray-400 mb-6" />
                <p className="text-sm text-gray-600">No results found</p>
              </div>
            </>
          )}

          {active === 'add' && (
            <div className="max-w-3xl mx-auto px-0 sm:px-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-10">
                <h2 className="text-lg md:text-xl font-semibold mb-6 text-black">Add New Blacklist Entry</h2>
                <form className="space-y-5">
                  <div>
                    <label htmlFor="zairo" className="block text-xs font-medium text-gray-700 mb-1">Zairo Card No. *</label>
                    <input id="zairo" type="text" className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                  </div>

                  <div>
                    <label htmlFor="fullName" className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                    <input id="fullName" type="text" className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                  </div>

                  <div>
                    <label htmlFor="katakana" className="block text-xs font-medium text-gray-700 mb-1">Name (Katakana)</label>
                    <input id="katakana" type="text" className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative">
                      <label htmlFor="dob" className="block text-xs font-medium text-gray-700 mb-1">Date of birth</label>
                      <input id="dob" type="date" placeholder="mm/dd/yyyy" className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    </div>
                    <div>
                      <label htmlFor="gender" className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                      <select id="gender" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-400">
                        <option value="">Select…</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="nationality" className="block text-xs font-medium text-gray-700 mb-1">Nationality</label>
                    <input id="nationality" type="text" className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                  </div>

                  <div>
                    <label htmlFor="visaType" className="block text-xs font-medium text-gray-700 mb-1">Visa Type</label>
                    <input id="visaType" type="text" className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="joining" className="block text-xs font-medium text-gray-700 mb-1">Joining Date</label>
                      <input id="joining" type="date" placeholder="mm/dd/yyyy" className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    </div>
                    <div>
                      <label htmlFor="site" className="block text-xs font-medium text-gray-700 mb-1">Current Site Name</label>
                      <input id="site" type="text" className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="leavingDate" className="block text-xs font-medium text-gray-700 mb-1">Leaving Date</label>
                      <input id="leavingDate" type="date" placeholder="mm/dd/yyyy" className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    </div>
                    <div>
                      <label htmlFor="leavingReason" className="block text-xs font-medium text-gray-700 mb-1">Leaving Reason</label>
                      <textarea id="leavingReason" className="w-full h-28 rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="employeePhoto" className="block text-xs font-medium text-gray-700 mb-1">Employee Photo</label>
                    <input id="employeePhoto" type="file" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-black focus:outline-none" />
                  </div>

                  <div>
                    <label htmlFor="zairoPhoto" className="block text-xs font-medium text-gray-700 mb-1">Zairo Card Photo</label>
                    <input id="zairoPhoto" type="file" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-black focus:outline-none" />
                  </div>

                  <div className="pt-2">
                    <button type="submit" className="w-full rounded-md bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium py-3 shadow-sm">Add to Blacklist</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {active === 'full' && (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-black">Full Database</h2>
                <p className="text-sm text-gray-600 mt-2">Total Entries: 0</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-700 to-pink-600 text-white">
                  <div className="grid grid-cols-[1.2fr_1.6fr_1.2fr_1.1fr_1.1fr_1.1fr_1.2fr_0.9fr] gap-4 px-6 py-4 text-sm font-semibold">
                    <div>Zairo Card No.</div>
                    <div>Full Name</div>
                    <div>Nationality</div>
                    <div>Visa Type</div>
                    <div>Joining Date</div>
                    <div>Leaving Date</div>
                    <div>Current Site</div>
                    <div>Action</div>
                  </div>
                </div>

                <div className="p-10 flex items-center justify-center text-center">
                  <div>
                    <DatabaseLargeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No entries in database</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

/* Inline SVG icon components */
function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16.65" y1="16.65" x2="21" y2="21" />
    </svg>
  );
}

function SearchLargeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 48 48"
    >
      <circle cx="22" cy="22" r="14" />
      <line x1="32.5" y1="32.5" x2="44" y2="44" />
    </svg>
  );
}

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

function DatabaseLargeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 48 48"
    >
      <ellipse cx="24" cy="9" rx="16" ry="6" />
      <path d="M8 9v12c0 3.314 7.163 6 16 6s16-2.686 16-6V9" />
      <path d="M8 21v12c0 3.314 7.163 6 16 6s16-2.686 16-6V21" />
    </svg>
  );
}