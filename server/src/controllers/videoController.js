import pool from "../config/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import httpError from "../utils/httpError.js";
import { publicFilePath, removeUpload } from "../utils/files.js";

export const listVideos = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM videos ORDER BY created_at DESC");
  res.json(rows);
});

export const createVideo = asyncHandler(async (req, res) => {
  if (!req.file) throw httpError(400, "Please upload a video.");
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const description = typeof req.body.description === "string" ? req.body.description.trim() : "";
  if (!title || title.length > 150 || description.length > 5000) {
    removeUpload(publicFilePath(req.file.filename));
    throw httpError(400, "A video title is required, and the title and description must be within their length limits.");
  }

  const [result] = await pool.query(
    "INSERT INTO videos (title, description, video_url) VALUES (?, ?, ?)",
    [title, description || null, publicFilePath(req.file.filename)],
  );
  const [rows] = await pool.query("SELECT * FROM videos WHERE id = ?", [result.insertId]);
  res.status(201).json({ message: "Video uploaded successfully.", video: rows[0] });
});

export const deleteVideo = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM videos WHERE id = ?", [req.params.id]);
  if (!rows.length) throw httpError(404, "Video not found.");

  await pool.query("DELETE FROM videos WHERE id = ?", [req.params.id]);
  removeUpload(rows[0].video_url);
  res.json({ message: "Video deleted successfully." });
});
