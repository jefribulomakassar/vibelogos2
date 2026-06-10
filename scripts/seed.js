/**
 * scripts/seed.js
 * Jalankan: node scripts/seed.js
 *
 * Baca file data/logos.json (konversi dulu dari Excel ke JSON)
 * lalu POST ke /api/seed dengan SEED_SECRET
 *
 * Format logos.json:
 * [
 *   {
 *     "title": "Twin Bee Logo",
 *     "description": "...",
 *     "keywords": "modern twin bee logo twinbee ...",
 *     "price": 350,
 *     "main_category": "general",
 *     "secondary_categories": "animals",
 *     "logo_file_id": "GOOGLE_DRIVE_FILE_ID",
 *     "logo_url": "https://www.logoground.com/logo.php?id=761026",
 *     "mockups": ["DRIVE_ID_1", "DRIVE_ID_2"],
 *     "logoground_url": "https://www.logoground.com/logo.php?id=761026",
 *     "account": "jeflodesign",
 *     "published": "2022-11-29"
 *   }
 * ]
 */

const fs = require("fs");
const path = require("path");

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const SEED_SECRET = process.env.SEED_SECRET;

if (!SEED_SECRET) {
  console.error("❌  SEED_SECRET env variable is required");
  process.exit(1);
}

const dataPath = path.join(__dirname, "../data/logos.json");
if (!fs.existsSync(dataPath)) {
  console.error("❌  data/logos.json not found. Create it first.");
  process.exit(1);
}

const logos = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
console.log(`📦  Seeding ${logos.length} logos to ${APP_URL}/api/seed ...`);

fetch(`${APP_URL}/api/seed`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-seed-secret": SEED_SECRET,
  },
  body: JSON.stringify({ logos }),
})
  .then((r) => r.json())
  .then((res) => {
    console.log("✅  Seed result:", res);
  })
  .catch((err) => {
    console.error("❌  Seed failed:", err.message);
  });
