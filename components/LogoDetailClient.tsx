"use client";

import { useState } from "react";
import { Logo } from "@/types/logo";
import { getDriveThumbnailUrl, getDriveViewUrl } from "@/lib/drive";
import styles from "./LogoDetailClient.module.css";

interface Props {
  logo: Logo;
}

export function LogoDetailClient({ logo }: Props) {
  const allImages = [
    logo.logo_file_id
      ? getDriveThumbnailUrl(logo.logo_file_id, "s800")
      : logo.logo_url,
    ...logo.mockups.map((id) => getDriveThumbnailUrl(id, "s800")),
  ].filter(Boolean);

  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <a href="/" className={styles.back}>← Back to logos</a>

        <div className={styles.layout}>
          {/* Left: image gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImg}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={allImages[activeIdx]}
                alt={logo.title}
                className={styles.mainImgEl}
              />
            </div>
            {allImages.length > 1 && (
              <div className={styles.thumbs}>
                {allImages.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt={`${logo.title} ${i === 0 ? "logo" : `mockup ${i}`}`}
                    className={`${styles.thumb} ${i === activeIdx ? styles.thumbActive : ""}`}
                    onClick={() => setActiveIdx(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: info */}
          <div className={styles.info}>
            <div className={styles.cats}>
              <span className={styles.catPill}>{logo.main_category}</span>
              {logo.secondary_categories.map((c) => (
                <span key={c} className={styles.catPill}>{c}</span>
              ))}
            </div>

            <h1 className={styles.title}>{logo.title}</h1>
            <p className={styles.price}>${logo.price}</p>
            <p className={styles.desc}>{logo.description}</p>

            {logo.keywords.length > 0 && (
              <div className={styles.keywords}>
                {logo.keywords.map((k) => (
                  <span key={k} className={styles.keyword}>{k}</span>
                ))}
              </div>
            )}

            <div className={styles.actions}>
              <a
                href={logo.logoground_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.buyBtn}
              >
                Buy on LogoGround →
              </a>
              {logo.logo_file_id && (
                <a
                  href={getDriveViewUrl(logo.logo_file_id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.previewBtn}
                >
                  Preview Full Size
                </a>
              )}
            </div>

            <p className={styles.meta}>
              Published by <strong>{logo.account}</strong>
              {logo.published && ` · ${logo.published}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
