"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import {
  BriefcaseBusiness,
  Clock3,
  Home,
  Loader2,
  LogOut,
  MapPin,
  RefreshCw,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
  getFirebaseUserProfile,
  signOutFirebaseAccount,
  subscribeToFirebaseAuth,
  type FirebaseUserProfile,
} from "@/lib/firebase-auth";
import styles from "./dashboard.module.css";

type MaidProfile = {
  fullName?: string;
  area?: string;
  services?: string;
  experienceYears?: number;
  verificationStatus?: string;
  expectedRate?: number;
  workType?: string;
  languages?: string;
  workHistory?: string;
  availability?: string;
  profilePhotoURL?: string;
};

type EmployerProfile = {
  fullName?: string;
  area?: string;
  service?: string;
  verificationStatus?: string;
  budget?: number;
  preferredStartDate?: string;
};

type RoleProfile = MaidProfile | EmployerProfile;

function timeoutAfter<T>(promise: Promise<T>, ms = 8000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => reject(new Error("firebase-timeout")), ms);
    }),
  ]);
}

function messageFor(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  if (message.includes("firebase-timeout")) return "Firebase did not respond in time. Please check your connection and try again.";
  if (message.includes("permission-denied")) return "Firebase security rules are blocking this dashboard profile.";
  if (message.includes("unavailable")) return "Firebase is temporarily unavailable. Please try again.";
  return "We could not load the dashboard profile. Please try again.";
}

