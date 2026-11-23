/**
 * Upload storage mode is chosen by server configuration, never by a browser
 * setting. The application works without Vercel Blob (PostgreSQL bytea), but
 * Vercel Blob is required for files larger than the serverless request limit.
 */
export const BLOB_STORE_SUFFIX = ".blob.vercel-storage.com";

export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export function uploadMode(): "blob" | "database" {
  return blobConfigured() ? "blob" : "database";
}

export function isVercelDeployment(): boolean {
  return process.env.VERCEL === "1";
}

function configuredMaxBytes(): number {
  const requested = Number(process.env.MAX_UPLOAD_MB);
  if (Number.isFinite(requested) && requested > 0) {
    return Math.min(500 * 1024 * 1024, Math.max(1, Math.round(requested * 1024 * 1024)));
  }
  return 50 * 1024 * 1024;
}

/** Maximum accepted by the application for the active deployment target. */
export function maxUploadBytes(): number {
  const configured = configuredMaxBytes();
  // A Vercel Function receives at most 4.5 MB of request body. Leave headroom
  // for multipart boundaries when Blob is unavailable.
  return isVercelDeployment() && !blobConfigured() ? Math.min(configured, 4 * 1024 * 1024) : configured;
}

/** Only accept public URLs from the Vercel Blob host. */
export function isAllowedBlobUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname.endsWith(BLOB_STORE_SUFFIX) &&
      parsed.hostname.length > BLOB_STORE_SUFFIX.length + 1 &&
      !parsed.username &&
      !parsed.password &&
      parsed.pathname.startsWith("/")
    );
  } catch {
    return false;
  }
}
