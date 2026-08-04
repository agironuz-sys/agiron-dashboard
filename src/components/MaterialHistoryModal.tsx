import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { formatTashkentDateTime } from "../lib/format";
import type { Employee, Material, MaterialMovement } from "../lib/types";
import { IconClose } from "./icons";
import { SourceTag } from "./SourceTag";

const CHANGE_LABEL: Record<MaterialMovement["changeType"], string> = {
  initial: "Boshlang'ich qoldiq",
  add: "Omborga qo'shildi",
  usage: "Ishlab chiqarishda sarflandi",
};

export function MaterialHistoryModal({
  material,
  employees,
  onClose,
}: {
  material: Material;
  employees: Employee[];
  onClose: () => void;
}) {
  const [movements, setMovements] = useState<MaterialMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .getMaterialMovements(material.id)
      .then((data) => {
        if (!cancelled) setMovements(data);
      })
      .catch((e) => console.error("getMaterialMovements failed:", e))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [material.id]);

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl p-6"
        style={{ background: "var(--surface)", boxShadow: "var(--shadow-nav)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-[18px] font-semibold" style={{ color: "var(--ink)" }}>
              {material.name}
            </h2>
            <p className="mt-0.5 text-[12.5px]" style={{ color: "var(--ink-soft)" }}>
              Omborda: {material.quantity} {material.unit}
            </p>
          </div>
          <button onClick={onClose} style={{ color: "var(--ink-faint)" }} aria-label="Yopish">
            <IconClose />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {loading ? (
            <div className="text-[13px]" style={{ color: "var(--ink-soft)" }}>
              Yuklanmoqda...
            </div>
          ) : movements.length === 0 ? (
            <div className="text-[13px]" style={{ color: "var(--ink-soft)" }}>
              Hozircha harakatlar tarixi yo'q.
            </div>
          ) : (
            movements.map((m) => {
              const actorName = employees.find((e) => e.id === m.actor)?.name;
              return (
                <div key={m.id} className="rounded-lg border px-3 py-2.5" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>
                        {CHANGE_LABEL[m.changeType]}
                        {m.note && m.changeType === "usage" ? ` — ${m.note}` : ""}
                      </div>
                      <div className="mt-0.5 text-[11.5px]" style={{ color: "var(--ink-faint)" }}>
                        {formatTashkentDateTime(m.createdAt)}
                      </div>
                    </div>
                    <div
                      className="font-heading shrink-0 text-[14px] font-semibold"
                      style={{ color: m.quantityDelta < 0 ? "var(--danger)" : "var(--success)" }}
                    >
                      {m.quantityDelta > 0 ? "+" : ""}
                      {m.quantityDelta} {material.unit}
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <SourceTag source={m.source} />
                    {actorName && (
                      <span className="text-[11px]" style={{ color: "var(--ink-faint)" }}>
                        {actorName}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
