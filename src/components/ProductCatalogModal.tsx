import { useState } from "react";
import type { ReactNode } from "react";
import type { Material, ProductionMaterialLine, ProductRecipe } from "../lib/types";
import { IconClose, IconPlus } from "./icons";

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

export function ProductCatalogModal({
  recipe,
  materials,
  onClose,
  onSave,
}: {
  recipe: ProductRecipe | null;
  materials: Material[];
  onClose: () => void;
  onSave: (input: { productName: string; materials: ProductionMaterialLine[] }) => void;
}) {
  const [productName, setProductName] = useState(recipe?.productName || "");
  const [rows, setRows] = useState<Row[]>((recipe?.materials || []).map((m) => ({ ...m, key: rowKeySeq++ })));

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
    onSave({ productName: productName.trim(), materials: rows.map(({ key: _key, ...line }) => line) });
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
            {recipe ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
          </h2>
          <button onClick={onClose} style={{ color: "var(--ink-faint)" }} aria-label="Yopish">
            <IconClose />
          </button>
        </div>

        <Field label="Mahsulot nomi">
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            disabled={!!recipe}
            placeholder="Masalan: 2 metrli krovat"
            className="w-full rounded-lg border px-3 py-2 text-[13.5px] outline-none disabled:opacity-60"
            style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
          />
        </Field>

        <div className="mt-4">
          <div className="mb-1.5 text-[12px] font-medium" style={{ color: "var(--ink-soft)" }}>
            Retsept (nechta xomashyo ketadi)
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
          Saqlash
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
