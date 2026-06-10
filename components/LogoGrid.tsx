import { Logo } from "@/types/logo";
import { LogoCard } from "./LogoCard";
import styles from "./LogoGrid.module.css";

interface LogoGridProps {
  logos: Logo[];
}

export function LogoGrid({ logos }: LogoGridProps) {
  if (logos.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>No logos found</p>
        <p className={styles.emptySub}>Try a different search or category</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {logos.map((logo) => (
        <LogoCard key={logo.id} logo={logo} />
      ))}
    </div>
  );
}
