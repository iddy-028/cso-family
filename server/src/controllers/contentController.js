import pool from "../config/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import httpError from "../utils/httpError.js";

export const listContent = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT content_key, language, content FROM site_content");
  res.json(rows);
});

export const updateContent = asyncHandler(async (req, res) => {
  const content = req.body?.content;
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    throw httpError(400, "Content must be provided as an object.");
  }

  const entries = [];
  for (const [language, values] of Object.entries(content)) {
    if (!["en", "rw"].includes(language) || !values || typeof values !== "object" || Array.isArray(values)) {
      throw httpError(400, "Only English and Kinyarwanda content can be saved.");
    }

    for (const [key, value] of Object.entries(values)) {
      if (!/^[a-z0-9._-]{1,120}$/.test(key) || typeof value !== "string" || value.length > 5000) {
        throw httpError(400, "A content field is invalid or too long.");
      }
      entries.push([key, language, value]);
    }
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (const [key, language, value] of entries) {
      await connection.query(
        `INSERT INTO site_content (content_key, language, content)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE content = VALUES(content)`,
        [key, language, value],
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  const [rows] = await pool.query("SELECT content_key, language, content FROM site_content");
  res.json({ message: "Website content saved.", content: rows });
});
