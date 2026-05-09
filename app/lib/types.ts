export type Role = "admin" | "editor" | "site";

export type User = {
  id: number;
  username: string;
  role: Role;
  site: string | null;
};

export type Status = "resigned" | "fired" | "blacklisted" | "transfer";

export type EmploymentRecord = {
  id: number;
  empId: number;
  site: string | null;
  joining: string | null;
  leaving: string | null;
  status: Status;
  reason: string | null;
  approved: boolean;
  approvedBy: string | null;
  approvedAt: string | null;
  requestedBy: string | null;
  createdAt: string;
};

export type Employee = {
  id: number;
  zairo: string;
  name: string;
  kana: string | null;
  dob: string | null;
  gender: string | null;
  nationality: string | null;
  visa: string | null;
  photo: string | null;
  custom: Record<string, any>;
  createdBy: string | null;
  createdAt: string;
  records?: EmploymentRecord[];
};

export type TransferRequest = {
  id: number;
  empId: number;
  fromSite: string | null;
  toSite: string | null;
  notes: string | null;
  requestedBy: string | null;
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
  resolvedBy: string | null;
  resolvedAt: string | null;
  employee?: Employee;
};

export type Site = { id: number; name: string };
export type CustomField = {
  id: number;
  label: string;
  type: "text" | "number" | "date" | "email" | "select" | "textarea" | "image" | "file" | "phone";
  options: string | null;
  required: boolean;
  enabled: boolean;
};

export type Permissions = Record<Role, Record<string, boolean>>;

export type AuditLog = {
  id: number;
  action: string;
  detail: string;
  user: string;
  createdAt: string;
};

export type RecycleItem = {
  id: number;
  entityType: "employee" | "record" | "user" | "field" | "site";
  label: string;
  payload: any;
  deletedBy: string;
  deletedFrom: string;
  createdAt: string;
};

export const STATUS_META: Record<Status, { label: string; jp: string; badge: string }> = {
  resigned: { label: "Resigned", jp: "退職", badge: "b-resigned" },
  fired: { label: "Fired", jp: "解雇", badge: "b-fired" },
  blacklisted: { label: "Blacklisted", jp: "入社拒否", badge: "b-blacklisted" },
  transfer: { label: "Transfer", jp: "異動", badge: "b-transfer" },
};

export const NATIONS = [
  "Afghani", "Bangladeshi", "Burmese", "Cambodian", "Chinese", "Filipino",
  "Indian", "Indonesian", "Nepali", "Pakistani", "South Korean", "Sri Lankan",
  "Thai", "Vietnamese", "Other",
];

export const JP_VISAS = [
  "技能実習 (Ginou Jisshu)",
  "特定技能1号 (SSW Type 1)",
  "特定技能2号 (SSW Type 2)",
  "技術・人文知識・国際業務 (Engineer/Specialist)",
  "高度専門職 (Highly Skilled)",
  "経営・管理 (Business Manager)",
  "就労 (Work Visa)",
  "留学 (Student)",
  "家族滞在 (Dependent)",
  "永住者 (Permanent Resident)",
  "日本人の配偶者等 (Spouse of Japanese)",
  "定住者 (Long-term Resident)",
  "文化活動 (Cultural Activities)",
  "その他 (Other)",
];

export const FIELD_TYPES = [
  "text", "number", "date", "email", "select", "textarea", "image", "file", "phone",
] as const;
