import { closeDatabase } from "./db/client.js";
import { config } from "./config.js";
import { buildApp } from "./app.js";
import { startAutoCompleteJob } from "./routes/appointments.js";

const app = await buildApp();

let autoCompleteTimer: NodeJS.Timeout | undefined;

const start = async () => {
  if (!config.databaseUrl) {
    app.log.warn("DATABASE_URL not set — copy .env.example to apps/api/.env");
  }
  try {
    await app.listen({ port: config.port, host: config.host });
    if (config.databaseUrl) {
      autoCompleteTimer = startAutoCompleteJob();
    }
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

const shutdown = async () => {
  if (autoCompleteTimer) clearInterval(autoCompleteTimer);
  await app.close();
  await closeDatabase();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start();
