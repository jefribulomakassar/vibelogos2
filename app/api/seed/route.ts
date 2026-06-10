import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { generateSlug } from "@/lib/slug";

// Proteksi: hanya bisa diakses dengan secret key
const SEED_SECRET = process.env.SEED_SECRET;

export async function POST(req: NextRequest) {
  if (!SEED_SECRET) {
    return NextResponse.json({ error: "SEED_SECRET not configured" }, { status: 500 });
  }

  const auth = req.headers.get("x-seed-secret");
  if (auth !== SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { logos: RawLogoInput[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const db = getDb();
  let inserted = 0;
  let skipped = 0;

  for (const item of body.logos) {
    try {
      // Cek duplikat berdasarkan logo_file_id
      const existing = await db.execute({
        sql: "SELECT id FROM logos WHERE logo_file_id = ? LIMIT 1",
        args: [item.logo_file_id || ""],
      });
      if (existing.rows.length > 0) {
        skipped++;
        continue;
      }

      const slug = generateSlug(item.title, inserted);
      const keywords = Array.isArray(item.keywords)
        ? JSON.stringify(item.keywords)
        : JSON.stringify(
            (item.keywords as string)
              .split(/[\s,]+/)
              .filter(Boolean)
          );

      const secondary = Array.isArray(item.secondary_categories)
        ? JSON.stringify(item.secondary_categories)
        : JSON.stringify(
            (item.secondary_categories as string)
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          );

      const mockups = Array.isArray(item.mockups)
        ? JSON.stringify(item.mockups)
        : JSON.stringify([]);

      await db.execute({
        sql: `INSERT INTO logos 
              (slug, title, description, keywords, price, main_category, secondary_categories, 
               logo_file_id, logo_url, mockups, logoground_url, account, published)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          slug,
          item.title,
          item.description ?? "",
          keywords,
          Number(item.price) || 0,
          item.main_category ?? "",
          secondary,
          item.logo_file_id ?? "",
          item.logo_url ?? "",
          mockups,
          item.logoground_url ?? "",
          item.account ?? "jeflodesign",
          item.published ?? new Date().toISOString().split("T")[0],
        ],
      });
      inserted++;
    } catch (err) {
      console.error(`[seed] Error inserting ${item.title}:`, err);
    }
  }

  return NextResponse.json({
    success: true,
    inserted,
    skipped,
    total: body.logos.length,
  });
}

interface RawLogoInput {
  title: string;
  description?: string;
  keywords: string | string[];
  price?: number | string;
  main_category?: string;
  secondary_categories?: string | string[];
  logo_file_id?: string;
  logo_url?: string;
  mockups?: string | string[];
  logoground_url?: string;
  account?: string;
  published?: string;
}
