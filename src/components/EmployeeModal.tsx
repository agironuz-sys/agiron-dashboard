import { useState } from "react";
import type { ReactNode } from "react";
import type { Employee } from "../lib/types";
import { IconClose } from "./icons";

export function EmployeeModal({
  employee,
  onClose,
  onSave,
}: {
  employee: Employee | null;
  onClose: () => void;
  onSave: (input: { name: string; role: string; responsibilities: string; telegramChatId?: string }) => void;
}) {
  const [name, setName] = useState(employee?.name || "");
  const [role, setRole] = useState(employee?.role || "");
  const [responsibilities, setResponsibilities] = useState(employee?.responsibilities || "");
  const [telegramChatId, setTelegramChatId] = useState(employee?.telegramChatId || "");

  function handleSave() {
    if (!name.trim() || !role.trim()) return;
    onSave({
      name: name.trim(),
      role: role.trim(),
      responsibilities: responsibilities.trim(),
      telegramChatId: telegramChatId.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl p-6"
        style={{ background: "var(--surface)", boxShadow: "var(--shadow-nav)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-[18px] font-semibold" style={{ color: "var(--ink)" }}>
            {employee ? "Xodimni tahrirlash" : "Yangi xodim"}
          </h2>
          <button onClick={onClose} style={{ color: "var(--ink-faint)" }} aria-label="Yopish">
            <IconClose />
          </button>
        </div>

        <Field label="Ism">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masalan: Aziz Karimov"
            className="w-full rounded-lg border px-3 py-2 text-[13.5px] outline-none"
            style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
          />
        </Field>

        <Field label="Lavozimi">
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Masalan: Payvandchi"
            className="w-full rounded-lg border px-3 py-2 text-[13.5px] outline-none"
            style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
          />
        </Field>

        <Field label="Mas'uliyat tavsifi">
          <textarea
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            rows={3}
            placeholder="Bu matnni AI o'qiydi va shunga qarab topshiriqlarni unga yuboradi — nima bilan shug'ullanishini aniq yozing."
            className="w-full resize-none rounded-lg border px-3 py-2 text-[13.5px] outline-none"
            style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
          />
        </Field>

        <Field label="Telegram chat ID (ixtiyoriy)">
          <input
            value={telegramChatId}
            onChange={(e) => setTelegramChatId(e.target.value)}
            placeholder="Bot botga /start bosgach shu raqamni yuboradi"
            className="w-full rounded-lg border px-3 py-2 text-[13.5px] outline-none"
            style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
          />
        </Field>

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
    <div className="mt-3">
      <div className="mb-1.5 text-[12px] font-medium" style={{ color: "var(--ink-soft)" }}>
        {label}
      </div>
      {children}
    </div>
  );
}
