/**
 * scripts/excel-to-json.js
 * Jalankan: node scripts/excel-to-json.js path/to/logos.xlsx
 *
 * Butuh: npm install xlsx
 * Kolom Excel yang dikenali (case-insensitive):
 *   TITLE, DESCRIPTION, KEYWORDS, PRICE, MAIN_CATEGORY,
 *   SECOND_CATEGORIES, LOGO_FILE_ID, MOCKUPS, LOGO_URL,
 *   CREATOR/ACCOUNT, PUBLISHED
 */

const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const inputFile = process.argv[2];
if (!inputFile) {
  console.error("Usage: node scripts/excel-to-json.js path/to/logos.xlsx");
  process.exit(1);
}

const workbook = XLSX.readFile(inputFile);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

const logos = rows.map((row) => {
  const k = (key) => {
    const found = Object.keys(row).find(
      (k) => k.toLowerCase() === key.toLowerCase()
    );
    return found ? String(row[found]).trim() : "";
  };

  // Parse keywords: bisa string spasi/koma dipisah
  const rawKeywords = k("KEYWORDS") || k("keywords");
  const keywords = rawKeywords
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  // Parse secondary categories: koma dipisah
  const rawSecondary = k("SECOND_CATEGORIES") || k("secondary_categories");
  const secondary_categories = rawSecondary
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Parse mockups: bisa JSON array string atau koma-separated Drive IDs
  const rawMockups = k("MOCKUPS") || k("mockups");
  let mockups = [];
  try {
    const parsed = JSON.parse(rawMockups);
    mockups = Array.isArray(parsed) ? parsed : [];
  } catch {
    mockups = rawMockups
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return {
    title: k("TITLE") || k("title"),
    description: k("DESCRIPTION") || k("description"),
    keywords,
    price: Number(k("PRICE") || k("price")) || 0,
    main_category: k("MAIN_CATEGORY") || k("main_category"),
    secondary_categories,
    logo_file_id: k("LOGO_FILE_ID") || k("logo_file_id"),
    logo_url: k("LOGO_URL") || k("logo_url"),
    mockups,
    logoground_url: k("LOGO_URL") || k("logo_url"), // sama dengan logo_url dari Excel
    account: k("CREATOR") || k("creator") || k("ACCOUNT") || "jeflodesign",
    published: k("PUBLISHED") || k("published"),
  };
}).filter((l) => l.title); // skip baris kosong

const outDir = path.join(__dirname, "../data");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, "logos.json");
fs.writeFileSync(outPath, JSON.stringify(logos, null, 2), "utf-8");
console.log(`✅  Exported ${logos.length} logos to ${outPath}`);
