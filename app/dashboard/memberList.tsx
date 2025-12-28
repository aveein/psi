import { DatabaseLargeIcon } from "./helper";
import MemberTable from "./memberTable";

type MemberListProps = {
  mounted: boolean;
  data: any[];
  fetchData: () => void;
};

const MemberList = ({mounted, data , fetchData}: MemberListProps) => {
    return (
         <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-black">
                  Full Database | フルデータベース
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Total Entries | 総エントリー数: {mounted ? data.length : "—"}
                </p>
              </div>

              <MemberTable data={data} fetchData={fetchData} />
            </>
    )
};
export default MemberList;