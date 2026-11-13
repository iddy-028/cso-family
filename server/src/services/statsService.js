import pool from "../config/db.js";

export async function getDashboardStats() {
  const [[volunteers]] = await pool.query(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'pending') AS pending,
       SUM(status = 'approved') AS approved
     FROM volunteers`,
  );

  const [[activities]] = await pool.query("SELECT COUNT(*) AS total FROM activities");
  const [[events]] = await pool.query(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'upcoming') AS upcoming,
       SUM(status = 'completed') AS completed
     FROM events`,
  );
  const [[messages]] = await pool.query(
    `SELECT COUNT(*) AS total, SUM(status = 'unread') AS unread FROM messages`,
  );

  const [recentVolunteers] = await pool.query(
    "SELECT id, full_name, email, location, status, created_at FROM volunteers ORDER BY created_at DESC LIMIT 5",
  );
  const [recentActivities] = await pool.query(
    "SELECT id, title, category, activity_date, location, image, created_at FROM activities ORDER BY created_at DESC LIMIT 5",
  );
  const [recentMessages] = await pool.query(
    "SELECT id, full_name, email, subject, status, created_at FROM messages ORDER BY created_at DESC LIMIT 5",
  );

  return {
    totals: {
      volunteers: Number(volunteers.total || 0),
      pendingVolunteers: Number(volunteers.pending || 0),
      activities: Number(activities.total || 0),
      events: Number(events.total || 0),
      upcomingEvents: Number(events.upcoming || 0),
      messages: Number(messages.total || 0),
      unreadMessages: Number(messages.unread || 0),
    },
    recentVolunteers,
    recentActivities,
    recentMessages,
  };
}
