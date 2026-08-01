import { useState } from "react";
import type { ReactNode } from "react";
import type { ChecklistItem, Employee, Task, TaskStatus } from "../lib/types";
import { IconClose, IconPlus } from "./icons";

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "new", label: "Yangi" },
  { value: "in_progress", label: "Jarayonda" },
  { value: "done", label: "Bajarildi" },
  { value: "overdue", label: "Muddati o'tgan" },
];

function isoToDateInput(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function isoToTimeInput(iso: string): string {
  if (!iso) return "18:00";
  const match = iso.match(/T(\d{2}:\d{2})/);
  return match ? match[1] : "18:00";
}

export function TaskEditModal({
  task,
  employees,
  onClose,
  onSave,
}: {
  task: Task;
  employees: Employee[];
  onClose: () => void;
  onSave: (patch: {
    description: string;
    assigneeId: string;
    status: TaskStatus;
    deadlineIso: string;
    deadlineDisplay: string;
    checklist: ChecklistItem[];
  }) => void;
}) {
  const [description, setDescription] = useState(task.description);
  const [assigneeId, setAssigneeId] = useState(task.assigneeId);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [dateInput, setDateInput] = useState(isoToDateInput(task.deadlineIso));
  const [timeInput, setTimeInput] = useState(isoToTimeInput(task.deadlineIso));
  const [checklist, setChecklist] = useState<ChecklistItem[]>(task.checklist || []);

  function updateItemText(i: number, text: string) {
    setChecklist((prev) => prev.map((item, idx) => (idx === i ? { ...item, text } : item)));
  }
  function removeItem(i: number) {
    setChecklist((prev) => prev.filter((_, idx) => idx !== i));
  }
  function addItem() {
    setChecklist((prev) => [...prev, { text: "", done: false }]);
  }

  function handleSave() {
    let deadlineIso = "";
    let deadlineDisplay = "";
    if (dateInput) {
      deadlineIso = `${dateInput}T${timeInput || "18:00"}:00`;
      deadlineDisplay = `${new Date(deadlineIso).toLocaleDateString("uz-UZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })}, ${timeInput || "18:00"}`;
    }
    onSave({
      description,
      assigneeId,
      status,
      deadlineIso,
      deadlineDisplay,
      checklist: checklist.filter((c) => c.text.trim() !== ""),
    });
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl p-6"
        style={{ background: "var(--surface)", boxShadow: "var(--shadow-nav)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-[18px] font-semibold" style={{ color: "var(--ink)" }}>
            Vazifani tahrirlash
          </h2>
          <button onClick={onClose} style={{ color: "var(--ink-faint)" }} aria-label="Yopish">
            <IconClose />
          </button>
        </div>

        <Field label="Sarlavha">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-lg border px-3 py-2 text-[13.5px] outline-none"
            style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
          />
        </Field>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <Field label="Mas'ul xodim">
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-[13.5px] outline-none"
              style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
            >
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Muddat sanasi">
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-[13.5px] outline-none"
              style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
            />
          </Field>
        </div>

        <div className="mt-3">
          <Field label="Muddat vaqti">
            <input
              type="time"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              disabled={!dateInput}
              className="w-full rounded-lg border px-3 py-2 text-[13.5px] outline-none disabled:opacity-50"
              style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
            />
          </Field>
        </div>

        <div className="mt-3">
          <Field label="Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full rounded-lg border px-3 py-2 text-[13.5px] outline-none"
              style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 text-[12px] font-medium" style={{ color: "var(--ink-soft)" }}>
            Check-list
          </div>
          <div className="space-y-2">
            {checklist.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={item.text}
                  onChange={(e) => updateItemText(i, e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
                  style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
                />
                <button
                  onClick={() => removeItem(i)}
                  style={{ color: "var(--ink-faint)" }}
                  aria-label="O'chirish"
                >
                  <IconClose size={13} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addItem}
            className="mt-2 flex items-center gap-1.5 text-[13px] font-medium"
            style={{ color: "var(--accent)" }}
          >
            <IconPlus size={13} /> Band qo'shish
          </button>
        </div>

        <button
          onClick={handleSave}
          className="font-heading mt-5 w-full rounded-xl py-2.5 text-[14px] font-semibold text-white"
          style={{ background: "var(--accent)" }}
        >
          Saqlash
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-[12px] font-medium" style={{ color: "var(--ink-soft)" }}>
        {label}
      </div>
      {children}
    </div>
  );
}
