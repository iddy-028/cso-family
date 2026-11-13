import pool from "../config/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import httpError from "../utils/httpError.js";
import { publicFilePath, removeUpload } from "../utils/files.js";

export const listGallery = asyncHandler(async (req, res) => {
  const { search = "", category = "", limit } = req.query;
  const conditions = [];
  const values = [];

  if (search) {
    conditions.push("(title LIKE ? OR description LIKE ?)");
    values.push(`%${search}%`, `%${search}%`);
  }
  if (category) {
    conditions.push("category = ?");
    values.push(category);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const limitSql = limit ? " LIMIT ?" : "";
  if (limit) values.push(Number(limit));

  const [rows] = await pool.query(
    `SELECT * FROM gallery ${where} ORDER BY created_at DESC${limitSql}`,
    values,
  );

  res.json(rows);
});

export const createGalleryItem = asyncHandler(async (req, res) => {
  if (!req.file) throw httpError(400, "Please upload an image.");

  const { title, description, category = "Community" } = req.body;
  const [result] = await pool.query(
    `INSERT INTO gallery (title, description, image_url, category)
     VALUES (?, ?, ?, ?)`,
    [title, description || null, publicFilePath(req.file.filename), category],
  );

  const [rows] = await pool.query("SELECT * FROM gallery WHERE id = ?", [result.insertId]);
  res.status(201).json({ message: "Gallery image uploaded successfully.", item: rows[0] });
});

export const updateGalleryItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [existingRows] = await pool.query("SELECT * FROM gallery WHERE id = ?", [id]);
  const existing = existingRows[0];
  if (!existing) throw httpError(404, "Gallery item not found.");

  let imageUrl = existing.image_url;
  if (req.file) {
    imageUrl = publicFilePath(req.file.filename);
    removeUpload(existing.image_url);
  }

  await pool.query(
    `UPDATE gallery SET title = ?, description = ?, image_url = ?, category = ? WHERE id = ?`,
    [
      req.body.title ?? existing.title,
      req.body.description !== undefined ? req.body.description || null : existing.description,
      imageUrl,
      req.body.category ?? existing.category,
      id,
    ],
  );

  const [rows] = await pool.query("SELECT * FROM gallery WHERE id = ?", [id]);
  res.json({ message: "Gallery item updated successfully.", item: rows[0] });
});

export const deleteGalleryItem = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM gallery WHERE id = ?", [req.params.id]);
  if (rows.length === 0) throw httpError(404, "Gallery item not found.");

  await pool.query("DELETE FROM gallery WHERE id = ?", [req.params.id]);
  removeUpload(rows[0].image_url);

  res.json({ message: "Gallery item deleted successfully." });
});
