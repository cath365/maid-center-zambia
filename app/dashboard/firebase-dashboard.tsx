"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, Home, Loader2, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import {
  getFirebaseUserProfile,
  signOutFirebaseAccount,
  subscribeToFirebaseAuth,
  type FirebaseUserProfile,
} from "@/lib/firebase-auth";
import styles from "./dashboard.module.css";

type MaidProfile = { fullName?: string; area?: string; services?: string; experienceYears?: number; verificationStatus?: string; expectedRate?: number };
type EmployerProfile = { fullName?: string; area?: string; service?: string; verificationStatus?: string; budget?: number; preferredStartDate?: string };

export function FirebaseDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<FirebaseUserProfile | null>(null);
  const [roleProfile, setRoleProfile] = useState<MaidProfile | EmployerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => subscribeToFirebaseAuth(async (currentUser) => {
    if (!currentUser) {
      router.replace("/auth");
      return;
    }
    setUser(currentUser);
    const base = await getFirebaseUserProfile(currentUser.uid);
    setProfile(base);
    if (base?.role) {
      const snapshot = await getDoc(doc(db, base.role === "maid" ? "maids" : "employers", currentUser.uid));
      setRoleProfile(snapshot.exists() ? snapshot.data() as MaidProfile | EmployerProfile : null);
    }
    setLoading(false);
  }), [router]);

  async function logout() {
    await signOutFirebaseAccount();
    router.replace("/auth");
  }

  if (loading) return <main className={styles.loading}><Loader2 className={styles.spin} />Loading your account…</main>;
  if (!user || !profile) return null;

  const isMaid = profile.role === "maid";
  const name = roleProfile?.fullName || profile.displayName || user.email || "Account";
  const verification = roleProfile?.verificationStatus || "profile incomplete";

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
          <span className={styles.role}>{isMaid ? <UserRound size={15}/> : <Home size={15}/>} {isMaid ? "Maid / worker" : "Employer"}</span>
          <nav><a href="#overview">Overview</a><a href="#profile">Profile</a><Link href="/#register">Complete registration</Link></nav>
        </aside>
        <section className={styles.content}>
          <div className={styles.heading} id="overview">
            <div><span>Firebase account</span><h1>Welcome, {String(name).split(" ")[0]}</h1><p>Your account is connected to Maid Center Zambia.</p></div>
            <span className={styles.status}><ShieldCheck size={16}/>{String(verification).replaceAll("_", " ")}</span>
          </div>

          <div className={styles.cards}>
            <article><ShieldCheck/><strong>{String(verification).replaceAll("_", " ")}</strong><span>Verification status</span></article>
            <article><BriefcaseBusiness/><strong>{isMaid ? String((roleProfile as MaidProfile)?.experienceYears ?? 0) : String((roleProfile as EmployerProfile)?.service ?? "Not set")}</strong><span>{isMaid ? "Years experience" : "Service requested"}</span></article>
            <article><Home/><strong>{String(roleProfile?.area ?? "Not set")}</strong><span>Area</span></article>
          </div>

          <section className={styles.panel} id="profile">
            <div className={styles.panelTitle}><h2>{isMaid ? "Professional profile" : "Employer request"}</h2><Link href="/#register">Update registration</Link></div>
            {roleProfile ? (
              <dl>
                <div><dt>Full name</dt><dd>{String(roleProfile.fullName ?? profile.displayName)}</dd></div>
                <div><dt>Phone</dt><dd>{profile.phone || "Not set"}</dd></div>
                <div><dt>Area</dt><dd>{String(roleProfile.area ?? "Not set")}</dd></div>
                {isMaid ? <><div><dt>Services</dt><dd>{String((roleProfile as MaidProfile).services ?? "Not set")}</dd></div><div><dt>Expected rate</dt><dd>ZMW {Number((roleProfile as MaidProfile).expectedRate ?? 0).toLocaleString("en-ZM")}</dd></div></> : <><div><dt>Service</dt><dd>{String((roleProfile as EmployerProfile).service ?? "Not set")}</dd></div><div><dt>Budget</dt><dd>ZMW {Number((roleProfile as EmployerProfile).budget ?? 0).toLocaleString("en-ZM")}</dd></div></>}
              </dl>
            ) : (
              <div className={styles.empty}><h3>Your detailed profile is not complete yet.</h3><p>Complete the registration form so Maid Center can begin verification and matching.</p><Link href="/#register">Complete registration</Link></div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
