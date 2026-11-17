import fs from "fs";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { uploadsDir } from "../utils/files.js";

fs.mkdirSync(uploadsDir, { recursive: true });

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg", "application/ogg"];
const allowedVideoExtensions = [".mp4", ".webm", ".ogv", ".ogg"];

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
  if (file.fieldname === "video") {
    if (!allowedVideoTypes.includes(file.mimetype) || !allowedVideoExtensions.includes(extension)) {
      const error = new Error("Only MP4, WEBM, OGV, or OGG videos are allowed.");
      error.status = 400;
      return cb(error);
    }
    return cb(null, true);
  }

  if (!allowedTypes.includes(file.mimetype) || !allowedExtensions.includes(extension)) {
    const error = new Error("Only JPG, PNG, WEBP, or GIF images are allowed.");
    error.status = 400;
    return cb(error);
  }
  cb(null, true);
}

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

export const uploadVideo = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
}).single("video");
