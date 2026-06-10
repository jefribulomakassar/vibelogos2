import { getAllLogos, getCategories, getTotalLogos } from "@/lib/logos";
import { LogoGrid } from "@/components/LogoGrid";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CategoryFilter } from "@/components/CategoryFilter";
import styles from "./page.module.css";

// Revalidate setiap 1 jam (ISR - biar fresh tapi ga bayar cold start terus)
export const revalidate = 3600;

interface HomeProps {
  searchParams: { category?: string; q?: string };
}

export default async function Home({ searchParams }: HomeProps) {
  const [logos, categories, total] = await Promise.all([
    getAllLogos(),
    getCategories(),
    getTotalLogos(),
  ]);

  // Filter di server side
  let filtered = logos;
  if (searchParams.category) {
    filtered = logos.filter(
      (l) =>
        l.main_category.toLowerCase() ===
        searchParams.category!.toLowerCase()
    );
  }
  if (searchParams.q) {
    const q = searchParams.q.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }

  return (
    <main className={styles.main}>
      <Header total={total} />
      <Hero />
      <div className={styles.content}>
        <CategoryFilter
          categories={categories}
          active={searchParams.category}
          query={searchParams.q}
        />
        <LogoGrid logos={filtered} />
      </div>
    </main>
  );
}
