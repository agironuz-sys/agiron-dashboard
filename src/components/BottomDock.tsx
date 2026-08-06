import type { ReactNode } from "react";

interface DockItem {
  key: string;
  label: string;
  icon: ReactNode;
}

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  width: 15,
  height: 15,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ITEMS: DockItem[] = [
  {
    key: "dashboard",
    label: "Bosh sahifa",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
      </svg>
    ),
  },
  {
    key: "tasks",
    label: "Vazifalar",
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="m8 12 2.5 2.5L16 9" />
      </svg>
    ),
  },
  {
    key: "products",
    label: "Mahsulotlar",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M21 8 12 3 3 8l9 5 9-5Z" />
        <path d="M3 8v8l9 5 9-5V8" />
        <path d="M12 13v8" />
      </svg>
    ),
  },
  {
    key: "warehouse",
    label: "Ombor",
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="3" y="4" width="18" height="4.2" rx="1.2" />
        <path d="M5 8.2V18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.2" />
        <path d="M10 12.5h4" />
      </svg>
    ),
  },
  {
    key: "team",
    label: "Jamoa",
    icon: (
      <svg {...ICON_PROPS}>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 20c0-3.3 2.5-5.8 5.5-5.8s5.5 2.5 5.5 5.8" />
        <path d="M16 5.3c1.5.4 2.6 1.8 2.6 3.4 0 1.6-1.1 3-2.6 3.4" />
        <path d="M15.5 14.4c2.7.3 4.9 2.6 4.9 5.6" />
      </svg>
    ),
  },
  {
    key: "files",
    label: "Fayllar",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M6 2.5h8l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 20V4a1.5 1.5 0 0 1 1.5-1.5Z" />
        <path d="M14 2.5V7h4" />
      </svg>
    ),
  },
];

export function BottomDock({ active, onChange }: { active: string; onChange: (key: string) => void }) {
  return (
    <nav
      className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-1 overflow-x-auto rounded-full px-2 py-2"
      style={{
        background: "linear-gradient(180deg,#1d1c22,#0f0e13)",
        boxShadow: "var(--shadow-nav)",
        scrollbarWidth: "none",
      }}
    >
      {ITEMS.map((item) => {
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className="flex shrink-0 flex-col items-center gap-1 rounded-2xl px-4 py-2 transition-colors"
            style={{
              background: isActive ? "rgba(255,255,255,0.14)" : "transparent",
              color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
            }}
          >
            {item.icon}
            <span className="font-heading text-[9.5px] font-medium whitespace-nowrap">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
