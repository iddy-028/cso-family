import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDir = path.resolve(__dirname, "../uploads");

export function publicFilePath(filename) {
  return `/uploads/${filename}`;
}

export function removeUpload(imagePath) {
  if (!imagePath || !imagePath.startsWith("/uploads/")) return;
  const filename = path.basename(imagePath);
  const fullPath = path.join(uploadsDir, filename);
  fs.promises.unlink(fullPath).catch(() => {});
}
