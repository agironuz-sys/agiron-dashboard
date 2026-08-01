import { useState } from "react";
import type { ReactNode } from "react";
import type { Employee } from "../lib/types";
import { IconClose } from "./icons";

export function TaskCreateModal({
  employees,
  onClose,
  onSave,
}: {
  employees: Employee[];
  onClose: () => void;
  onSave: (input: {
    createdBy: string;
    assigneeId: string;
    description: string;
    deadlineIso: string;
    deadlineDisplay: string;
  }) => void;
}) {
  const [description, setDescription] = useState("");
  const [createdBy, setCreatedBy] = useState(employees[0]?.id || "");
  const [assigneeId, setAssigneeId] = useState(employees[0]?.id || "");
  const [dateInput, setDateInput] = useState("");

  function handleSave() {
    if (!description.trim() || !assigneeId) return;
    let deadlineIso = "";
    let deadlineDisplay = "";
    if (dateInput) {
      deadlineIso = `${dateInput}T18:00:00`;
      deadlineDisplay = new Date(deadlineIso).toLocaleDateString("uz-UZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
    onSave({ createdBy, assigneeId, description: description.trim(), deadlineIso, deadlineDisplay });
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md overflow-y-auto rounded-2xl p-6"
        style={{ background: "var(--surface)", boxShadow: "var(--shadow-nav)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-[18px] font-semibold" style={{ color: "var(--ink)" }}>
            Yangi vazifa
          </h2>
          <button onClick={onClose} style={{ color: "var(--ink-faint)" }} aria-label="Yopish">
            <IconClose />
          </button>
        </div>

        <Field label="Vazifa tavsifi">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Masalan: 300 metr 3x3 profil sotib olish"
            className="w-full resize-none rounded-lg border px-3 py-2 text-[13.5px] outline-none"
            style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
          />
        </Field>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <Field label="Kimga">
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
          <Field label="Muddat (ixtiyoriy)">
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
          <Field label="Kim tomonidan">
            <select
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
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
        </div>

        <button
          onClick={handleSave}
          className="font-heading mt-5 w-full rounded-xl py-2.5 text-[14px] font-semibold text-white"
          style={{ background: "var(--accent)" }}
        >
          Vazifa yaratish
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
