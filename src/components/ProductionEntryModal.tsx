import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Employee, Material, ProductionMaterialLine, ProductRecipe } from "../lib/types";
import { IconClose, IconPlus } from "./icons";
import { ToggleSwitch } from "./ToggleSwitch";

interface Row extends ProductionMaterialLine {
  key: number;
}

let rowKeySeq = 0;
function newRow(materials: Material[]): Row {
  const first = materials[0];
  return {
    key: rowKeySeq++,
    materialId: first?.id || "",
    materialName: first?.name || "",
    unit: first?.unit || "",
    quantity: 0,
    source: "company",
  };
}

export function ProductionEntryModal({
  recipes,
  materials,
  employees,
  onClose,
  onSave,
}: {
  recipes: ProductRecipe[];
  materials: Material[];
  employees: Employee[];
  onClose: () => void;
  onSave: (input: {
    productName: string;
    quantityProduced: number;
    createdBy: string;
    materials: ProductionMaterialLine[];
  }) => void;
}) {
  const [productName, setProductName] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [quantityProduced, setQuantityProduced] = useState("1");
  const [createdBy, setCreatedBy] = useState(employees[0]?.id || "");
  const [rows, setRows] = useState<Row[]>([]);

  const suggestions = useMemo(() => {
    const q = productName.trim().toLowerCase();
    if (!q) return recipes.slice(0, 8);
    return recipes.filter((r) => r.productName.toLowerCase().includes(q)).slice(0, 8);
  }, [productName, recipes]);

  function selectProduct(name: string) {
    setProductName(name);
    setShowSuggestions(false);
    const recipe = recipes.find((r) => r.productName === name);
    if (recipe) {
      setRows(recipe.materials.map((m) => ({ ...m, key: rowKeySeq++ })));
    }
  }

  function updateRow(key: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function updateRowMaterial(key: number, materialId: string) {
    const material = materials.find((m) => m.id === materialId);
    updateRow(key, { materialId, materialName: material?.name || "", unit: material?.unit || "" });
  }

  function removeRow(key: number) {
    setRows((prev) => prev.filter((r) => r.key !== key));
  }

  function addRow() {
    setRows((prev) => [...prev, newRow(materials)]);
  }

  function handleSave() {
    if (!productName.trim() || rows.length === 0) return;
    onSave({
      productName: productName.trim(),
      quantityProduced: Number(quantityProduced) || 1,
      createdBy,
      materials: rows.map(({ key: _key, ...line }) => line),
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
            Ishlab chiqarish yozuvi
          </h2>
          <button onClick={onClose} style={{ color: "var(--ink-faint)" }} aria-label="Yopish">
            <IconClose />
          </button>
        </div>

        <Field label="Mahsulot nomi">
          <div className="relative">
            <input
              value={productName}
              onChange={(e) => {
                setProductName(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Masalan: 2 metrli krovat"
              className="w-full rounded-lg border px-3 py-2 text-[13.5px] outline-none"
              style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div
                className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border"
                style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--shadow-card)" }}
              >
                {suggestions.map((s) => (
                  <button
                    key={s.productName}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectProduct(s.productName);
                    }}
                    className="block w-full px-3 py-2 text-left text-[13px] hover:bg-[var(--surface-2)]"
                    style={{ color: "var(--ink)" }}
                  >
                    {s.productName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Field>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <Field label="Necha dona">
            <input
              type="number"
              value={quantityProduced}
              onChange={(e) => setQuantityProduced(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-[13.5px] outline-none"
              style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
            />
          </Field>
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

        <div className="mt-4">
          <div className="mb-1.5 text-[12px] font-medium" style={{ color: "var(--ink-soft)" }}>
            Sarflangan xomashyo
          </div>
          {materials.length === 0 ? (
            <div className="text-[12.5px]" style={{ color: "var(--ink-faint)" }}>
              Avval Ombor bo'limida xomashyo qo'shing.
            </div>
          ) : (
          <div className="space-y-2">
            {rows.map((row) => (
              <div key={row.key} className="rounded-lg border p-2" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2">
                  <select
                    value={row.materialId}
                    onChange={(e) => updateRowMaterial(row.key, e.target.value)}
                    className="min-w-0 flex-1 rounded-lg border px-2 py-1.5 text-[13px] outline-none"
                    style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
                  >
                    {materials.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.unit})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={row.quantity === 0 ? "" : row.quantity}
                    onChange={(e) => updateRow(row.key, { quantity: e.target.value === "" ? 0 : Number(e.target.value) })}
                    placeholder="0"
                    className="w-20 rounded-lg border px-2 py-1.5 text-[13px] outline-none"
                    style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
                  />
                  <button onClick={() => removeRow(row.key)} style={{ color: "var(--ink-faint)" }} aria-label="O'chirish">
                    <IconClose size={13} />
                  </button>
                </div>
                <div className="mt-2">
                  <ToggleSwitch
                    size="sm"
                    value={row.source}
                    onChange={(source) => updateRow(row.key, { source })}
                    options={[
                      { value: "company", label: "Ombordan" },
                      { value: "client", label: "Mijozniki" },
                    ]}
                  />
                </div>
              </div>
            ))}
          </div>
          )}
          {materials.length > 0 && (
            <button
              onClick={addRow}
              className="mt-2 flex items-center gap-1.5 text-[13px] font-medium"
              style={{ color: "var(--accent)" }}
            >
              <IconPlus size={13} /> Xomashyo qo'shish
            </button>
          )}
        </div>

        <button
          onClick={handleSave}
          className="font-heading mt-5 w-full rounded-xl py-2.5 text-[14px] font-semibold text-white"
          style={{ background: "var(--accent)" }}
        >
          Tasdiqlash va qo'shish
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
