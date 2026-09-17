"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { BriefcaseBusiness, Languages, Loader2, LogOut, MapPin, ShieldCheck } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  getFirebaseUserProfile,
  signOutFirebaseAccount,
  subscribeToFirebaseAuth,
} from "@/lib/firebase-auth";

type MaidProfile = {
  uid: string;
  fullName?: string;
  area?: string;
  workType?: string;
  services?: string;
  languages?: string;
  experienceYears?: number;
  profilePhotoURL?: string;
  verificationStatus?: string;
};

export function ProfessionalsDirectory() {
  const router = useRouter();
  const [maids, setMaids] = useState<MaidProfile[]>([]);
  const [employerName, setEmployerName] = useState("Employer");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => subscribeToFirebaseAuth(async (user) => {
    if (!user) {
      router.replace("/auth?next=/professionals");
      return;
    }

    try {
      const base = await getFirebaseUserProfile(user.uid);
      if (!base) {
        router.replace("/auth");
        return;
      }
      if (base.role !== "employer") {
        router.replace("/dashboard");
        return;
      }

      setEmployerName(base.displayName || user.displayName || "Employer");
      const snapshot = await getDocs(
        query(collection(db, "maids"), where("verificationStatus", "==", "approved")),
      );
      setMaids(snapshot.docs.map((item) => ({ uid: item.id, ...(item.data() as Omit<MaidProfile, "uid">) })));
    } catch (err) {
      console.error(err);
      setError("Could not load approved maid profiles. Please try again.");
    } finally {
      setLoading(false);
    }
  }), [router]);

  async function logout() {
    await signOutFirebaseAccount();
    router.replace("/auth");
  }

  if (loading) {
    return <main className="directory-bg"><div className="shell directory-main"><div className="professional-empty wide"><Loader2 className="spin"/><h3>Loading professionals…</h3></div></div></main>;
  }

  return (
    <main className="directory-bg">
      <header className="directory-top">
        <div className="shell portal-nav">
          <Link className="brand dark-brand" href="/"><span className="brand-mark">MC</span>Maid Center Zambia</Link>
          <div><span>{employerName}</span><button type="button" onClick={logout}><LogOut size={15}/> Sign out</button></div>
        </div>
      </header>
      <div className="shell directory-main">
        <div className="directory-heading">
          <div><span className="overline">Verified directory</span><h1>Household professionals</h1><p>Browse approved Maid Center profiles. Contact details remain private until a match is confirmed.</p></div>
          <Link className="outline-button" href="/dashboard">My account</Link>
        </div>
        {error ? <div className="professional-empty wide"><h3>Unable to load profiles</h3><p>{error}</p></div> : null}
        <div className="directory-grid">
          {maids.map((maid) => (
            <Link className="professional-card" key={maid.uid} href={`/professionals/${maid.uid}`}>
              <div className="profile-head">
                {maid.profilePhotoURL ? <img src={maid.profilePhotoURL} alt={`${maid.fullName || "Maid"} profile`} className="profile-initial"/> : <span className="profile-initial">{String(maid.fullName || "M").charAt(0).toUpperCase()}</span>}
                <span className="verified-badge"><ShieldCheck size={14}/> Verified</span>
              </div>
              <h2>{maid.fullName || "Maid Center professional"}</h2>
              <p>{maid.services || "Household services"}</p>
              <ul>
                <li><MapPin/>{maid.area || "Location not set"}</li>
                <li><BriefcaseBusiness/>{Number(maid.experienceYears || 0)} years · {maid.workType || "Household professional"}</li>
                <li><Languages/>{maid.languages || "Languages not set"}</li>
              </ul>
              <span className="profile-link">View professional profile</span>
            </Link>
          ))}
          {!error && maids.length === 0 ? <div className="professional-empty wide"><h3>No approved profiles are available yet</h3><p>Approved maid profiles will appear here automatically.</p></div> : null}
        </div>
      </div>
    </main>
  );
}
