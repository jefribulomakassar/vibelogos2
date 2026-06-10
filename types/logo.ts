export interface Logo {
  id: number;
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  price: number;
  main_category: string;
  secondary_categories: string[];
  logo_file_id: string;
  logo_url: string;
  mockups: string[]; // array of Google Drive file IDs
  logoground_url: string;
  account: string;
  published: string | null;
  created_at: string;
}

export interface LogoRaw {
  id: number;
  slug: string;
  title: string;
  description: string;
  keywords: string; // JSON string dari Turso
  price: number;
  main_category: string;
  secondary_categories: string; // JSON string dari Turso
  logo_file_id: string;
  logo_url: string;
  mockups: string; // JSON string dari Turso
  logoground_url: string;
  account: string;
  published: string | null;
  created_at: string;
}

export function parseLogoRaw(raw: LogoRaw): Logo {
  return {
    ...raw,
    keywords: safeParseArray(raw.keywords),
    secondary_categories: safeParseArray(raw.secondary_categories),
    mockups: safeParseArray(raw.mockups),
  };
}

function safeParseArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
