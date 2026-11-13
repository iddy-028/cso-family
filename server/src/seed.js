import "dotenv/config";
import bcrypt from "bcryptjs";
import pool from "./config/db.js";

function daysFromNow(days, hour = 10) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

function dateOnly(days) {
  return daysFromNow(days, 9).slice(0, 10);
}

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

async function seedActivities() {
  const [[{ count }]] = await pool.query("SELECT COUNT(*) AS count FROM activities");
  if (count > 0) return;

  const activities = [
    [
      "Hospital visitation and prayer",
      "A team of volunteers visits patients, shares words of encouragement, prays with them, and offers practical support to families. This is a demonstration entry to be replaced with verified CSO activity information.",
      "Visiting the Sick",
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
      dateOnly(-18),
      "Kigali, Rwanda",
    ],
    [
      "Support for vulnerable families",
      "Volunteers distribute essential supplies and spend time with vulnerable families. This is placeholder content until the organization provides verified details.",
      "Helping the Vulnerable",
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80",
      dateOnly(-9),
      "Kigali, Rwanda",
    ],
    [
      "Children encouragement day",
      "A joyful day of games, songs, mentorship, and encouragement for children in the community. Placeholder demonstration activity.",
      "Children Support",
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
      dateOnly(-4),
      "Kigali, Rwanda",
    ],
    [
      "Community prayer gathering",
      "A time of worship, prayer, and fellowship open to the community. Placeholder demonstration activity.",
      "Prayer Meetings",
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80",
      dateOnly(6),
      "Kigali, Rwanda",
    ],
    [
      "Bible study and teaching",
      "Volunteers share the Word of God through a guided Bible study and discussion. Placeholder demonstration activity.",
      "Teaching the Word",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
      dateOnly(13),
      "Kigali, Rwanda",
    ],
    [
      "Community charity drive",
      "A community collection and distribution activity supporting people in need. Placeholder demonstration activity.",
      "Charity & Community Service",
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80",
      dateOnly(20),
      "Kigali, Rwanda",
    ],
  ];

  await pool.query(
    `INSERT INTO activities (title, description, category, image, activity_date, location) VALUES ?`,
    [activities],
  );
  console.log(`Inserted ${activities.length} sample activities.`);
}

async function seedEvents() {
  const [[{ count }]] = await pool.query("SELECT COUNT(*) AS count FROM events");
  if (count > 0) return;

  const events = [
    [
      "Community prayer and worship evening",
      "Join us for an evening of prayer, worship, and encouragement. Placeholder demonstration event.",
      daysFromNow(10, 17),
      "Kigali, Rwanda",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
      "upcoming",
    ],
    [
      "Volunteer orientation day",
      "Meet the team, learn about our activities, and discover how you can serve. Placeholder demonstration event.",
      daysFromNow(24, 9),
      "Kigali, Rwanda",
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80",
      "upcoming",
    ],
    [
      "Children encouragement workshop",
      "A day of mentorship, games, and encouragement for children. Placeholder demonstration event.",
      daysFromNow(-21, 10),
      "Kigali, Rwanda",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
      "completed",
    ],
  ];

  await pool.query(
    `INSERT INTO events (title, description, event_date, location, image, status) VALUES ?`,
    [events],
  );
  console.log(`Inserted ${events.length} sample events.`);
}

async function seedGallery() {
  const [[{ count }]] = await pool.query("SELECT COUNT(*) AS count FROM gallery");
  if (count > 0) return;

  const images = [
    [
      "Serving together",
      "Placeholder community service photograph.",
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80",
      "Community Service",
    ],
    [
      "Prayer and fellowship",
      "Placeholder prayer gathering photograph.",
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80",
      "Prayer",
    ],
    [
      "Hope for children",
      "Placeholder children support photograph.",
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
      "Children",
    ],
    [
      "Hands of compassion",
      "Placeholder visitation photograph.",
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80",
      "Compassion",
    ],
    [
      "Together in worship",
      "Placeholder worship photograph.",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
      "Worship",
    ],
    [
      "Community outreach",
      "Placeholder outreach photograph.",
      "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=1200&q=80",
      "Outreach",
    ],
  ];

  await pool.query(`INSERT INTO gallery (title, description, image_url, category) VALUES ?`, [images]);
  console.log(`Inserted ${images.length} sample gallery images.`);
}

async function seedVolunteersAndMessages() {
  const [[{ count }]] = await pool.query("SELECT COUNT(*) AS count FROM volunteers");
  if (count === 0) {
    await pool.query(
      `INSERT INTO volunteers (full_name, email, phone, gender, location, skills, motivation, status) VALUES ?`,
      [
        [
          ["Sample Volunteer One", "volunteer1@example.com", "+250 XXX XXX XXX", "Female", "Kigali", "Teaching, prayer", "I want to serve the community.", "pending"],
          ["Sample Volunteer Two", "volunteer2@example.com", "+250 XXX XXX XXX", "Male", "Kigali", "Photography, logistics", "I love helping people.", "approved"],
        ],
      ],
    );
    console.log("Inserted 2 sample volunteer applications.");
  }

  const [[{ messageCount }]] = await pool.query("SELECT COUNT(*) AS messageCount FROM messages");
  if (messageCount === 0) {
    await pool.query(
      `INSERT INTO messages (full_name, email, subject, message, status) VALUES ?`,
      [
        [
          ["Sample Visitor", "visitor@example.com", "Volunteer question", "I would like to know more about volunteering. This is a sample message.", "unread"],
          ["Another Visitor", "visitor2@example.com", "Partnership", "How can our community group support CSO? This is a sample message.", "read"],
        ],
      ],
    );
    console.log("Inserted 2 sample messages.");
  }
}

async function seed() {
  try {
    await seedAdmin();
    await seedActivities();
    await seedEvents();
    await seedGallery();
    await seedVolunteersAndMessages();
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
