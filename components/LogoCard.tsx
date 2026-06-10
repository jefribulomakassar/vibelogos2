"use client";

import { useState } from "react";
import { Logo } from "@/types/logo";
import { getDriveThumbnailUrl } from "@/lib/drive-url";
import styles from "./LogoCard.module.css";

interface LogoCardProps {
  logo: Logo;
}

export function LogoCard({ logo }: LogoCardProps) {
  const [showMockup, setShowMockup] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Pakai logo_file_id untuk thumbnail dari Drive, fallback ke logo_url
  const mainImg = logo.logo_file_id
    ? getDriveThumbnailUrl(logo.logo_file_id, "s400")
    : logo.logo_url;

  // Mockup pertama (jika ada)
  const firstMockup = logo.mockups[0]
    ? getDriveThumbnailUrl(logo.mockups[0], "s400")
    : null;

  const displayImg = showMockup && firstMockup ? firstMockup : mainImg;

  return (
    <a href={`/logo/${logo.slug}`} className={styles.card}>
      <div
        className={styles.imageWrap}
        onMouseEnter={() => firstMockup && setShowMockup(true)}
        onMouseLeave={() => setShowMockup(false)}
      >
        {imgError ? (
          <div className={styles.imgFallback}>
            <span>{logo.title[0]}</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displayImg}
            alt={logo.title}
            className={`${styles.img} ${showMockup ? styles.mockupActive : ""}`}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}
        {firstMockup && (
          <div className={styles.mockupBadge}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Mockup
          </div>
        )}
      </div>

      <div className={styles.info}>
        <p className={styles.title}>{logo.title}</p>
        <div className={styles.bottom}>
          <span className={styles.category}>{logo.main_category}</span>
          <span className={styles.price}>${logo.price}</span>
        </div>
      </div>
    </a>
  );
}
