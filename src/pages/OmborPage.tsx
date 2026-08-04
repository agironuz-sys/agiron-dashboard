import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Employee, Material } from "../lib/types";
import { MaterialStockModal } from "../components/MaterialStockModal";
import { MaterialHistoryModal } from "../components/MaterialHistoryModal";
import { IconPlus, IconTrash } from "../components/icons";

export function OmborPage({ employees }: { employees: Employee[] }) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [historyMaterial, setHistoryMaterial] = useState<Material | null>(null);

  async function load() {
    try {
      setMaterials(await api.getMaterials());
    } catch (e) {
      console.error("OmborPage load failed:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 10_000);
    return () => clearInterval(interval);
  }, []);

  async function handleAddStock(materialId: string, addQuantity: number, actor: string) {
    await api.addMaterialStock(materialId, addQuantity, actor);
    setModalOpen(false);
    load();
  }

  async function handleCreate(input: { name: string; unit: string; initialQuantity: number; actor: string }) {
    await api.createMaterial(input);
    setModalOpen(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Bu xomashyoni o'chirishni tasdiqlaysizmi?")) return;
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    api.deleteMaterial(id).catch((e) => console.error("deleteMaterial failed:", e));
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-[220px] pt-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-[30px] font-semibold" style={{ color: "var(--ink)" }}>
            Ombor
          </h1>
          <p className="mt-1 text-[14px]" style={{ color: "var(--ink-soft)" }}>
            Xomashyo qoldiqlari
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="font-heading flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-white"
          style={{ background: "var(--accent)" }}
          aria-label="Xomashyo qo'shish"
        >
          <IconPlus size={14} /> Qo'shish
        </button>
      </div>

      <div
        className="mt-4 overflow-hidden rounded-[20px] border"
        style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--shadow-card)" }}
      >
        {loading ? (
          <div className="px-5 py-8 text-center text-[13px]" style={{ color: "var(--ink-soft)" }}>
            Yuklanmoqda...
          </div>
        ) : materials.length === 0 ? (
          <div className="px-5 py-8 text-center text-[13px]" style={{ color: "var(--ink-soft)" }}>
            Hozircha xomashyo yo'q
          </div>
        ) : (
          materials.map((m, i) => (
            <div
              key={m.id}
              role="button"
              tabIndex={0}
              onClick={() => setHistoryMaterial(m)}
              onKeyDown={(e) => e.key === "Enter" && setHistoryMaterial(m)}
              className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-[var(--surface-2)]"
              style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}
            >
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-medium" style={{ color: "var(--ink)" }}>
                  {m.name}
                </div>
                <div className="mt-0.5 text-[11.5px]" style={{ color: "var(--ink-faint)" }}>
                  {m.unit}
                </div>
              </div>
              <div
                className="font-heading text-[16px] font-semibold"
                style={{ color: m.quantity < 0 ? "var(--danger)" : "var(--ink)" }}
              >
                {m.quantity} {m.unit}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(m.id);
                }}
                aria-label="O'chirish"
                style={{ color: "var(--ink-faint)" }}
              >
                <IconTrash />
              </button>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <MaterialStockModal
          materials={materials}
          employees={employees}
          onClose={() => setModalOpen(false)}
          onAddStock={handleAddStock}
          onCreate={handleCreate}
        />
      )}

      {historyMaterial && (
        <MaterialHistoryModal material={historyMaterial} employees={employees} onClose={() => setHistoryMaterial(null)} />
      )}
    </div>
  );
}
