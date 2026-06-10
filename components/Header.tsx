import styles from "./Header.module.css";

interface HeaderProps {
  total: number;
}

export function Header({ total }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="/" className={styles.logo}>
          <span className={styles.logoMark}>V</span>
          <span className={styles.logoText}>ibeLogos</span>
        </a>
        <div className={styles.right}>
          <span className={styles.count}>{total} logos</span>
          <a
            href="https://www.logoground.com/profile/jeflodesign"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.buyBtn}
          >
            Buy on LogoGround
          </a>
        </div>
      </div>
    </header>
  );
}
