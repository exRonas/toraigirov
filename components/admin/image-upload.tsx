"use client";

import { useState, useCallback, type DragEvent } from "react";
import Image from "next/image";
import { UploadCloud, Loader2, X } from "lucide-react";

export function ImageUpload({
  value,
  onChange,
  kind = "image",
  label = "Обложка",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  kind?: "image" | "audio";
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragover, setDragover] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      setError("");
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("kind", kind);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Ошибка загрузки");
        onChange(data.url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Ошибка загрузки");
      } finally {
        setUploading(false);
      }
    },
    [kind, onChange]
  );

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragover(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  }

  const accept = kind === "audio" ? "audio/mpeg,audio/mp3" : "image/jpeg,image/png,image/webp";

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-text">{label}</label>

      {value && kind === "image" && (
        <div className="relative mb-2 aspect-[16/9] w-full max-w-md overflow-hidden rounded-md border border-border">
          <Image src={value} alt="preview" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {value && kind === "audio" && (
        <div className="mb-2 flex items-center gap-2">
          <audio controls src={value} className="h-9" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-md border border-border px-2 py-1 text-xs hover:bg-bg"
          >
            Удалить
          </button>
        </div>
      )}

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragover(true);
        }}
        onDragLeave={() => setDragover(false)}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-6 text-center transition-colors ${
          dragover ? "border-primary bg-primary/5" : "border-border bg-bg hover:border-primary"
        }`}
      >
        {uploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : (
          <UploadCloud className="h-6 w-6 text-text-muted" />
        )}
        <span className="mt-2 text-sm text-text-muted">
          {kind === "audio"
            ? "Перетащите MP3 или нажмите (макс. 25 МБ)"
            : "Перетащите изображение или нажмите (JPG/PNG/WEBP, макс. 10 МБ)"}
        </span>
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
          }}
        />
      </label>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