export function FirebaseDashboardV2() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<FirebaseUserProfile | null>(null);
  const [roleProfile, setRoleProfile] = useState<RoleProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let authResolved = false;

    const guard = window.setTimeout(() => {
      if (!active || authResolved) return;
      setLoading(false);
      setError("Firebase sign-in is taking too long. Refresh the page or sign in again.");
    }, 9000);

    const unsubscribe = subscribeToFirebaseAuth(async (currentUser) => {
      authResolved = true;
      window.clearTimeout(guard);
      if (!active) return;

      if (!currentUser) {
        setLoading(false);
        router.replace("/auth");
        return;
      }

      setUser(currentUser);
      setError(null);

      try {
        const base = await timeoutAfter(getFirebaseUserProfile(currentUser.uid));
        if (!active) return;

        if (!base) {
          setProfile(null);
          setRoleProfile(null);
          setError("Your Firebase account exists, but the Maid Center user profile is missing. Please complete registration again.");
          return;
        }

        setProfile(base);
        const collectionName = base.role === "maid" ? "maids" : "employers";
        const snapshot = await timeoutAfter(getDoc(doc(db, collectionName, currentUser.uid)));
        if (!active) return;
        setRoleProfile(snapshot.exists() ? (snapshot.data() as RoleProfile) : null);
      } catch (loadError) {
        console.error("Dashboard load failed", loadError);
        if (active) setError(messageFor(loadError));
      } finally {
        if (active) setLoading(false);
      }
    });

    return () => {
      active = false;
      window.clearTimeout(guard);
      unsubscribe();
    };
  }, [router]);

  async function logout() {
    await signOutFirebaseAccount();
    router.replace("/auth");
  }

  if (loading) {
    return (
      <main className={styles.loading}>
        <Loader2 className={styles.spin} />
        <span>Loading your account…</span>
      </main>
    );
  }

  if (error || !user || !profile) {
    return (
      <main className={styles.loading}>
        <div style={{ maxWidth: 560, textAlign: "center", display: "grid", gap: 14, padding: 24 }}>
          <ShieldCheck size={44} style={{ margin: "0 auto" }} />
          <h1 style={{ margin: 0 }}>Dashboard could not open</h1>
          <p style={{ margin: 0, lineHeight: 1.6 }}>{error ?? "Your account profile could not be loaded."}</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button className={styles.editButton} onClick={() => window.location.reload()}><RefreshCw size={16} />Try again</button>
            <Link className={styles.editButton} href="/#register">Complete registration</Link>
            <button className={styles.editButton} onClick={logout}><LogOut size={16} />Sign out</button>
          </div>
        </div>
      </main>
    );
  }

  const isMaid = profile.role === "maid";
  const name = roleProfile?.fullName || profile.displayName || user.email || "Account";
  const verification = roleProfile?.verificationStatus || "pending";

  if (isMaid) {
    const maid = (roleProfile ?? {}) as MaidProfile;
    return (
      <main className={styles.profilePage}>
        <header className={styles.profileTopbar}>
          <Link href="/" className={styles.profileBrand}><span>MC</span><strong>Maid Center Zambia</strong></Link>
          <nav><Link href="/services">Services</Link><Link href="/dashboard">My profile</Link></nav>
          <button onClick={logout}><LogOut size={17} />Sign out</button>
        </header>

        <div className={styles.profileShell}>
          <section className={styles.profileHero}>
            <div className={styles.cover} />
            <div className={styles.identityRow}>
              <div className={styles.profilePhotoWrap}>
                {maid.profilePhotoURL ? <img src={maid.profilePhotoURL} alt={`${name} profile`} className={styles.profilePhoto} /> : <div className={styles.profileInitial}>{String(name).charAt(0).toUpperCase()}</div>}
              </div>
            </div>
            <div className={styles.identityCopy}>
              <h1>{name}</h1>
              <h2>{maid.workType || "Household professional"}</h2>
              <p className={styles.headline}>{maid.services || "Complete your profile to list your services"}</p>
              <div className={styles.metaLine}>
                <span><MapPin size={16} />{maid.area || "Location not set"}</span>
                <span><Clock3 size={16} />{maid.availability || "Availability not set"}</span>
                <span><ShieldCheck size={16} />{verification}</span>
              </div>
            </div>
          </section>

          <div className={styles.profileGrid}>
            <section className={styles.profileMain}>
              <article className={styles.profileCard}>
                <h3>About</h3>
                <p>{maid.workHistory || "Add your work history and professional introduction."}</p>
              </article>
              <article className={styles.profileCard}>
                <h3>Professional details</h3>
                <div className={styles.detailGrid}>
                  <div><BriefcaseBusiness /><span>Experience</span><strong>{Number(maid.experienceYears || 0)} years</strong></div>
                  <div><WalletCards /><span>Expected rate</span><strong>ZMW {Number(maid.expectedRate || 0).toLocaleString("en-ZM")}</strong></div>
                  <div><UserRound /><span>Languages</span><strong>{maid.languages || "Not set"}</strong></div>
                  <div><ShieldCheck /><span>Status</span><strong>{verification}</strong></div>
                </div>
              </article>
            </section>
            <aside className={styles.profileAside}>
              <article className={styles.sideCard}>
                <h3>Profile status</h3>
                <strong>{verification}</strong>
                <p>Your profile is connected to your Firebase maid account.</p>
                <Link href="/#register">Update profile</Link>
              </article>
            </aside>
          </div>
        </div>
      </main>
    );
  }

  const employer = (roleProfile ?? {}) as EmployerProfile;
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}><span>MC</span>Maid Center Zambia</Link>
        <button onClick={logout}><LogOut size={17} />Sign out</button>
      </header>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <div className={styles.avatar}>{String(name).charAt(0).toUpperCase()}</div>
          <h2>{name}</h2>
          <p>{user.email}</p>
          <span className={styles.role}><Home size={15} /> Employer</span>
        </aside>
        <section className={styles.content}>
          <div className={styles.heading}>
            <div><span>Employer account</span><h1>Welcome, {String(name).split(" ")[0]}</h1><p>Your Maid Center employer account is active.</p></div>
            <span className={styles.status}><ShieldCheck size={16} />{verification}</span>
          </div>
          <div className={styles.cards}>
            <article><ShieldCheck /><strong>{verification}</strong><span>Verification status</span></article>
            <article><BriefcaseBusiness /><strong>{employer.service || "Not set"}</strong><span>Service requested</span></article>
            <article><Home /><strong>{employer.area || "Not set"}</strong><span>Area</span></article>
          </div>
          <section className={styles.panel}>
            <div className={styles.panelTitle}><h2>Employer request</h2><Link href="/#register">Update registration</Link></div>
            <dl>
              <div><dt>Full name</dt><dd>{name}</dd></div>
              <div><dt>Phone</dt><dd>{profile.phone || "Not set"}</dd></div>
              <div><dt>Area</dt><dd>{employer.area || "Not set"}</dd></div>
              <div><dt>Service</dt><dd>{employer.service || "Not set"}</dd></div>
              <div><dt>Budget</dt><dd>ZMW {Number(employer.budget || 0).toLocaleString("en-ZM")}</dd></div>
            </dl>
          </section>
        </section>
      </div>
    </main>
  );
}
