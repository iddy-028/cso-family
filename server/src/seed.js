import "dotenv/config";
import bcrypt from "bcryptjs";
import pool from "./config/db.js";

async function seedAdmin() {
  const name = process.env.ADMIN_NAME || "CSO Administrator";
  const email = process.env.ADMIN_EMAIL || "admin@cso.rw";
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";

  const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  const hash = await bcrypt.hash(password, 10);

  if (existing.length > 0) {
    await pool.query("UPDATE users SET full_name = ?, password = ?, role = 'admin', is_active = 1 WHERE id = ?", [
      name,
      hash,
      existing[0].id,
    ]);
    console.log(`Updated administrator: ${email}`);
  } else {
    await pool.query(
      "INSERT INTO users (full_name, email, password, role, is_active) VALUES (?, ?, ?, 'admin', 1)",
      [name, email, hash],
    );
    console.log(`Created administrator: ${email}`);
  }
}

async function seed() {
  try {
    await seedAdmin();
    console.log("\nSeed complete.");
    console.log(`Admin login: ${process.env.ADMIN_EMAIL || "admin@cso.rw"}`);
    console.log(`Admin password: ${process.env.ADMIN_PASSWORD || "Admin@12345"}`);
    console.log("Change the administrator password after first login.\n");
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();
