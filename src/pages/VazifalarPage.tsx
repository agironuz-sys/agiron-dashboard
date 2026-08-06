import { useMemo, useState } from "react";
import type { Attachment, ChecklistItem, Employee, Task, TaskStatus } from "../lib/types";
import { TaskCard } from "../components/TaskCard";
import { TaskCreateModal } from "../components/TaskCreateModal";
import { IconPlus } from "../components/icons";

export function VazifalarPage({
  tasks,
  employees,
  onChecklistChange,
  onTaskUpdate,
  onTaskDelete,
  onTaskCreate,
}: {
  tasks: Task[];
  employees: Employee[];
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
  onTaskCreate: (input: {
    createdBy: string;
    assigneeId: string;
    description: string;
    deadlineIso: string;
    deadlineDisplay: string;
    attachments: Attachment[];
  }) => void;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const employeeById = useMemo(() => new Map(employees.map((e) => [e.id, e])), [employees]);

  const grouped = useMemo(() => {
    const filtered = filter === "all" ? tasks : tasks.filter((t) => t.assigneeId === filter);
    return employees
      .filter((e) => filter === "all" || e.id === filter)
      .map((e) => ({
        employee: e,
        tasks: filtered
          .filter((t) => t.assigneeId === e.id)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      }))
      .filter((g) => g.tasks.length > 0);
  }, [tasks, employees, filter]);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-[220px] pt-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-[30px] font-semibold" style={{ color: "var(--ink)" }}>
            Vazifalar
          </h1>
          <p className="mt-1 text-[14px]" style={{ color: "var(--ink-soft)" }}>
            Har bir xodimning vazifalari ro'yxati
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="font-heading flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-white"
          style={{ background: "var(--accent)" }}
          aria-label="Yangi vazifa"
        >
          <IconPlus size={14} /> Yangi vazifa
        </button>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto">
        <FilterChip label="Hammasi" active={filter === "all"} onClick={() => setFilter("all")} />
        {employees.map((e) => (
          <FilterChip key={e.id} label={e.name} active={filter === e.id} onClick={() => setFilter(e.id)} />
        ))}
      </div>

      <div className="mt-6 space-y-8">
        {grouped.length === 0 ? (
          <div
            className="rounded-[20px] border px-5 py-8 text-center text-[13px]"
            style={{ borderColor: "var(--border)", color: "var(--ink-soft)" }}
          >
            Vazifalar topilmadi
          </div>
        ) : (
          grouped.map((g) => (
            <div key={g.employee.id}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-heading text-[16px] font-semibold" style={{ color: "var(--ink)" }}>
                  {g.employee.name}
                </h2>
                <span className="text-[12px]" style={{ color: "var(--ink-faint)" }}>
                  {g.tasks.length} ta vazifa
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {g.tasks.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    assignee={employeeById.get(t.assigneeId)}
                    employees={employees}
                    createdByName={employeeById.get(t.createdBy)?.name || t.createdBy}
                    onChecklistChange={onChecklistChange}
                    onTaskUpdate={onTaskUpdate}
                    onTaskDelete={onTaskDelete}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {createOpen && (
        <TaskCreateModal
          employees={employees}
          onClose={() => setCreateOpen(false)}
          onSave={(input) => {
            onTaskCreate(input);
            setCreateOpen(false);
          }}
        />
      )}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors"
      style={{
        borderColor: "var(--border)",
        background: active ? "var(--accent-soft)" : "var(--surface)",
        color: active ? "var(--accent)" : "var(--ink-soft)",
      }}
    >
      {label}
    </button>
  );
}
