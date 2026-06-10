import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} />
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Premium Logo Collection</p>
        <h1 className={styles.title}>
          Logos that make <br />
          <span className={styles.accent}>brands memorable</span>
        </h1>
        <p className={styles.sub}>
          Hand-crafted modern logos by{" "}
          <a
            href="https://www.logoground.com/profile/jeflodesign"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            jeflodesign
          </a>
          . Unique, ready to use, fully licensed.
        </p>
      </div>
    </section>
  );
}
