import { DatabaseLargeIcon } from "./helper";

const MemberTable = ({data, fetchData } : {data: any[], fetchData: () => void}) => {
    const handleDelete = (id: number) => async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blacklist/${id}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            console.log(`Member with ID ${id} deleted successfully.`);
            fetchData();
          }
        } catch (error) {
          console.error("Failed to delete member:", error);
        }
      };
  

    return (
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-700 to-pink-600 text-white">
                       <th className="px-6 py-4 text-sm font-semibold text-left">
                        Employee Photo | 社員写真
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left">
                        Zairo Card No. | ザイロカード番号
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left">
                        Full Name | 氏名
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left">
                        Nationality | 国籍
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left">
                        Visa Type | ビザの種類
                      </th>
                      <th className="px-7 py-4 text-sm font-semibold text-left">
                        Joining Date | 入社日
                      </th>
                      <th className="px-7 py-4 text-sm font-semibold text-left">
                        Leaving Date | 退職日
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left">
                        Current Site | 現在のサイト
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left">
                        Action | アクション
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-10 text-center">
                          <div>
                            <DatabaseLargeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">
                              No entries in database | データベースにエントリがありません
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      data.map((entry: any) => (
                        <tr
                          key={entry.id}
                          className="border-t border-gray-100 hover:bg-gray-50"
                        >
                           <td className="px-6 py-4 text-sm text-gray-700">
                            { entry.employee_photo && (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${entry.employee_photo}`}
                              alt="Employee Photo"
                              className="w-12 h-12 rounded-full object-cover"
                            />)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {entry.card_no}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {entry.full_name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {entry.nationality}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {entry.visa_type}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {entry.joining_date}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {entry.leaving_date}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {entry.current_site_name}
                          </td>
                           <td className="px-6 py-4 text-sm text-gray-700">
                            <button onClick={handleDelete(entry.id)} className="text-red-600 hover:underline">
                              Delete | 削除
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
    );
}

export default MemberTable;