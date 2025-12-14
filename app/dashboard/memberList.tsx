import { DatabaseLargeIcon } from "./helper";
import MemberTable from "./memberTable";

type MemberListProps = {
  mounted: boolean;
  data: any[];
};

const MemberList = ({mounted, data}: MemberListProps) => {
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

              <MemberTable data={data} />
            </>
    )
};
export default MemberList;