import { useEffect, useState } from "react";
import { SearchIcon, SearchLargeIcon } from "./helper";
import MemberTable from "./memberTable";

type SearchProps = {
  searchBy: string;
  setSearchBy: (value: string) => void;
  fetchData: () => void;
};

const Search = ({ searchBy, setSearchBy , fetchData }: SearchProps) => {
  const [data, setData] = useState<any[]>([]);
  const [value, setValue] = useState<string>("");

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blacklist?search=${value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const result = await response.json();
      setData(result.data);
     
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-black">
          Search Blacklist | ブラックリストを検索
        </h2>
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row md:items-center gap-6 mt-4"
        >
          <div className="md:w-64">
            <label className="sr-only" htmlFor="searchBy">
              Search by | 検索条件
            </label>
            <select
              id="searchBy"
              name="searchBy"
              value={searchBy}
              onChange={(e) => {
                setSearchBy(e.target.value);
              }}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="name">Search by Name | 名前で検索</option>
              <option value="id">Search by ID | IDで検索</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="sr-only" htmlFor="query">
              Query | 検索語
            </label>
            <input
              id="query"
              type="text"
              placeholder="Enter name..."
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div className="md:pt-0 pt-1">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-5 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <SearchIcon className="w-4 h-4" />
              <span>Search | 検索</span>
            </button>
          </div>
        </form>
      </div>

      {data.length > 0 ? (
        <MemberTable data={data} fetchData={fetchData} />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 flex flex-col items-center justify-center text-center min-h-[220px]">
          <SearchLargeIcon className="w-20 h-20 text-gray-400 mb-6" />
          <p className="text-sm text-gray-600">
            No results found | 結果が見つかりません
          </p>
        </div>
      )}
    </>
  );
};

export default Search;
