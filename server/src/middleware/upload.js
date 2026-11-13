import fs from "fs";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { uploadsDir } from "../utils/files.js";

fs.mkdirSync(uploadsDir, { recursive: true });

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${extension}`;
    cb(null, name);
  },
});

function fileFilter(req, file, cb) {
  const extension = path.extname(file.originalname).toLowerCase();
  if (!allowedTypes.includes(file.mimetype) || !allowedExtensions.includes(extension)) {
    return cb(new Error("Only JPG, PNG, WEBP, or GIF images are allowed."));
  }
  cb(null, true);
}

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");
