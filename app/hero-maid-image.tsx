import Image from "next/image";
import part0 from "./hero-image-data/part0";
import part1 from "./hero-image-data/part1";
import part2 from "./hero-image-data/part2";
import part3 from "./hero-image-data/part3";
import part4 from "./hero-image-data/part4";

const maidHeroImage = `data:image/webp;base64,${part0}${part1}${part2}${part3}${part4}`;

export function HeroMaidImage() {
  return (
    <div className="hero-visual" aria-label="Professional household worker illustration">
      <div className="hero-image-card">
        <Image
          src={maidHeroImage}
          alt="Smiling household professional holding a green mop and cleaning bucket"
          width={700}
          height={935}
          priority
          unoptimized
          className="hero-maid-image"
        />
      </div>
      <div className="hero-image-badge">
        <span className="hero-image-badge-mark">✓</span>
        <span><strong>Trusted household support</strong><small>Professional • Verified • Ready to help</small></span>
      </div>
    </div>
  );
}
