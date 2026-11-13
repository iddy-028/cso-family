import pool from "../config/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import httpError from "../utils/httpError.js";
import { publicFilePath, removeUpload } from "../utils/files.js";

export const listActivities = asyncHandler(async (req, res) => {
  const { search = "", category = "", limit } = req.query;
  const conditions = [];
  const values = [];

  if (search) {
    conditions.push("(title LIKE ? OR description LIKE ? OR location LIKE ?)");
    values.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (category) {
    conditions.push("category = ?");
    values.push(category);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const limitSql = limit ? " LIMIT ?" : "";
  if (limit) values.push(Number(limit));

  const [rows] = await pool.query(
    `SELECT * FROM activities ${where} ORDER BY COALESCE(activity_date, DATE(created_at)) DESC${limitSql}`,
    values,
  );

  res.json(rows);
});

export const getActivity = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM activities WHERE id = ?", [req.params.id]);
  if (rows.length === 0) throw httpError(404, "Activity not found.");
  res.json(rows[0]);
});

export const createActivity = asyncHandler(async (req, res) => {
  const { title, description, category, activity_date, location } = req.body;
  const image = req.file ? publicFilePath(req.file.filename) : req.body.image || null;

  const [result] = await pool.query(
    `INSERT INTO activities (title, description, category, image, activity_date, location)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, category, image, activity_date || null, location || null],
  );

  const [rows] = await pool.query("SELECT * FROM activities WHERE id = ?", [result.insertId]);
  res.status(201).json({ message: "Activity created successfully.", activity: rows[0] });
});

export const updateActivity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [existingRows] = await pool.query("SELECT * FROM activities WHERE id = ?", [id]);
  const existing = existingRows[0];
  if (!existing) throw httpError(404, "Activity not found.");

  const image = req.file ? publicFilePath(req.file.filename) : req.body.image ?? existing.image;

  if (req.file && existing.image && existing.image !== image) removeUpload(existing.image);

  await pool.query(
    `UPDATE activities
     SET title = ?, description = ?, category = ?, image = ?, activity_date = ?, location = ?
     WHERE id = ?`,
    [
      req.body.title ?? existing.title,
      req.body.description ?? existing.description,
      req.body.category ?? existing.category,
      image,
      req.body.activity_date !== undefined ? req.body.activity_date || null : existing.activity_date,
      req.body.location ?? existing.location,
      id,
    ],
  );

  const [rows] = await pool.query("SELECT * FROM activities WHERE id = ?", [id]);
  res.json({ message: "Activity updated successfully.", activity: rows[0] });
});

export const deleteActivity = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM activities WHERE id = ?", [req.params.id]);
  if (rows.length === 0) throw httpError(404, "Activity not found.");

  await pool.query("DELETE FROM activities WHERE id = ?", [req.params.id]);
  removeUpload(rows[0].image);

  res.json({ message: "Activity deleted successfully." });
});
