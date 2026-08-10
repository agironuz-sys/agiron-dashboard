import { useState } from "react";
import type { ReactNode } from "react";
import type { Employee } from "../lib/types";
import { IconClose } from "./icons";

const BOSS_BOT_USERNAME = "agironaiassistantbot";
const NOTIFY_BOT_USERNAME = "agironeslatmabot";

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
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const bossLink = employee ? `https://t.me/${BOSS_BOT_USERNAME}?start=${employee.inviteToken}` : "";
  const notifyLink = employee ? `https://t.me/${NOTIFY_BOT_USERNAME}?start=${employee.inviteToken}` : "";

  function handleSave() {
    if (!name.trim() || !role.trim()) return;
    onSave({ name: name.trim(), role: role.trim(), responsibilities: responsibilities.trim() });
  }

  function handleCopy(key: string, link: string) {
    navigator.clipboard.writeText(link).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
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
          <Field label="Botlarga ulanish">
            <div className="space-y-2">
              <p className="text-[12px]" style={{ color: "var(--ink-soft)" }}>
                Ikkalasi ham mustaqil — istalgan tartibda, faqat kerakli havolani bosish yetarli. Hech narsani
                qo'lda ko'chirib yuborish shart emas.
              </p>

              {employee.id === "gayrat" && employee.telegramChatId && employee.notifyConnected ? (
                <p className="mt-1 text-[12px]" style={{ color: "var(--ink-soft)" }}>
                  🔒 Rahbar profili allaqachon ulangan. Xavfsizlik uchun havolalar faqat bir marta ishlaydi.
                  Qayta ulash kerak bo'lsa (masalan, telefon almashtirilganda), dasturchiga murojaat qiling.
                </p>
              ) : (
                <>
                  <ConnectRow
                    label="Asosiy bot"
                    hint="vazifalar, ombor, ishlab chiqarish"
                    connected={!!employee.telegramChatId}
                    link={bossLink}
                    copied={copiedKey === "boss"}
                    onCopy={() => handleCopy("boss", bossLink)}
                  />
                  <ConnectRow
                    label="Eslatma bot"
                    hint="bildirishnoma va eslatmalar"
                    connected={employee.notifyConnected}
                    link={notifyLink}
                    copied={copiedKey === "notify"}
                    onCopy={() => handleCopy("notify", notifyLink)}
                  />
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

function ConnectRow({
  label,
  hint,
  connected,
  link,
  copied,
  onCopy,
}: {
  label: string;
  hint: string;
  connected: boolean;
  link: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-lg border p-3" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="text-[12.5px] font-medium" style={{ color: "var(--ink)" }}>
            {label}
          </span>
          <span className="ml-1.5 text-[11px]" style={{ color: "var(--ink-faint)" }}>
            {hint}
          </span>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium"
          style={{
            background: connected ? "var(--success-soft)" : "var(--surface-2)",
            color: connected ? "var(--success)" : "var(--ink-faint)",
          }}
        >
          {connected ? "Ulangan" : "Hali ulanmagan"}
        </span>
      </div>

      {!connected && (
        <div className="mt-2 flex items-center gap-2">
          <div
            className="min-w-0 flex-1 truncate rounded-lg border px-2.5 py-1.5 text-[12px]"
            style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--ink)" }}
          >
            {link}
          </div>
          <button
            onClick={onCopy}
            className="font-heading shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white"
            style={{ background: "var(--accent)" }}
          >
            {copied ? "Nusxalandi!" : "Nusxalash"}
          </button>
        </div>
      )}
    </div>
  );
}
