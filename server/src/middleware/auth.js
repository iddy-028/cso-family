import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import httpError from "../utils/httpError.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) throw httpError(401, "Authentication required.");

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw httpError(401, "Invalid or expired session. Please log in again.");
  }

  const [rows] = await pool.query(
    "SELECT id, full_name, email, phone, role, is_active, created_at FROM users WHERE id = ? LIMIT 1",
    [payload.id],
  );

  const user = rows[0];
  if (!user) throw httpError(401, "Account no longer exists.");
  if (!user.is_active) throw httpError(403, "This account has been deactivated.");

  req.user = user;
  next();
});

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(httpError(403, "You do not have permission to perform this action."));
    }
    next();
  };
}
