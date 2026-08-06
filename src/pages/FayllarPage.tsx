import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { uploadAttachment } from "../lib/storage";
import type { Employee, FileRecord } from "../lib/types";
import { IconFile, IconPlus, IconTrash } from "../components/icons";
import { SourceTag } from "../components/SourceTag";
import { formatTashkentDateTime } from "../lib/format";

function isImage(contentType: string): boolean {
  return contentType.startsWith("image/");
}

export function FayllarPage({ employees }: { employees: Employee[] }) {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadedBy, setUploadedBy] = useState(employees[0]?.id || "");

  async function load() {
    try {
      setFiles(await api.getFiles());
    } catch (e) {
      console.error("FayllarPage load failed:", e);
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

  async function handleFileSelect(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploadError("");
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        const uploaded = await uploadAttachment(file);
        const record = await api.createFile({
          name: uploaded.name,
          url: uploaded.url,
          contentType: file.type || "application/octet-stream",
          uploadedBy,
        });
        setFiles((prev) => [record, ...prev]);
      }
    } catch (e) {
      setUploadError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Bu faylni o'chirishni tasdiqlaysizmi?")) return;
    setFiles((prev) => prev.filter((f) => f.id !== id));
    api.deleteFile(id).catch((e) => console.error("deleteFile failed:", e));
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-[220px] pt-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-[30px] font-semibold" style={{ color: "var(--ink)" }}>
            Fayllar
          </h1>
          <p className="mt-1 text-[14px]" style={{ color: "var(--ink-soft)" }}>
            Rasm va fayllar kutubxonasi — vazifa berayotganda raqami bilan biriktirish mumkin
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="grid grid-cols-2 gap-3">
          {employees.length > 0 && (
            <div>
              <div className="mb-1.5 text-[12px] font-medium" style={{ color: "var(--ink-soft)" }}>
                Kim yuklamoqda
              </div>
              <select
                value={uploadedBy}
                onChange={(e) => setUploadedBy(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-[13.5px] outline-none"
                style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--ink)" }}
              >
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className={employees.length > 0 ? "" : "col-span-2"}>
            <div className="mb-1.5 text-[12px] font-medium" style={{ color: "var(--ink-soft)" }}>
              Fayl yuklash
            </div>
            <label
              className="flex h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed text-[13px] font-medium"
              style={{ borderColor: "var(--border)", color: "var(--accent)" }}
            >
              <IconPlus size={14} /> {uploading ? "Yuklanmoqda..." : "Fayl tanlash"}
              <input
                type="file"
                multiple
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  handleFileSelect(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
        {uploadError && (
          <p className="mt-2 text-[12px]" style={{ color: "var(--danger)" }}>
            {uploadError}
          </p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {loading ? (
          <div className="col-span-full text-[13px]" style={{ color: "var(--ink-soft)" }}>
            Yuklanmoqda...
          </div>
        ) : files.length === 0 ? (
          <div
            className="col-span-full rounded-[20px] border px-5 py-8 text-center text-[13px]"
            style={{ borderColor: "var(--border)", color: "var(--ink-soft)" }}
          >
            Hozircha fayllar yo'q
          </div>
        ) : (
          files.map((f) => (
            <div
              key={f.id}
              className="overflow-hidden rounded-xl border"
              style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--shadow-card)" }}
            >
              <a href={f.url} target="_blank" rel="noreferrer" className="block">
                {isImage(f.contentType) ? (
                  <img src={f.url} alt={f.name} className="h-28 w-full object-cover" />
                ) : (
                  <div
                    className="flex h-28 w-full items-center justify-center"
                    style={{ background: "var(--surface-2)", color: "var(--ink-faint)" }}
                  >
                    <IconFile size={32} />
                  </div>
                )}
              </a>
              <div className="p-2.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
                    style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                  >
                    #{f.fileNumber}
                  </span>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="ml-auto"
                    aria-label="O'chirish"
                    style={{ color: "var(--ink-faint)" }}
                  >
                    <IconTrash size={13} />
                  </button>
                </div>
                <div className="mt-1 truncate text-[12.5px] font-medium" style={{ color: "var(--ink)" }} title={f.name}>
                  {f.name}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[10.5px]" style={{ color: "var(--ink-faint)" }}>
                  {employeeName(f.uploadedBy) || "—"}
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <SourceTag source={f.source} />
                </div>
                <div className="mt-1 text-[10px]" style={{ color: "var(--ink-faint)" }}>
                  {formatTashkentDateTime(f.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
