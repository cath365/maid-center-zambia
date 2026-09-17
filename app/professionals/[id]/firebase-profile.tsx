"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { ArrowLeft, BriefcaseBusiness, Check, CheckCircle2, Languages, Loader2, MapPin, ShieldCheck } from "lucide-react";
import { db } from "@/lib/firebase";
import { getFirebaseUserProfile, subscribeToFirebaseAuth, type AccountRole } from "@/lib/firebase-auth";

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
  const [viewerUid, setViewerUid] = useState("");
  const [viewerRole, setViewerRole] = useState<AccountRole | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");

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

      setViewerUid(user.uid);
      setViewerRole(base.role);

      const snapshot = await getDoc(doc(db, "maids", maidId));
      if (!snapshot.exists()) {
        setError("This maid profile could not be found.");
        return;
      }

      const data = snapshot.data() as MaidProfile;
      const isOwner = user.uid === maidId;
      const canReview = base.role === "employer" || base.role === "admin";
      const isApproved = String(data.verificationStatus || "").toLowerCase() === "approved";

      if (!isOwner && (!canReview || (!isApproved && base.role !== "admin"))) {
        setError("This maid profile is not available to your account.");
        return;
      }

      setMaid({ uid: snapshot.id, ...data });

      if (base.role === "employer") {
        const application = await getDoc(doc(db, "applications", `${user.uid}_${maidId}`));
        if (application.exists()) setRequestStatus(String(application.data().status || "requested"));
      }
    } catch (err) {
      console.error(err);
      setError("Could not open this maid profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }), [maidId, router]);

  async function requestInterview() {
    if (!viewerUid || viewerRole !== "employer" || requestStatus) return;
    setRequesting(true);
    try {
      const applicationRef = doc(db, "applications", `${viewerUid}_${maidId}`);
      const existing = await getDoc(applicationRef);
      if (existing.exists()) {
        setRequestStatus(String(existing.data().status || "requested"));
        return;
      }
      await setDoc(applicationRef, {
        maidId,
        employerId: viewerUid,
        createdBy: viewerUid,
        type: "interview_request",
        status: "requested",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setRequestStatus("requested");
    } catch (err) {
      console.error(err);
      setError("The interview request could not be submitted. Please try again.");
    } finally {
      setRequesting(false);
    }
  }

  if (loading) {
    return <main className="directory-bg"><div className="shell directory-main"><div className="professional-empty wide"><Loader2 className="spin"/><h3>Opening profile…</h3></div></div></main>;
  }

  if (!maid) {
    return <main className="directory-bg"><div className="shell directory-main"><Link className="back-link" href="/professionals"><ArrowLeft/>Back to directory</Link><div className="professional-empty wide"><h3>Profile unavailable</h3><p>{error}</p></div></div></main>;
  }

  const services = String(maid.services || "").split(",").map((item) => item.trim()).filter(Boolean);
  const name = maid.fullName || "Maid Center professional";
  const isEmployer = viewerRole === "employer";

  return (
    <main className="directory-bg">
      <header className="directory-top"><div className="shell portal-nav"><Link className="brand dark-brand" href="/"><span className="brand-mark">MC</span>Maid Center Zambia</Link><div><Link href="/dashboard">My account</Link></div></div></header>
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
            <h2>{isEmployer ? "Interested in this professional?" : "Professional account"}</h2>
            <p>{isEmployer ? "Submit an interview request through Maid Center Zambia. Direct contact information stays private while the request moves through review." : "This profile is connected to the Maid Center verification and placement workflow."}</p>
            <dl>
              <div><dt>Arrangement</dt><dd>{maid.workType || "Not set"}</dd></div>
              <div><dt>Expected rate</dt><dd>ZMW {Number(maid.expectedRate || 0).toLocaleString("en-ZM")}</dd></div>
              <div><dt>Availability</dt><dd>{maid.availability || "Not set"}</dd></div>
            </dl>
            {isEmployer ? (
              requestStatus ? <div className="profile-request-status"><CheckCircle2 size={18}/><span><strong>Request submitted</strong><small>Status: {requestStatus}</small></span></div> : <button className="portal-primary profile-request profile-request-button" type="button" onClick={requestInterview} disabled={requesting}>{requesting ? <><Loader2 size={17} className="spin"/>Submitting…</> : "Request interview"}</button>
            ) : <Link className="portal-primary profile-request" href={viewerRole === "admin" ? "/admin" : "/dashboard"}>{viewerRole === "admin" ? "Return to admin" : "Return to my account"}</Link>}
            {error ? <p className="profile-request-error">{error}</p> : null}
          </aside>
        </div>
      </div>
    </main>
  );
}
