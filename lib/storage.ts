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

export const verifyRequestSchema = downloadRequestSchema.extend({
  contentType: z.enum(allowedEvidenceTypes),
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

function startsWithBytes(bytes: Uint8Array, signature: number[]) {
  return signature.every((value, index) => bytes[index] === value);
}

export function evidenceSignatureMatches(contentType: (typeof allowedEvidenceTypes)[number], bytes: Uint8Array) {
  if (contentType === "application/pdf") return startsWithBytes(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d]);
  if (contentType === "image/png") return startsWithBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (contentType === "image/jpeg") return startsWithBytes(bytes, [0xff, 0xd8, 0xff]);
  if (contentType === "image/webp") return startsWithBytes(bytes, [0x52, 0x49, 0x46, 0x46]) && startsWithBytes(bytes.slice(8), [0x57, 0x45, 0x42, 0x50]);
  try {
    new TextDecoder("utf-8", { fatal: true }).decode(bytes.slice(0, 64 * 1024));
    return !bytes.includes(0);
  } catch {
    return false;
  }
}

export function containsMalwareTestMarker(bytes: Uint8Array) {
  const sample = new TextDecoder("latin1").decode(bytes.slice(0, 1024 * 1024));
  return sample.includes("$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!");
}
