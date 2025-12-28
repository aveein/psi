import { useRef, useState } from "react";

// export const config = { api: { bodyParser: false } };

const AddNewMember = () => {
  type FormState = {
    zairo: string;
    fullName: string;
    katakana: string;
    dob: string;
    gender: string;
    nationality: string;
    visaType: string;
    joining: string;
    site: string;
    leavingDate: string;
    leavingReason: string;
    employeePhoto: File | null;
    zairoPhoto: File | null;
  };

  const initialFormState: FormState = {
    zairo: "",
    fullName: "",
    katakana: "",
    dob: "",
    gender: "",
    nationality: "",
    visaType: "",
    joining: "",
    site: "",
    leavingDate: "",
    leavingReason: "",
    employeePhoto: null,
    zairoPhoto: null,
  };

  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const employeePhotoRef = useRef<HTMLInputElement | null>(null);
  const zairoPhotoRef = useRef<HTMLInputElement | null>(null);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const target = e.target as HTMLInputElement;
    const name = target.name;

    // File input handling
    if (target.type === "file") {
      const file = target.files?.[0] ?? null;

      setFormData((prev) => ({ ...prev, [name]: file }));
      return;
    }

    // Other inputs (text, date, select, textarea)
    const value = (e.target as HTMLInputElement).value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.zairo.trim() || !formData.fullName.trim()) {
      setError("Zairo Card No. and Full Name are required.");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("card_no", formData.zairo);
      payload.append("full_name", formData.fullName);
      payload.append("name", formData.katakana);
      payload.append("dob", formData.dob);
      payload.append("gender", formData.gender);
      payload.append("nationality", formData.nationality);
      payload.append("visa_type", formData.visaType);
      payload.append("joining_date", formData.joining);
      payload.append("current_site_name", formData.site);
      payload.append("leaving_date", formData.leavingDate);
      payload.append("leaving_reason", formData.leavingReason);
      if (formData.employeePhoto) {
        payload.append("employee_photo", formData.employeePhoto);
      }
      if (formData.zairoPhoto) {
        payload.append("card_photo", formData.zairoPhoto);
      }

      console.log("Payload prepared:", payload);

      // Post to backend API - create /api/blacklist or similar to accept FormData
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blacklist`,
        {
          method: "POST",
          // body: payload,
          // headers: {
          //   "Content-Type": "application/json",
          // },
          body: payload,
        }
      );

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.message || "Failed to add entry");
      }

      setSuccess("Entry added successfully.");
      if (employeePhotoRef.current) employeePhotoRef.current.value = "";
      if (zairoPhotoRef.current) zairoPhotoRef.current.value = "";
      // Reset form
      setFormData(initialFormState);
    } catch (err: any) {
      setError(err?.message || "Unable to add entry. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="max-w-3xl mx-auto px-0 sm:px-0">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-10">
          <h2 className="text-lg md:text-xl font-semibold mb-6 text-black">
            Add New Blacklist Entry | ブラックリストに新しいエントリを追加
          </h2>
          <form className="space-y-5" onSubmit={handleAddSubmit}>
            <div>
              <label
                htmlFor="zairo"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Zairo Card No. | ザイロカード番号 *
              </label>
              <input
                id="zairo"
                type="text"
                name="zairo"
                value={formData.zairo}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Full Name | 氏名 *
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            <div>
              <label
                htmlFor="katakana"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Name (Katakana) | 名前（カタカナ）
              </label>
              <input
                id="katakana"
                type="text"
                name="katakana"
                value={formData.katakana}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <label
                  htmlFor="dob"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Date of birth | 生年月日
                </label>
                <input
                  id="dob"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  placeholder="mm/dd/yyyy"
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label
                  htmlFor="gender"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Gender | 性別
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="">Select… | 選択してください</option>
                  <option>Male | 男性</option>
                  <option>Female | 女性</option>
                  <option>Other | その他</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="nationality"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Nationality | 国籍
              </label>
              <input
                id="nationality"
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label
                htmlFor="visaType"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Visa Type | ビザの種類
              </label>
              <input
                id="visaType"
                type="text"
                name="visaType"
                value={formData.visaType}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="joining"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Joining Date | 入社日
                </label>
                <input
                  id="joining"
                  type="date"
                  name="joining"
                  value={formData.joining}
                  onChange={handleChange}
                  placeholder="mm/dd/yyyy"
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label
                  htmlFor="site"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Current Site Name | 現在のサイト名
                </label>
                <input
                  id="site"
                  type="text"
                  name="site"
                  value={formData.site}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="leavingDate"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Leaving Date | 退職日
                </label>
                <input
                  id="leavingDate"
                  type="date"
                  name="leavingDate"
                  value={formData.leavingDate}
                  onChange={handleChange}
                  placeholder="mm/dd/yyyy"
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label
                  htmlFor="leavingReason"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Leaving Reason | 退職理由
                </label>
                <textarea
                  id="leavingReason"
                  name="leavingReason"
                  value={formData.leavingReason}
                  onChange={handleChange}
                  className="w-full h-28 rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="employeePhoto"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Employee Photo | 従業員の写真
              </label>
              <input
                id="employeePhoto"
                type="file"
                name="employeePhoto"
                accept="image/*"
                onChange={handleChange}
                  ref={employeePhotoRef}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-black focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="zairoPhoto"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Zairo Card Photo | ザイロカードの写真
              </label>
              <input
                id="zairoPhoto"
                type="file"
                name="zairoPhoto"
                accept="image/*"
                onChange={handleChange}
                 ref={zairoPhotoRef}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-black focus:outline-none"
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
            {success && <div className="text-sm text-green-600">{success}</div>}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium py-3 shadow-sm disabled:opacity-50"
              >
                {loading ? "Adding…" : "Add to Blacklist"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddNewMember;
