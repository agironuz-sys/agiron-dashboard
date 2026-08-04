import { useState } from "react";
import type { ReactNode } from "react";
import type { Employee, Material } from "../lib/types";
import { IconClose } from "./icons";
import { ToggleSwitch } from "./ToggleSwitch";

export function MaterialStockModal({
  materials,
  employees,
  onClose,
  onAddStock,
  onCreate,
}: {
  materials: Material[];
  employees: Employee[];
  onClose: () => void;
  onAddStock: (materialId: string, addQuantity: number, actor: string) => void;
  onCreate: (input: { name: string; unit: string; initialQuantity: number; actor: string }) => void;
}) {
  const hasMaterials = materials.length > 0;
  const [mode, setMode] = useState<"existing" | "new">(hasMaterials ? "existing" : "new");
  const [materialId, setMaterialId] = useState(materials[0]?.id || "");
  const [addQuantity, setAddQuantity] = useState("");
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [initialQuantity, setInitialQuantity] = useState("");
  const [actor, setActor] = useState(employees[0]?.id || "");

  function handleSubmit() {
    if (mode === "existing") {
      if (!materialId) return;
      onAddStock(materialId, Number(addQuantity) || 0, actor);
    } else {
      if (!name.trim() || !unit.trim()) return;
      onCreate({ name: name.trim(), unit: unit.trim(), initialQuantity: Number(initialQuantity) || 0, actor });
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm overflow-y-auto rounded-2xl p-6"
        style={{ background: "var(--surface)", boxShadow: "var(--shadow-nav)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-[18px] font-semibold" style={{ color: "var(--ink)" }}>
            Xomashyo
          </h2>
          <button onClick={onClose} style={{ color: "var(--ink-faint)" }} aria-label="Yopish">
            <IconClose />
          </button>
        </div>

        {hasMaterials && (
          <div className="mt-3">
            <ToggleSwitch
              value={mode}
              onChange={setMode}
              options={[
                { value: "existing", label: "Mavjud xomashyo" },
                { value: "new", label: "Yangi xomashyo" },
              ]}
            />
          </div>
        )}

        {mode === "existing" && hasMaterials ? (
          <>
            <Field label="Xomashyo">
              <select
                value={materialId}
                onChange={(e) => setMaterialId(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-[13.5px] outline-none"
                style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.unit}) — {m.quantity}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Qo'shiladigan miqdor">
              <input
                type="number"
                value={addQuantity}
                onChange={(e) => setAddQuantity(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-[13.5px] outline-none"
                style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
              />
            </Field>
          </>
        ) : (
          <>
            <Field label="Nomi">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-[13.5px] outline-none"
                style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Birlik (kg, m, dona)">
                <input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-[13.5px] outline-none"
                  style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
                />
              </Field>
              <Field label="Miqdor">
                <input
                  type="number"
                  value={initialQuantity}
                  onChange={(e) => setInitialQuantity(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-[13.5px] outline-none"
                  style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
                />
              </Field>
            </div>
          </>
        )}

        {employees.length > 0 && (
          <Field label="Kim tomonidan">
            <select
              value={actor}
              onChange={(e) => setActor(e.target.value)}
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
        )}

        <button
          onClick={handleSubmit}
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
