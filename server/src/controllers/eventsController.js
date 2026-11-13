import pool from "../config/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import httpError from "../utils/httpError.js";
import { publicFilePath, removeUpload } from "../utils/files.js";
import { findOrCreateVolunteer } from "./volunteersController.js";

const COUNT_SQL = "(SELECT COUNT(*) FROM event_registrations r WHERE r.event_id = e.id AND r.status = 'registered') AS registered_count";

export const listEvents = asyncHandler(async (req, res) => {
  const { search = "", status = "" } = req.query;
  const conditions = [];
  const values = [];

  if (search) {
    conditions.push("(e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ?)");
    values.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (status === "upcoming") {
    conditions.push("e.status = 'upcoming' AND e.event_date >= NOW()");
  } else if (status === "past") {
    conditions.push("(e.status IN ('completed', 'cancelled') OR e.event_date < NOW())");
  } else if (status) {
    conditions.push("e.status = ?");
    values.push(status);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const order = status === "past" ? "DESC" : "ASC";

  const [rows] = await pool.query(
    `SELECT e.*, ${COUNT_SQL} FROM events e ${where} ORDER BY e.event_date ${order}`,
    values,
  );

  res.json(rows);
});

export const getEvent = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT e.*, ${COUNT_SQL} FROM events e WHERE e.id = ?`,
    [req.params.id],
  );
  if (rows.length === 0) throw httpError(404, "Event not found.");
  res.json(rows[0]);
});

export const createEvent = asyncHandler(async (req, res) => {
  const { title, description, event_date, location, status = "upcoming" } = req.body;
  const image = req.file ? publicFilePath(req.file.filename) : req.body.image || null;

  const [result] = await pool.query(
    `INSERT INTO events (title, description, event_date, location, image, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, event_date, location || null, image, status],
  );

  const [rows] = await pool.query(`SELECT e.*, ${COUNT_SQL} FROM events e WHERE e.id = ?`, [result.insertId]);
  res.status(201).json({ message: "Event created successfully.", event: rows[0] });
});

export const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [existingRows] = await pool.query("SELECT * FROM events WHERE id = ?", [id]);
  const existing = existingRows[0];
  if (!existing) throw httpError(404, "Event not found.");

  const image = req.file ? publicFilePath(req.file.filename) : req.body.image ?? existing.image;
  if (req.file && existing.image && existing.image !== image) removeUpload(existing.image);

  await pool.query(
    `UPDATE events
     SET title = ?, description = ?, event_date = ?, location = ?, image = ?, status = ?
     WHERE id = ?`,
    [
      req.body.title ?? existing.title,
      req.body.description ?? existing.description,
      req.body.event_date ?? existing.event_date,
      req.body.location ?? existing.location,
      image,
      req.body.status ?? existing.status,
      id,
    ],
  );

  const [rows] = await pool.query(`SELECT e.*, ${COUNT_SQL} FROM events e WHERE e.id = ?`, [id]);
  res.json({ message: "Event updated successfully.", event: rows[0] });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM events WHERE id = ?", [req.params.id]);
  if (rows.length === 0) throw httpError(404, "Event not found.");

  await pool.query("DELETE FROM events WHERE id = ?", [req.params.id]);
  removeUpload(rows[0].image);

  res.json({ message: "Event deleted successfully." });
});

export const registerForEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone } = req.body;

  const [eventRows] = await pool.query("SELECT * FROM events WHERE id = ?", [id]);
  const event = eventRows[0];
  if (!event) throw httpError(404, "Event not found.");
  if (event.status !== "upcoming") throw httpError(400, "Registration is closed for this event.");

  const volunteer = await findOrCreateVolunteer({ full_name, email, phone });

  const [existing] = await pool.query(
    "SELECT id FROM event_registrations WHERE event_id = ? AND volunteer_id = ? LIMIT 1",
    [id, volunteer.id],
  );
  if (existing.length > 0) throw httpError(409, "You are already registered for this event.");

  await pool.query(
    `INSERT INTO event_registrations (event_id, volunteer_id, status)
     VALUES (?, ?, 'registered')`,
    [id, volunteer.id],
  );

  res.status(201).json({ message: "You are registered for this event. Thank you for joining us!" });
});

export const listEventRegistrations = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT r.*, v.full_name, v.email, v.phone
     FROM event_registrations r
     JOIN volunteers v ON v.id = r.volunteer_id
     WHERE r.event_id = ?
     ORDER BY r.registration_date DESC`,
    [req.params.id],
  );
  res.json(rows);
});

export const listRegistrations = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT r.*, v.full_name, v.email, v.phone, e.title AS event_title, e.event_date
     FROM event_registrations r
     JOIN volunteers v ON v.id = r.volunteer_id
     JOIN events e ON e.id = r.event_id
     ORDER BY r.registration_date DESC`,
  );
  res.json(rows);
});

export const updateRegistration = asyncHandler(async (req, res) => {
  const [result] = await pool.query(
    "UPDATE event_registrations SET status = ? WHERE id = ?",
    [req.body.status, req.params.id],
  );
  if (result.affectedRows === 0) throw httpError(404, "Registration not found.");
  res.json({ message: "Registration updated successfully." });
});

export const deleteRegistration = asyncHandler(async (req, res) => {
  const [result] = await pool.query("DELETE FROM event_registrations WHERE id = ?", [req.params.id]);
  if (result.affectedRows === 0) throw httpError(404, "Registration not found.");
  res.json({ message: "Registration removed successfully." });
});
