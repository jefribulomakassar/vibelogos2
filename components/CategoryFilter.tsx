import styles from "./CategoryFilter.module.css";

interface CategoryFilterProps {
  categories: string[];
  active?: string;
  query?: string;
}

export function CategoryFilter({ categories, active, query }: CategoryFilterProps) {
  return (
    <div className={styles.wrapper}>
      {/* Search bar */}
      <form action="/" method="GET" className={styles.searchForm}>
        {active && <input type="hidden" name="category" value={active} />}
        <input
          type="search"
          name="q"
          defaultValue={query ?? ""}
          placeholder="Search logos..."
          className={styles.search}
        />
      </form>

      {/* Category pills */}
      <div className={styles.pills}>
        <a
          href="/"
          className={`${styles.pill} ${!active ? styles.active : ""}`}
        >
          All
        </a>
        {categories.map((cat) => (
          <a
            key={cat}
            href={`/?category=${encodeURIComponent(cat)}`}
            className={`${styles.pill} ${active === cat ? styles.active : ""}`}
          >
            {cat}
          </a>
        ))}
      </div>
    </div>
  );
}
