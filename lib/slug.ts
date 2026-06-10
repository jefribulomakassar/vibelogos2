/**
 * Generate slug: title-base + 5-char alphanumeric suffix
 * Konsisten dengan pattern di mylogos project
 */
export function generateSlug(title: string, id?: number): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 50);

  const suffix = generateSuffix(id ?? Math.floor(Math.random() * 99999));
  return `${base}-${suffix}`;
}

function generateSuffix(seed: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  let n = Math.abs(seed) + 1;
  for (let i = 0; i < 5; i++) {
    result += chars[n % chars.length];
    n = Math.floor(n / chars.length) + 7;
  }
  return result;
}
