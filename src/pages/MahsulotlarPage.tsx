import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Employee, Material, ProductionEntry, ProductionMaterialLine, ProductRecipe } from "../lib/types";
import { ProductionEntryModal } from "../components/ProductionEntryModal";
import { IconPlus, IconTrash } from "../components/icons";
import { formatTashkentDateTime } from "../lib/format";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function MahsulotlarPage({ employees }: { employees: Employee[] }) {
  const [entries, setEntries] = useState<ProductionEntry[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [recipes, setRecipes] = useState<ProductRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    try {
      const [entriesData, materialsData, recipesData] = await Promise.all([
        api.getProduction(),
        api.getMaterials(),
        api.getProducts(),
      ]);
      setEntries(entriesData);
      setMaterials(materialsData);
      setRecipes(recipesData);
    } catch (e) {
      console.error("MahsulotlarPage load failed:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function employeeName(id: string): string {
    return employees.find((e) => e.id === id)?.name || id;
  }

  async function handleSave(input: {
    productName: string;
    quantityProduced: number;
    createdBy: string;
    materials: ProductionMaterialLine[];
  }) {
    await api.createProduction(input);
    setModalOpen(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Bu yozuvni o'chirishni tasdiqlaysizmi?")) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
    api.deleteProduction(id).catch((e) => console.error("deleteProduction failed:", e));
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-[220px] pt-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-[30px] font-semibold" style={{ color: "var(--ink)" }}>
            Mahsulotlar
          </h1>
          <p className="mt-1 text-[14px]" style={{ color: "var(--ink-soft)" }}>
            Ishlab chiqarish tarixi va sarflangan xomashyo
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="font-heading flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-white"
          style={{ background: "var(--accent)" }}
          aria-label="Yangi yozuv qo'shish"
        >
          <IconPlus size={14} /> Yozuv qo'shish
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {loading ? (
          <div className="text-[13px]" style={{ color: "var(--ink-soft)" }}>
            Yuklanmoqda...
          </div>
        ) : entries.length === 0 ? (
          <div
            className="rounded-[20px] border px-5 py-8 text-center text-[13px]"
            style={{ borderColor: "var(--border)", color: "var(--ink-soft)" }}
          >
            Hozircha ishlab chiqarish yozuvlari yo'q
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="overflow-hidden rounded-2xl border p-5"
              style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-heading text-[15px] font-semibold" style={{ color: "var(--ink)" }}>
                  {entry.productName}
                </h3>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-1 text-[11.5px] font-medium"
                    style={{ background: "var(--surface-2)", color: "var(--ink-soft)" }}
                  >
                    {entry.quantityProduced} dona
                  </span>
                  <button onClick={() => handleDelete(entry.id)} aria-label="O'chirish" style={{ color: "var(--ink-faint)" }}>
                    <IconTrash />
                  </button>
                </div>
              </div>

              <div className="mt-1.5 text-[11.5px]" style={{ color: "var(--ink-faint)" }}>
                Berilgan: {formatTashkentDateTime(entry.createdAt)}
              </div>

              <div className="mt-3 space-y-1.5">
                {entry.materials.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-[13px]" style={{ color: "var(--ink)" }}>
                    <span className="flex-1">
                      {m.materialName} — {m.quantity} {m.unit}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10.5px] font-medium"
                      style={{
                        background: m.source === "company" ? "var(--accent-soft)" : "var(--surface-2)",
                        color: m.source === "company" ? "var(--accent)" : "var(--ink-soft)",
                      }}
                    >
                      {m.source === "company" ? "Ombordan" : "Mijozniki"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 border-t pt-3" style={{ borderColor: "var(--border)" }}>
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold"
                  style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                >
                  {initials(employeeName(entry.createdBy))}
                </span>
                <span className="text-[12.5px] font-medium" style={{ color: "var(--ink)" }}>
                  {employeeName(entry.createdBy)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <ProductionEntryModal
          recipes={recipes}
          materials={materials}
          employees={employees}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
