import { useState } from "react";
import type { ChecklistItem, Employee, Task, TaskStatus } from "../lib/types";
import { StatusBadge } from "./StatusBadge";
import { TaskEditModal } from "./TaskEditModal";
import { IconCalendar, IconClose, IconEdit, IconFile, IconTrash } from "./icons";
import { formatTashkentDateTime } from "../lib/format";

const TASK_SOURCE_LABEL: Record<Task["source"], string> = {
  voice: "🎙 Bot orqali (ovozli)",
  text: "🤖 Bot orqali",
  dashboard: "💻 Dashboarddan",
};

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function TaskCard({
  task,
  assignee,
  employees,
  createdByName,
  onChecklistChange,
  onTaskUpdate,
  onTaskDelete,
}: {
  task: Task;
  assignee?: Employee;
  employees: Employee[];
  createdByName: string;
  onChecklistChange: (taskId: string, checklist: ChecklistItem[]) => void;
  onTaskUpdate: (
    taskId: string,
    patch: {
      description: string;
      assigneeId: string;
      status: TaskStatus;
      deadlineIso: string;
      deadlineDisplay: string;
      checklist: ChecklistItem[];
    }
  ) => void;
  onTaskDelete: (taskId: string) => void;
}) {
  const [newItemText, setNewItemText] = useState("");
  const [editing, setEditing] = useState(false);
  const checklist = task.checklist || [];
  const total = checklist.length;
  const doneCount = checklist.filter((c) => c.done).length;
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : task.status === "done" ? 100 : 0;
  const assigneeName = assignee?.name || task.assigneeId;

  function toggleItem(index: number) {
    const next = checklist.map((item, i) => (i === index ? { ...item, done: !item.done } : item));
    onChecklistChange(task.id, next);
  }

  function removeItem(index: number) {
    const next = checklist.filter((_, i) => i !== index);
    onChecklistChange(task.id, next);
  }

  function addItem() {
    const text = newItemText.trim();
    if (!text) return;
    onChecklistChange(task.id, [...checklist, { text, done: false }]);
    setNewItemText("");
  }

  function handleDelete() {
    if (window.confirm("Bu vazifani o'chirishni tasdiqlaysizmi?")) {
      onTaskDelete(task.id);
    }
  }

  return (
    <div
      className="overflow-hidden rounded-2xl border"
      style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--shadow-card)" }}
    >
      <div className="h-[5px] w-full" style={{ background: "var(--surface-2)" }}>
        <div
          className="h-full transition-all"
          style={{ width: `${progress}%`, background: progress >= 100 ? "var(--success)" : "var(--accent)" }}
        />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3
            className="font-heading text-[15px] font-semibold"
            style={{
              color: task.status === "done" ? "var(--ink-faint)" : "var(--ink)",
              textDecoration: task.status === "done" ? "line-through" : "none",
            }}
          >
            {task.description}
          </h3>
          <div className="flex shrink-0 items-center gap-2">
            <span className="font-heading text-[12px] font-semibold" style={{ color: "var(--ink-soft)" }}>
              {progress}%
            </span>
            <button onClick={() => setEditing(true)} aria-label="Tahrirlash" style={{ color: "var(--ink-faint)" }}>
              <IconEdit />
            </button>
            <button onClick={handleDelete} aria-label="O'chirish" style={{ color: "var(--ink-faint)" }}>
              <IconTrash />
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={task.status} />
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium"
            style={{ background: "var(--surface-2)", color: "var(--ink-soft)" }}
          >
            <IconCalendar /> {task.deadlineDisplay || "Muddatsiz"}
          </span>
          <span className="text-[11.5px]" style={{ color: "var(--ink-faint)" }}>
            Berilgan: {formatTashkentDateTime(task.createdAt)}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[12px]" style={{ color: "var(--ink-soft)" }}>
          <span>
            <span style={{ color: "var(--ink-faint)" }}>{createdByName}</span> → {assigneeName}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium"
            style={{ background: "var(--surface-2)", color: "var(--ink-soft)" }}
          >
            {TASK_SOURCE_LABEL[task.source]}
          </span>
        </div>

        {task.attachments.length > 0 && (
          <div className="mt-2.5 space-y-1">
            {task.attachments.map((a, i) => (
              <a
                key={i}
                href={a.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[12px] underline"
                style={{ color: "var(--accent)" }}
              >
                <IconFile size={12} /> {a.name}
              </a>
            ))}
          </div>
        )}

        <div className="mt-4 space-y-1.5">
          {checklist.map((item, i) => (
            <div
              key={i}
              className="group flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-0.5 -mx-1 hover:bg-[var(--surface-2)]"
              onClick={() => toggleItem(i)}
            >
              <span
                className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border"
                style={{
                  background: item.done ? "var(--accent)" : "transparent",
                  borderColor: item.done ? "var(--accent)" : "var(--border)",
                }}
              >
                {item.done && (
                  <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="#fff" strokeWidth={2.6}>
                    <path d="m5 13 4 4 10-10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span
                className="flex-1 text-[13px]"
                style={{
                  color: item.done ? "var(--ink-faint)" : "var(--ink)",
                  textDecoration: item.done ? "line-through" : "none",
                }}
              >
                {item.text}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(i);
                }}
                className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                style={{ color: "var(--ink-faint)" }}
                aria-label="O'chirish"
              >
                <IconClose size={12} />
              </button>
            </div>
          ))}

          <div className="flex items-center gap-2 pt-1">
            <input
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
              placeholder="+ Band qo'shish"
              className="w-full rounded-lg border px-2.5 py-1.5 text-[12.5px] outline-none"
              style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t pt-3" style={{ borderColor: "var(--border)" }}>
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
          >
            {initials(assigneeName)}
          </span>
          <span className="text-[12.5px] font-medium" style={{ color: "var(--ink)" }}>
            {assigneeName}
          </span>
        </div>
      </div>

      {editing && (
        <TaskEditModal
          task={task}
          employees={employees}
          onClose={() => setEditing(false)}
          onSave={(patch) => {
            onTaskUpdate(task.id, patch);
            setEditing(false);
          }}
        />
      )}
    </div>
  );
}
