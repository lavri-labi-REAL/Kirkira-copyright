/**
 * Worker entry point — runs both the filing worker and nightly sync worker
 * in the same process. For production, these can be split into separate
 * containers for independent scaling.
 */

import "dotenv/config";

console.log("[Worker] Starting Kirkira KECOBO automation workers...");

// Import workers (they self-register with BullMQ on import)
import "./filing-worker";
import "./nightly-sync";

console.log("[Worker] Both workers active — filing + nightly sync");
