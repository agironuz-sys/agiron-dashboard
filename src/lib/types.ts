export interface Employee {
  id: string;
  name: string;
  telegramChatId: string;
  role: string;
  responsibilities: string;
}

export type TaskStatus = "new" | "in_progress" | "done" | "overdue";

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
  source: "voice" | "text";
  checklist: ChecklistItem[];
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

export interface ProductionEntry {
  id: string;
  productName: string;
  quantityProduced: number;
  materials: ProductionMaterialLine[];
  createdBy: string;
  createdAt: string;
}

export interface MaterialMovement {
  id: string;
  materialId: string;
  changeType: "initial" | "add" | "usage";
  quantityDelta: number;
  note: string;
  actor: string;
  createdAt: string;
}
