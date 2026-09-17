"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLeft, BriefcaseBusiness, Check, Languages, Loader2, MapPin, ShieldCheck } from "lucide-react";
import { db } from "@/lib/firebase";
import { getFirebaseUserProfile, subscribeToFirebaseAuth } from "@/lib/firebase-auth";

type MaidProfile = {
  uid?: string;
  fullName?: string;
  area?: string;
  workType?: string;
  services?: string;
  languages?: string;
  experienceYears?: number;
  workHistory?: string;
  expectedRate?: number;
  profilePhotoURL?: string;
  verificationStatus?: string;
  availability?: string;
};

export function FirebaseMaidProfile({ maidId }: { maidId: string }) {
  const router = useRouter();
  const [maid, setMaid] = useState<MaidProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => subscribeToFirebaseAuth(async (user) => {
    if (!user) {
      router.replace(`/auth?next=/professionals/${maidId}`);
      return;
    }

    try {
      const base = await getFirebaseUserProfile(user.uid);
      if (!base) {
        router.replace("/auth");
        return;
      }

      const snapshot = await getDoc(doc(db, "maids", maidId));
      if (!snapshot.exists()) {
        setError("This maid profile could not be found.");
        return;
      }

      const data = snapshot.data() as MaidProfile;
      const isOwner = user.uid === maidId;
      const isEmployer = base.role === "employer";
      const isApproved = String(data.verificationStatus || "").toLowerCase() === "approved";

      if (!isOwner && (!isEmployer || !isApproved)) {
        setError("This maid profile is not available to your account.");
        return;
      }

      setMaid({ uid: snapshot.id, ...data });
    } catch (err) {
      console.error(err);
      setError("Could not open this maid profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }), [maidId, router]);

  if (loading) {
    return <main className="directory-bg"><div className="shell directory-main"><div className="professional-empty wide"><Loader2 className="spin"/><h3>Opening profile…</h3></div></div></main>;
  }

  if (!maid) {
    return <main className="directory-bg"><div className="shell directory-main"><Link className="back-link" href="/professionals"><ArrowLeft/>Back to directory</Link><div className="professional-empty wide"><h3>Profile unavailable</h3><p>{error}</p></div></div></main>;
  }

  const services = String(maid.services || "").split(",").map((item) => item.trim()).filter(Boolean);
  const name = maid.fullName || "Maid Center professional";

  return (
    <main className="directory-bg">
      <header className="directory-top"><div className="shell portal-nav"><Link className="brand dark-brand" href="/"><span className="brand-mark">MC</span>Maid Center Zambia</Link></div></header>
      <div className="shell profile-page">
        <Link className="back-link" href="/professionals"><ArrowLeft/>Back to directory</Link>
        <div className="profile-layout">
          <section className="profile-main">
            <div className="profile-identity">
              {maid.profilePhotoURL ? <img src={maid.profilePhotoURL} alt={`${name} profile`} className="profile-initial large"/> : <span className="profile-initial large">{name.charAt(0).toUpperCase()}</span>}
              <div><span className="verified-badge"><ShieldCheck size={14}/> {String(maid.verificationStatus || "pending").toLowerCase() === "approved" ? "Identity verified" : "Verification pending"}</span><h1>{name}</h1><p>{maid.workType || "Household professional"}</p></div>
            </div>
            <div className="profile-summary">
              <span><MapPin/>{maid.area || "Location not set"}</span>
              <span><BriefcaseBusiness/>{Number(maid.experienceYears || 0)} years experience</span>
              <span><Languages/>{maid.languages || "Languages not set"}</span>
            </div>
            <article><h2>Professional summary</h2><p>{maid.workHistory || "Professional work history has not been added yet."}</p></article>
            <article><h2>Services</h2><div className="service-tags">{services.length ? services.map((service) => <span key={service}><Check/>{service}</span>) : <span>No services listed yet</span>}</div></article>
          </section>
          <aside className="profile-sidebar">
            <span className="overline">Maid Center profile</span>
            <h2>Interested in this professional?</h2>
            <p>Request an interview through Maid Center Zambia. Direct contact information stays private until a match is confirmed.</p>
            <dl>
              <div><dt>Arrangement</dt><dd>{maid.workType || "Not set"}</dd></div>
              <div><dt>Expected rate</dt><dd>ZMW {Number(maid.expectedRate || 0).toLocaleString("en-ZM")}</dd></div>
              <div><dt>Availability</dt><dd>{maid.availability || "Not set"}</dd></div>
            </dl>
            <Link className="portal-primary profile-request" href="/dashboard">Request through my account</Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
