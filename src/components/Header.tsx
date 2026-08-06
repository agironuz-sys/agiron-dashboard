type Theme = "light" | "dark";

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Bosh sahifa",
  tasks: "Vazifalar",
  products: "Mahsulotlar",
  warehouse: "Ombor",
  team: "Jamoa",
  files: "Fayllar",
};

export function Header({
  activeTab,
  theme,
  onThemeChange,
}: {
  activeTab: string;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
}) {
  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between border-b px-12 py-[18px] backdrop-blur-md"
      style={{ background: "var(--header-bg)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="h-7 w-7 rounded-lg"
          style={{ background: "var(--accent)" }}
          aria-hidden
        />
        <span className="font-heading text-[16px] font-semibold" style={{ color: "var(--ink)" }}>
          Agiron
        </span>
        <span className="h-4 w-px" style={{ background: "var(--border)" }} />
        <span className="font-heading text-[13.5px] font-semibold" style={{ color: "var(--ink-soft)" }}>
          {PAGE_TITLES[activeTab] || ""}
        </span>
      </div>

      <div
        className="flex items-center gap-1 rounded-full border p-1"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        {(["light", "dark"] as const).map((t) => (
          <button
            key={t}
            onClick={() => onThemeChange(t)}
            className="rounded-full px-3 py-1 text-[12px] font-medium transition-colors"
            style={{
              background: theme === t ? "var(--surface-2)" : "transparent",
              color: theme === t ? "var(--ink)" : "var(--ink-faint)",
            }}
          >
            {t === "light" ? "Kunduzgi" : "Tungi"}
          </button>
        ))}
      </div>
    </header>
  );
}
