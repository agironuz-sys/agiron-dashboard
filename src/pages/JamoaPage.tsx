import { useState } from "react";
import type { Employee } from "../lib/types";
import { EmployeeModal } from "../components/EmployeeModal";
import { IconPlus, IconTrash } from "../components/icons";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function JamoaPage({
  employees,
  onCreate,
  onUpdate,
  onDelete,
}: {
  employees: Employee[];
  onCreate: (input: { name: string; role: string; responsibilities: string; telegramChatId?: string }) => void;
  onUpdate: (id: string, input: { name: string; role: string; responsibilities: string; telegramChatId?: string }) => void;
  onDelete: (id: string) => void;
}) {
  const [modal, setModal] = useState<{ open: boolean; employee: Employee | null }>({ open: false, employee: null });

  async function handleDelete(e: Employee) {
    if (e.id === "gayrat") return;
    if (!window.confirm(`${e.name} jamoadan o'chirilsinmi? U endi hech qayerda ko'rinmaydi.`)) return;
    onDelete(e.id);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-[220px] pt-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-[30px] font-semibold" style={{ color: "var(--ink)" }}>
            Jamoa
          </h1>
          <p className="mt-1 text-[14px]" style={{ color: "var(--ink-soft)" }}>
            Xodimlar, lavozimlari va mas'uliyat sohalari
          </p>
        </div>

        <button
          onClick={() => setModal({ open: true, employee: null })}
          className="font-heading flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-white"
          style={{ background: "var(--accent)" }}
          aria-label="Yangi xodim"
        >
          <IconPlus size={14} /> Xodim qo'shish
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {employees.length === 0 ? (
          <div
            className="rounded-[20px] border px-5 py-8 text-center text-[13px]"
            style={{ borderColor: "var(--border)", color: "var(--ink-soft)" }}
          >
            Hozircha xodimlar yo'q
          </div>
        ) : (
          employees.map((e) => (
            <div
              key={e.id}
              className="cursor-pointer overflow-hidden rounded-2xl border p-5 transition-colors hover:bg-[var(--surface-2)]"
              style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--shadow-card)" }}
              onClick={() => setModal({ open: true, employee: e })}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
                    style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                  >
                    {initials(e.name)}
                  </span>
                  <div>
                    <div className="font-heading text-[15px] font-semibold" style={{ color: "var(--ink)" }}>
                      {e.name}
                    </div>
                    <div className="mt-0.5 text-[12px]" style={{ color: "var(--ink-soft)" }}>
                      {e.role || "Lavozim ko'rsatilmagan"}
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-1 text-[10.5px] font-medium"
                    style={{
                      background: e.telegramChatId ? "var(--success-soft)" : "var(--surface-2)",
                      color: e.telegramChatId ? "var(--success)" : "var(--ink-faint)",
                    }}
                  >
                    {e.telegramChatId ? "Botga ulangan" : "Botga ulanmagan"}
                  </span>
                  {e.id !== "gayrat" && (
                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        handleDelete(e);
                      }}
                      aria-label="O'chirish"
                      style={{ color: "var(--ink-faint)" }}
                    >
                      <IconTrash />
                    </button>
                  )}
                </div>
              </div>

              {e.responsibilities && (
                <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  {e.responsibilities}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {modal.open && (
        <EmployeeModal
          employee={modal.employee}
          onClose={() => setModal({ open: false, employee: null })}
          onSave={(input) => {
            if (modal.employee) {
              onUpdate(modal.employee.id, input);
            } else {
              onCreate(input);
            }
            setModal({ open: false, employee: null });
          }}
        />
      )}
    </div>
  );
}
