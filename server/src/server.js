import "dotenv/config";
import app from "./app.js";
import { testConnection } from "./config/db.js";

const port = Number(process.env.PORT || 5000);

async function start() {
  try {
    await testConnection();
    console.log("Database connection established.");
  } catch (error) {
    console.error("\nCould not connect to MySQL.");
    console.error(`  ${error.message}`);
    console.error("\nCheck server/.env and make sure the cso_database schema exists.");
    console.error("  Quick start with Docker: docker compose up -d");
    console.error("  Then run: npm run seed\n");
  }

  app.listen(port, () => {
    console.log(`CSO API running at http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/api/health`);
  });
}

start();
