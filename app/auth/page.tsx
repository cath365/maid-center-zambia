import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { FirebaseAuthPanel } from "./firebase-auth-panel";
import styles from "./auth.module.css";

export default function AuthPage() {
  return (
    <main className={styles.page}>
      <section className={styles.brandPanel}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>MC</span>
          <span>Maid Center <b>Zambia</b></span>
        </Link>
        <div className={styles.pitch}>
          <span className={styles.eyebrow}>Secure account access</span>
          <h1>One account for applications, matching and profile management.</h1>
          <p>
            Maids and employers can create secure accounts, save profile information and return to their dashboard at any time.
          </p>
          <div className={styles.trustRow}>
            <ShieldCheck size={22} />
            <span>Firebase Authentication + protected profile records</span>
          </div>
        </div>
      </section>
      <section className={styles.formPanel}>
        <FirebaseAuthPanel />
      </section>
    </main>
  );
}
