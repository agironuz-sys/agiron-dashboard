import type { Attachment } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const BUCKET = "production-attachments";
export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function uploadAttachment(file: File): Promise<Attachment> {
  if (file.size > MAX_ATTACHMENT_BYTES) {
    throw new Error(`Fayl juda katta (${Math.round(file.size / 1024 / 1024)} MB). Eng ko'pi bilan 10 MB.`);
  }
  const path = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${safeName(file.name)}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });
  if (!res.ok) {
    throw new Error(`Fayl yuklashda xatolik: ${res.status}`);
  }
  return { url: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`, name: file.name };
}
