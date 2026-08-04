import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Employee, Material, ProductionEntry, ProductionMaterialLine, ProductRecipe } from "../lib/types";
import { ProductionEntryModal } from "../components/ProductionEntryModal";
import { ProductCatalogModal } from "../components/ProductCatalogModal";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { IconPlus, IconTrash } from "../components/icons";
import { SourceTag } from "../components/SourceTag";
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
  const [tab, setTab] = useState<"catalog" | "production">("production");
  const [entries, setEntries] = useState<ProductionEntry[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [recipes, setRecipes] = useState<ProductRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [catalogModal, setCatalogModal] = useState<{ open: boolean; recipe: ProductRecipe | null }>({
    open: false,
    recipe: null,
  });

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
    const interval = setInterval(load, 10_000);
    return () => clearInterval(interval);
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

  async function handleSaveRecipe(input: { productName: string; materials: ProductionMaterialLine[] }) {
    await api.saveProduct(input);
    setCatalogModal({ open: false, recipe: null });
    load();
  }

  async function handleDeleteRecipe(productName: string) {
    if (!window.confirm(`"${productName}" katalogdan o'chirilsinmi?`)) return;
    setRecipes((prev) => prev.filter((r) => r.productName !== productName));
    api.deleteProduct(productName).catch((e) => console.error("deleteProduct failed:", e));
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-[220px] pt-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-[30px] font-semibold" style={{ color: "var(--ink)" }}>
            Mahsulotlar
          </h1>
          <p className="mt-1 text-[14px]" style={{ color: "var(--ink-soft)" }}>
            {tab === "catalog" ? "Kompaniya mahsulotlari katalogi" : "Ishlab chiqarish tarixi va sarflangan xomashyo"}
          </p>
        </div>

        <button
          onClick={() => (tab === "catalog" ? setCatalogModal({ open: true, recipe: null }) : setModalOpen(true))}
          className="font-heading flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-white"
          style={{ background: "var(--accent)" }}
          aria-label={tab === "catalog" ? "Yangi mahsulot" : "Yangi yozuv qo'shish"}
        >
          <IconPlus size={14} /> {tab === "catalog" ? "Mahsulot qo'shish" : "Yozuv qo'shish"}
        </button>
      </div>

      <div className="mt-5 max-w-xs">
        <ToggleSwitch
          value={tab}
          onChange={setTab}
          options={[
            { value: "catalog", label: "Katalog" },
            { value: "production", label: "Ishlab chiqarish" },
          ]}
        />
      </div>

      {tab === "catalog" ? (
        <div className="mt-4 space-y-3">
          {loading ? (
            <div className="text-[13px]" style={{ color: "var(--ink-soft)" }}>
              Yuklanmoqda...
            </div>
          ) : recipes.length === 0 ? (
            <div
              className="rounded-[20px] border px-5 py-8 text-center text-[13px]"
              style={{ borderColor: "var(--border)", color: "var(--ink-soft)" }}
            >
              Hozircha katalogda mahsulot yo'q
            </div>
          ) : (
            recipes.map((recipe) => (
              <div
                key={recipe.productName}
                className="cursor-pointer overflow-hidden rounded-2xl border p-5 transition-colors hover:bg-[var(--surface-2)]"
                style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--shadow-card)" }}
                onClick={() => setCatalogModal({ open: true, recipe })}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-heading text-[15px] font-semibold" style={{ color: "var(--ink)" }}>
                    {recipe.productName}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRecipe(recipe.productName);
                    }}
                    aria-label="O'chirish"
                    style={{ color: "var(--ink-faint)" }}
                  >
                    <IconTrash />
                  </button>
                </div>
                <div className="mt-3 space-y-1.5">
                  {recipe.materials.map((m, i) => (
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
              </div>
            ))
          )}
        </div>
      ) : (
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

                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="text-[11.5px]" style={{ color: "var(--ink-faint)" }}>
                    Berilgan: {formatTashkentDateTime(entry.createdAt)}
                  </span>
                  <SourceTag source={entry.source} />
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
      )}

      {modalOpen && (
        <ProductionEntryModal
          recipes={recipes}
          materials={materials}
          employees={employees}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {catalogModal.open && (
        <ProductCatalogModal
          recipe={catalogModal.recipe}
          materials={materials}
          onClose={() => setCatalogModal({ open: false, recipe: null })}
          onSave={handleSaveRecipe}
        />
      )}
    </div>
  );
}
