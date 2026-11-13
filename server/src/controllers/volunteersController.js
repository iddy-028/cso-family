import pool from "../config/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import httpError from "../utils/httpError.js";

export const createVolunteer = asyncHandler(async (req, res) => {
  const { full_name, email, phone, gender, location, skills, motivation } = req.body;

  const [existing] = await pool.query(
    "SELECT id FROM volunteers WHERE email = ? ORDER BY created_at DESC LIMIT 1",
    [email],
  );

  if (existing.length > 0) {
    throw httpError(409, "A volunteer application with this email already exists. We will contact you soon.");
  }

  const [result] = await pool.query(
    `INSERT INTO volunteers (full_name, email, phone, gender, location, skills, motivation, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [full_name, email, phone || null, gender || null, location || null, skills || null, motivation || null],
  );

  const [rows] = await pool.query("SELECT * FROM volunteers WHERE id = ?", [result.insertId]);
  res.status(201).json({
    message: "Thank you for volunteering! Your application has been received and is awaiting review.",
    volunteer: rows[0],
  });
});

export const listVolunteers = asyncHandler(async (req, res) => {
  const { search = "", status = "" } = req.query;
  const conditions = [];
  const values = [];

  if (search) {
    conditions.push("(full_name LIKE ? OR email LIKE ? OR location LIKE ? OR skills LIKE ?)");
    values.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (status) {
    conditions.push("status = ?");
    values.push(status);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const [rows] = await pool.query(
    `SELECT * FROM volunteers ${where} ORDER BY created_at DESC`,
    values,
  );

  res.json(rows);
});

export const updateVolunteer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [existingRows] = await pool.query("SELECT * FROM volunteers WHERE id = ?", [id]);
  const existing = existingRows[0];
  if (!existing) throw httpError(404, "Volunteer not found.");

  const values = [
    req.body.full_name ?? existing.full_name,
    req.body.email ?? existing.email,
    req.body.phone ?? existing.phone,
    req.body.gender ?? existing.gender,
    req.body.location ?? existing.location,
    req.body.skills ?? existing.skills,
    req.body.motivation ?? existing.motivation,
    req.body.status ?? existing.status,
    id,
  ];

  await pool.query(
    `UPDATE volunteers
     SET full_name = ?, email = ?, phone = ?, gender = ?, location = ?, skills = ?, motivation = ?, status = ?
     WHERE id = ?`,
    values,
  );

  const [rows] = await pool.query("SELECT * FROM volunteers WHERE id = ?", [id]);
  res.json({ message: "Volunteer updated successfully.", volunteer: rows[0] });
});

export const updateVolunteerStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const [result] = await pool.query("UPDATE volunteers SET status = ? WHERE id = ?", [status, id]);
  if (result.affectedRows === 0) throw httpError(404, "Volunteer not found.");

  res.json({ message: `Volunteer marked as ${status}.` });
});

export const deleteVolunteer = asyncHandler(async (req, res) => {
  const [result] = await pool.query("DELETE FROM volunteers WHERE id = ?", [req.params.id]);
  if (result.affectedRows === 0) throw httpError(404, "Volunteer not found.");

  res.json({ message: "Volunteer deleted successfully." });
});

export async function findOrCreateVolunteer({ full_name, email, phone }) {
  const [existing] = await pool.query(
    "SELECT * FROM volunteers WHERE email = ? ORDER BY created_at DESC LIMIT 1",
    [email],
  );
  if (existing.length > 0) return existing[0];

  const [result] = await pool.query(
    `INSERT INTO volunteers (full_name, email, phone, status)
     VALUES (?, ?, ?, 'pending')`,
    [full_name, email, phone || null],
  );

  const [rows] = await pool.query("SELECT * FROM volunteers WHERE id = ?", [result.insertId]);
  return rows[0];
}
