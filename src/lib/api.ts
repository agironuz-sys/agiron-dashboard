import type {
  ChecklistItem,
  Employee,
  Material,
  MaterialMovement,
  ProductionEntry,
  ProductionMaterialLine,
  ProductRecipe,
  Task,
  TaskStatus,
  TodayReport,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API xatosi: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

async function patchJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`API xatosi: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`API xatosi: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

async function del(path: string): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(`API xatosi: ${res.status} ${res.statusText}`);
  }
}

export interface TaskCreateInput {
  createdBy: string;
  assigneeId: string;
  description: string;
  deadlineIso?: string;
  deadlineDisplay?: string;
}

export interface TaskPatch {
  assigneeId?: string;
  description?: string;
  deadlineIso?: string;
  deadlineDisplay?: string;
  status?: TaskStatus;
  checklist?: ChecklistItem[];
}

export interface ProductionEntryInput {
  productName: string;
  quantityProduced: number;
  createdBy: string;
  materials: ProductionMaterialLine[];
}

export const api = {
  getEmployees: () => getJson<Employee[]>("/api/employees"),
  getTasks: () => getJson<Task[]>("/api/tasks"),
  createTask: (input: TaskCreateInput) => postJson<Task>("/api/tasks", input),
  getTodayReport: () => getJson<TodayReport>("/api/report/today"),
  updateChecklist: (taskId: string, checklist: ChecklistItem[]) =>
    patchJson(`/api/tasks/${taskId}/checklist`, { checklist }),
  updateTask: (taskId: string, patch: TaskPatch) => patchJson(`/api/tasks/${taskId}`, patch),
  deleteTask: (taskId: string) => del(`/api/tasks/${taskId}`),

  getMaterials: () => getJson<Material[]>("/api/materials"),
  createMaterial: (input: { name: string; unit: string; initialQuantity: number }) =>
    postJson<Material>("/api/materials", input),
  addMaterialStock: (materialId: string, addQuantity: number) =>
    patchJson<Material>(`/api/materials/${materialId}`, { addQuantity }),
  getMaterialMovements: (materialId: string) => getJson<MaterialMovement[]>(`/api/materials/${materialId}/movements`),

  getProducts: () => getJson<ProductRecipe[]>("/api/products"),

  getProduction: () => getJson<ProductionEntry[]>("/api/production"),
  createProduction: (input: ProductionEntryInput) => postJson<ProductionEntry>("/api/production", input),
  deleteProduction: (id: string) => del(`/api/production/${id}`),
};
