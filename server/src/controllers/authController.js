import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import httpError from "../utils/httpError.js";

function publicUser(user) {
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    is_active: user.is_active,
    created_at: user.created_at,
  };
}

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  const user = rows[0];

  if (!user) throw httpError(401, "Invalid email or password.");
  if (!user.is_active) throw httpError(403, "This account has been deactivated.");

  const matches = await bcrypt.compare(password, user.password);
  if (!matches) throw httpError(401, "Invalid email or password.");
  if (!["admin", "staff"].includes(user.role)) {
    throw httpError(403, "Only CSO administrators and staff can sign in.");
  }

  res.json({ message: "Logged in successfully.", token: signToken(user), user: publicUser(user) });
});

export const profile = asyncHandler(async (req, res) => {
  res.json(publicUser(req.user));
});
