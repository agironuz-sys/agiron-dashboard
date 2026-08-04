const BASE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

interface IconProps {
  size?: number;
  className?: string;
}

export function IconPlus({ size = 16, className }: IconProps) {
  return (
    <svg {...BASE} width={size} height={size} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconEdit({ size = 15, className }: IconProps) {
  return (
    <svg {...BASE} width={size} height={size} className={className}>
      <path d="M12.5 5.5 18.5 11.5 8 22H2v-6z" />
      <path d="M17 4 20 7" />
    </svg>
  );
}

export function IconTrash({ size = 15, className }: IconProps) {
  return (
    <svg {...BASE} width={size} height={size} className={className}>
      <path d="M4 7h16" />
      <path d="M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7" />
      <path d="M6 7h12l-1 13.5a1.5 1.5 0 0 1-1.5 1.5h-7a1.5 1.5 0 0 1-1.5-1.5z" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function IconCalendar({ size = 13, className }: IconProps) {
  return (
    <svg {...BASE} width={size} height={size} className={className}>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  );
}

export function IconClose({ size = 14, className }: IconProps) {
  return (
    <svg {...BASE} width={size} height={size} className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconUsers({ size = 15, className }: IconProps) {
  return (
    <svg {...BASE} width={size} height={size} className={className}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c0-3.3 2.5-5.8 5.5-5.8s5.5 2.5 5.5 5.8" />
      <path d="M16 5.3c1.5.4 2.6 1.8 2.6 3.4 0 1.6-1.1 3-2.6 3.4" />
      <path d="M15.5 14.4c2.7.3 4.9 2.6 4.9 5.6" />
    </svg>
  );
}
