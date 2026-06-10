import { getDb } from "./db";
import { Logo, LogoRaw, parseLogoRaw } from "@/types/logo";

export async function getAllLogos(): Promise<Logo[]> {
  const db = getDb();
  const result = await db.execute(
    "SELECT * FROM logos WHERE published IS NOT NULL ORDER BY created_at DESC"
  );
  return (result.rows as unknown as LogoRaw[]).map(parseLogoRaw);
}

export async function getLogoBySlug(slug: string): Promise<Logo | null> {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM logos WHERE slug = ? LIMIT 1",
    args: [slug],
  });
  if (!result.rows.length) return null;
  return parseLogoRaw(result.rows[0] as unknown as LogoRaw);
}

export async function getLogosByCategory(category: string): Promise<Logo[]> {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM logos WHERE main_category = ? AND published IS NOT NULL ORDER BY created_at DESC",
    args: [category],
  });
  return (result.rows as unknown as LogoRaw[]).map(parseLogoRaw);
}

export async function searchLogos(query: string): Promise<Logo[]> {
  const db = getDb();
  const like = `%${query}%`;
  const result = await db.execute({
    sql: `SELECT * FROM logos 
          WHERE published IS NOT NULL 
            AND (title LIKE ? OR description LIKE ? OR keywords LIKE ?)
          ORDER BY created_at DESC`,
    args: [like, like, like],
  });
  return (result.rows as unknown as LogoRaw[]).map(parseLogoRaw);
}

export async function getCategories(): Promise<string[]> {
  const db = getDb();
  const result = await db.execute(
    "SELECT DISTINCT main_category FROM logos WHERE published IS NOT NULL AND main_category != ''"
  );
  return result.rows.map((r) => r.main_category as string);
}

export async function getTotalLogos(): Promise<number> {
  const db = getDb();
  const result = await db.execute(
    "SELECT COUNT(*) as count FROM logos WHERE published IS NOT NULL"
  );
  return Number(result.rows[0].count);
}
