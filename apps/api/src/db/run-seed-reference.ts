import "dotenv/config";

import { closeDatabase } from "./client.js";
import { seedReferenceData } from "./seed-reference.js";

await seedReferenceData();
console.log("Reference seed complete");
await closeDatabase();
