import type { ActivitySource } from "../lib/types";

export function SourceTag({ source }: { source: ActivitySource }) {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium"
      style={{ background: "var(--surface-2)", color: "var(--ink-soft)" }}
    >
      {source === "bot" ? "🤖 Bot orqali" : "💻 Dashboarddan"}
    </span>
  );
}
