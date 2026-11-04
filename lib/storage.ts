import { z } from "zod";

export const EVIDENCE_BUCKET = "portfolio-evidence";
export const MAX_EVIDENCE_BYTES = 10 * 1024 * 1024;
export const allowedEvidenceTypes = ["application/pdf", "image/png", "image/jpeg", "image/webp", "text/plain"] as const;

export const uploadRequestSchema = z.object({
  filename: z.string().trim().min(1).max(160),
  contentType: z.enum(allowedEvidenceTypes),
  size: z.number().int().positive().max(MAX_EVIDENCE_BYTES),
});

export const downloadRequestSchema = z.object({
  path: z.string().trim().min(1).max(512),
});

function extensionFor(filename: string, contentType: string) {
  const extension = filename.toLowerCase().match(/\.([a-z0-9]{1,8})$/)?.[1];
  if (extension && /^[a-z0-9]+$/.test(extension)) return extension;
  return ({ "application/pdf": "pdf", "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "text/plain": "txt" } as Record<string, string>)[contentType] ?? "bin";
}

function safeStem(filename: string) {
  return filename.replace(/\.[^/.]+$/, "").normalize("NFKC").replace(/[^A-Za-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 72) || "evidence";
}

export function createEvidencePath(userId: string, filename: string, contentType: string) {
  return `portfolio/${userId}/${crypto.randomUUID()}-${safeStem(filename)}.${extensionFor(filename, contentType)}`;
}

export function isOwnedEvidencePath(path: string, userId: string) {
  return new RegExp(`^portfolio/${userId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/[A-Za-z0-9._-]+$`).test(path);
}
