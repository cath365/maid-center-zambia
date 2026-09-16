import Image from "next/image";
import part0 from "./hero-image-data/part0";
import part1 from "./hero-image-data/part1";
import part2 from "./hero-image-data/part2";
import part3 from "./hero-image-data/part3";
import part4 from "./hero-image-data/part4";
import styles from "./hero-maid-image.module.css";

const maidHeroImage = `data:image/webp;base64,${part0}${part1}${part2}${part3}${part4}`;

export function HeroMaidImage() {
  return (
    <div className={styles.visual} aria-label="Professional household worker illustration">
      <div className={styles.imageCard}>
        <Image
          src={maidHeroImage}
          alt="Smiling household professional holding a green mop and cleaning bucket"
          width={700}
          height={935}
          priority
          unoptimized
          className={styles.image}
        />
      </div>
      <div className={styles.badge}>
        <span className={styles.badgeMark}>✓</span>
        <span><strong>Trusted household support</strong><small>Professional • Verified • Ready to help</small></span>
      </div>
    </div>
  );
}
