const TASHKENT_TZ = "Asia/Tashkent";

export function formatTashkentDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("uz-UZ", { timeZone: TASHKENT_TZ, day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatTashkentDateTime(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const date = d.toLocaleDateString("uz-UZ", { timeZone: TASHKENT_TZ, day: "2-digit", month: "2-digit", year: "numeric" });
  const time = d.toLocaleTimeString("uz-UZ", { timeZone: TASHKENT_TZ, hour: "2-digit", minute: "2-digit" });
  return `${date}, ${time}`;
}
