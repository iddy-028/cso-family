import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import httpError from "../utils/httpError.js";

const SAFE_COLUMNS = "id, full_name, email, phone, role, is_active, created_at";

export const listUsers = asyncHandler(async (req, res) => {
  const { search = "", role = "" } = req.query;
  const conditions = [];
  const values = [];

  if (search) {
    conditions.push("(full_name LIKE ? OR email LIKE ?)");
    values.push(`%${search}%`, `%${search}%`);
  }
  if (role) {
    conditions.push("role = ?");
    values.push(role);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const [rows] = await pool.query(
    `SELECT ${SAFE_COLUMNS} FROM users ${where} ORDER BY created_at DESC`,
    values,
  );

  res.json(rows);
});

export const createUser = asyncHandler(async (req, res) => {
  const { full_name, email, password, phone, role = "staff", is_active = 1 } = req.body;

  if (String(password).length < 8) {
    throw httpError(400, "Password must be at least 8 characters long.");
  }

  const [existing] = await pool.query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
  if (existing.length > 0) throw httpError(409, "An account with this email already exists.");

  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    `INSERT INTO users (full_name, email, password, phone, role, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [full_name, email, hashedPassword, phone || null, role, Number(is_active) ? 1 : 0],
  );

  const [rows] = await pool.query(`SELECT ${SAFE_COLUMNS} FROM users WHERE id = ?`, [result.insertId]);
  res.status(201).json({ message: "User created successfully.", user: rows[0] });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone, role, is_active, password } = req.body;

  const [existingRows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  const existing = existingRows[0];
  if (!existing) throw httpError(404, "User not found.");

  if (email && email !== existing.email) {
    const [duplicate] = await pool.query("SELECT id FROM users WHERE email = ? AND id <> ?", [email, id]);
    if (duplicate.length > 0) throw httpError(409, "An account with this email already exists.");
  }

  const fields = {
    full_name: full_name ?? existing.full_name,
    email: email ?? existing.email,
    phone: phone ?? existing.phone,
    role: role ?? existing.role,
    is_active: is_active === undefined ? existing.is_active : Number(is_active) ? 1 : 0,
  };

  let passwordSql = "";
  const values = [fields.full_name, fields.email, fields.phone, fields.role, fields.is_active];

  if (password) {
    if (String(password).length < 8) throw httpError(400, "Password must be at least 8 characters long.");
    passwordSql = ", password = ?";
    values.push(await bcrypt.hash(password, 10));
  }

  values.push(id);
  await pool.query(
    `UPDATE users SET full_name = ?, email = ?, phone = ?, role = ?, is_active = ?${passwordSql} WHERE id = ?`,
    values,
  );

  const [rows] = await pool.query(`SELECT ${SAFE_COLUMNS} FROM users WHERE id = ?`, [id]);
  res.json({ message: "User updated successfully.", user: rows[0] });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (Number(id) === Number(req.user.id)) throw httpError(400, "You cannot delete your own account.");

  const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
  if (result.affectedRows === 0) throw httpError(404, "User not found.");

  res.json({ message: "User deleted successfully." });
});
