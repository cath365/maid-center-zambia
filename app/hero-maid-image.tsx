import Image from "next/image";
import styles from "./hero-maid-image.module.css";

export function HeroMaidImage() {
  return (
    <div className={styles.visual} aria-label="Professional household worker illustration">
      <div className={styles.imageCard}>
        <Image src="/maid-center-hero.webp" alt="Smiling household professional holding a green mop and cleaning bucket" width={898} height={1200} priority className={styles.image} />
      </div>
      <div className={styles.badge}>
        <span className={styles.badgeMark}>✓</span>
        <span><strong>Trusted household support</strong><small>Professional • Verified • Ready to help</small></span>
      </div>
    </div>
  );
}
