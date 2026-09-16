"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Eye,
  Home,
  Languages,
  Loader2,
  LogOut,
  MapPin,
  Pencil,
  ShieldCheck,
  Star,
  UserRound,
  WalletCards,
} from "lucide-react";
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

type MaidReference = { name?: string; phone?: string };
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
  profileViews?: number;
  rating?: number;
  references?: MaidReference[];
  nrcDocumentURL?: string;
};
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

  if (isMaid) {
    const maid = (roleProfile || {}) as MaidProfile;
    const firstName = String(name).split(" ")[0];
    const serviceTags = String(maid.services || "").split(",").map(v => v.trim()).filter(Boolean);
    const references = maid.references || [];

    return (
      <main className={styles.profilePage}>
        <header className={styles.profileTopbar}>
          <Link href="/" className={styles.profileBrand}><span>MC</span><strong>Maid Center Zambia</strong></Link>
          <nav><Link href="/services">Services</Link><Link href="/dashboard">My profile</Link></nav>
          <button onClick={logout}><LogOut size={17}/>Sign out</button>
        </header>

        <div className={styles.profileShell}>
          <section className={styles.profileHero}>
            <div className={styles.cover}></div>
            <div className={styles.identityRow}>
              <div className={styles.profilePhotoWrap}>
                {maid.profilePhotoURL ? <img src={maid.profilePhotoURL} alt={`${name} profile`} className={styles.profilePhoto}/> : <div className={styles.profileInitial}>{String(name).charAt(0).toUpperCase()}</div>}
              </div>
              <div className={styles.identityActions}><Link href="/#register" className={styles.editButton}><Pencil size={16}/>Edit profile</Link></div>
            </div>
            <div className={styles.identityCopy}>
              <div className={styles.nameLine}><h1>{name}</h1>{String(verification).toLowerCase() === "verified" && <BadgeCheck className={styles.verifiedIcon}/>}</div>
              <h2>{maid.workType || "Household professional"}</h2>
              <p className={styles.headline}>{serviceTags.length ? serviceTags.join(" • ") : "Complete your profile to list your services"}</p>
              <div className={styles.metaLine}>
                <span><MapPin size={16}/>{maid.area || "Location not set"}</span>
                <span><Clock3 size={16}/>{maid.availability || "Availability not set"}</span>
                <span><ShieldCheck size={16}/>{String(verification).replaceAll("_", " ")}</span>
              </div>
            </div>
          </section>

          <div className={styles.profileGrid}>
            <section className={styles.profileMain}>
              <article className={styles.profileCard}>
                <div className={styles.cardHeader}><h3>About</h3><Link href="/#register"><Pencil size={16}/></Link></div>
                <p>{maid.workHistory || `${firstName} is building a professional household-services profile on Maid Center Zambia. Add work history and a short introduction to help employers understand your experience.`}</p>
              </article>

              <article className={styles.profileCard}>
                <div className={styles.cardHeader}><h3>Experience</h3></div>
                <div className={styles.experienceItem}>
                  <div className={styles.experienceIcon}><BriefcaseBusiness/></div>
                  <div><strong>{maid.workType || "Household professional"}</strong><span>Maid Center Zambia profile</span><small>{Number(maid.experienceYears || 0)} years of experience</small></div>
                </div>
              </article>

              <article className={styles.profileCard}>
                <div className={styles.cardHeader}><h3>Services</h3></div>
                <div className={styles.tagList}>{serviceTags.length ? serviceTags.map(tag => <span key={tag}>{tag}</span>) : <span className={styles.mutedTag}>No services added yet</span>}</div>
              </article>

              <article className={styles.profileCard}>
                <div className={styles.cardHeader}><h3>Professional details</h3></div>
                <div className={styles.detailGrid}>
                  <div><Languages/><span>Languages</span><strong>{maid.languages || "Not set"}</strong></div>
                  <div><WalletCards/><span>Expected rate</span><strong>ZMW {Number(maid.expectedRate || 0).toLocaleString("en-ZM")}</strong></div>
                  <div><BriefcaseBusiness/><span>Experience</span><strong>{Number(maid.experienceYears || 0)} years</strong></div>
                  <div><Clock3/><span>Availability</span><strong>{maid.availability || "Not set"}</strong></div>
                </div>
              </article>

              <article className={styles.profileCard}>
                <div className={styles.cardHeader}><h3>References</h3></div>
                {references.length ? <div className={styles.referenceList}>{references.map((ref, index) => <div key={`${ref.name}-${index}`}><CheckCircle2/><span><strong>{ref.name || `Reference ${index + 1}`}</strong><small>Reference submitted</small></span></div>)}</div> : <p className={styles.emptyText}>No references submitted yet.</p>}
              </article>
            </section>

            <aside className={styles.profileAside}>
              <article className={styles.sideCard}>
                <h3>Profile strength</h3>
                <div className={styles.strengthBar}><span style={{width: roleProfile ? "82%" : "35%"}}></span></div>
                <strong>{roleProfile ? "82% complete" : "35% complete"}</strong>
                <p>Add complete experience, services and verification details to strengthen your profile.</p>
                <Link href="/#register">Complete profile</Link>
              </article>

              <article className={styles.sideCard}>
                <h3>Profile activity</h3>
                <div className={styles.statRow}><Eye/><span><strong>{Number(maid.profileViews || 0)}</strong><small>Profile views</small></span></div>
                <div className={styles.statRow}><Star/><span><strong>{Number(maid.rating || 0).toFixed(1)}</strong><small>Rating</small></span></div>
              </article>

              <article className={styles.sideCard}>
                <h3>Verification</h3>
                <div className={styles.verificationItem}><ShieldCheck/><span><strong>{String(verification).replaceAll("_", " ")}</strong><small>Identity status</small></span></div>
                <div className={styles.verificationItem}><CheckCircle2/><span><strong>{maid.nrcDocumentURL ? "Submitted" : "Not submitted"}</strong><small>Verification document</small></span></div>
              </article>
            </aside>
          </div>
        </div>
      </main>
    );
  }

  const employer = roleProfile as EmployerProfile | null;
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
          <span className={styles.role}><Home size={15}/> Employer</span>
          <nav><a href="#overview">Overview</a><a href="#profile">Profile</a><Link href="/#register">Update request</Link></nav>
        </aside>
        <section className={styles.content}>
          <div className={styles.heading} id="overview">
            <div><span>Employer account</span><h1>Welcome, {String(name).split(" ")[0]}</h1><p>Your account is connected to Maid Center Zambia.</p></div>
            <span className={styles.status}><ShieldCheck size={16}/>{String(verification).replaceAll("_", " ")}</span>
          </div>
          <div className={styles.cards}>
            <article><ShieldCheck/><strong>{String(verification).replaceAll("_", " ")}</strong><span>Verification status</span></article>
            <article><BriefcaseBusiness/><strong>{String(employer?.service ?? "Not set")}</strong><span>Service requested</span></article>
            <article><Home/><strong>{String(employer?.area ?? "Not set")}</strong><span>Area</span></article>
          </div>
          <section className={styles.panel} id="profile">
            <div className={styles.panelTitle}><h2>Employer request</h2><Link href="/#register">Update registration</Link></div>
            {employer ? <dl><div><dt>Full name</dt><dd>{String(employer.fullName ?? profile.displayName)}</dd></div><div><dt>Phone</dt><dd>{profile.phone || "Not set"}</dd></div><div><dt>Area</dt><dd>{String(employer.area ?? "Not set")}</dd></div><div><dt>Service</dt><dd>{String(employer.service ?? "Not set")}</dd></div><div><dt>Budget</dt><dd>ZMW {Number(employer.budget ?? 0).toLocaleString("en-ZM")}</dd></div></dl> : <div className={styles.empty}><h3>Your request is not complete yet.</h3><p>Complete the employer form so Maid Center can begin matching.</p><Link href="/#register">Complete registration</Link></div>}
          </section>
        </section>
      </div>
    </main>
  );
}
