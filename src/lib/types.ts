export interface Employee {
  id: string;
  name: string;
  telegramChatId: string;
  role: string;
  responsibilities: string;
  inviteToken: string;
  notifyConnected: boolean;
}

export type TaskStatus = "new" | "in_progress" | "done" | "overdue";

/** Which surface an action was performed through — shown in history views. */
export type ActivitySource = "bot" | "dashboard";

export interface ChecklistItem {
  text: string;
  done: boolean;
}

export interface Task {
  id: string;
  createdAt: string;
  createdBy: string;
  assigneeId: string;
  description: string;
  deadlineIso: string;
  deadlineDisplay: string;
  status: TaskStatus;
  completedAt: string;
  lastReminderAt: string;
  morningNotifiedAt: string;
  eveningCheckedAt: string;
  source: "voice" | "text" | "dashboard";
  checklist: ChecklistItem[];
  attachments: Attachment[];
}

export interface ReportRow {
  employee: Employee;
  open: number;
  overdue: number;
  doneToday: number;
}

export interface TodayReport {
  date: string;
  report: ReportRow[];
}

export interface Material {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  usageCount: number;
  createdAt: string;
}

export type MaterialSource = "company" | "client";

export interface ProductionMaterialLine {
  materialId: string;
  materialName: string;
  unit: string;
  quantity: number;
  source: MaterialSource;
}

export interface ProductRecipe {
  productName: string;
  materials: ProductionMaterialLine[];
  updatedAt: string;
}

export interface Attachment {
  url: string;
  name: string;
}

export interface FileRecord {
  id: string;
  fileNumber: number;
  name: string;
  url: string;
  contentType: string;
  uploadedBy: string;
  source: ActivitySource;
  createdAt: string;
}

export interface ProductionEntry {
  id: string;
  productName: string;
  quantityProduced: number;
  materials: ProductionMaterialLine[];
  createdBy: string;
  createdAt: string;
  source: ActivitySource;
}

export interface MaterialMovement {
  id: string;
  materialId: string;
  changeType: "initial" | "add" | "usage";
  quantityDelta: number;
  note: string;
  actor: string;
  source: ActivitySource;
  createdAt: string;
}
