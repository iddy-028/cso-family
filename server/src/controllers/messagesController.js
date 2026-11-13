import pool from "../config/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import httpError from "../utils/httpError.js";

export const createMessage = asyncHandler(async (req, res) => {
  const { full_name, email, subject, message } = req.body;

  await pool.query(
    `INSERT INTO messages (full_name, email, subject, message, status)
     VALUES (?, ?, ?, ?, 'unread')`,
    [full_name, email, subject, message],
  );

  res.status(201).json({ message: "Thank you for reaching out. Your message has been received." });
});

export const listMessages = asyncHandler(async (req, res) => {
  const { search = "", status = "" } = req.query;
  const conditions = [];
  const values = [];

  if (search) {
    conditions.push("(full_name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)");
    values.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (status) {
    conditions.push("status = ?");
    values.push(status);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const [rows] = await pool.query(
    `SELECT * FROM messages ${where} ORDER BY created_at DESC`,
    values,
  );

  res.json(rows);
});

export const markMessageRead = asyncHandler(async (req, res) => {
  const [result] = await pool.query("UPDATE messages SET status = 'read' WHERE id = ?", [req.params.id]);
  if (result.affectedRows === 0) throw httpError(404, "Message not found.");
  res.json({ message: "Message marked as read." });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const [result] = await pool.query("DELETE FROM messages WHERE id = ?", [req.params.id]);
  if (result.affectedRows === 0) throw httpError(404, "Message not found.");
  res.json({ message: "Message deleted successfully." });
});
