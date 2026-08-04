import { useState } from "react";
import type { ReactNode } from "react";
import type { Employee } from "../lib/types";
import { IconClose } from "./icons";

const BOSS_BOT_USERNAME = "agironaiassistantbot";

export function EmployeeModal({
  employee,
  onClose,
  onSave,
}: {
  employee: Employee | null;
  onClose: () => void;
  onSave: (input: { name: string; role: string; responsibilities: string }) => void;
}) {
  const [name, setName] = useState(employee?.name || "");
  const [role, setRole] = useState(employee?.role || "");
  const [responsibilities, setResponsibilities] = useState(employee?.responsibilities || "");
  const [copied, setCopied] = useState(false);

  const inviteLink = employee ? `https://t.me/${BOSS_BOT_USERNAME}?start=${employee.inviteToken}` : "";

  function handleSave() {
    if (!name.trim() || !role.trim()) return;
    onSave({ name: name.trim(), role: role.trim(), responsibilities: responsibilities.trim() });
  }

  function handleCopy() {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
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

        {employee && (
          <Field label="Botga ulanish">
            <div
              className="rounded-lg border p-3"
              style={{ borderColor: "var(--border)", background: "var(--bg)" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                  style={{
                    background: employee.telegramChatId ? "var(--success-soft)" : "var(--surface-2)",
                    color: employee.telegramChatId ? "var(--success)" : "var(--ink-faint)",
                  }}
                >
                  {employee.telegramChatId ? "Ulangan" : "Hali ulanmagan"}
                </span>
              </div>

              {employee.id === "gayrat" && employee.telegramChatId ? (
                <p className="mt-2 text-[12px]" style={{ color: "var(--ink-soft)" }}>
                  🔒 Rahbar profili allaqachon ulangan. Xavfsizlik uchun havola faqat bir marta ishlaydi va
                  qayta ishlatib bo'lmaydi — hatto kimdir uni topib olsa ham, rahbar huquqini ololmaydi. Qayta
                  ulash kerak bo'lsa (masalan, telefon almashtirilganda), dasturchiga murojaat qiling.
                </p>
              ) : (
                <>
                  <p className="mt-2 text-[12px]" style={{ color: "var(--ink-soft)" }}>
                    Bu shaxsiy havolani {employee.name}ga yuboring — u havolani ochib botni bossagina, tizim uni
                    avtomatik tanib oladi, hech narsa nusxalab yuborish shart emas.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div
                      className="min-w-0 flex-1 truncate rounded-lg border px-2.5 py-1.5 text-[12px]"
                      style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--ink)" }}
                    >
                      {inviteLink}
                    </div>
                    <button
                      onClick={handleCopy}
                      className="font-heading shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white"
                      style={{ background: "var(--accent)" }}
                    >
                      {copied ? "Nusxalandi!" : "Nusxalash"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </Field>
        )}

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
