"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { BriefcaseBusiness, Languages, Loader2, LogOut, MapPin, Search, ShieldCheck, SlidersHorizontal } from "lucide-react";
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
  expectedRate?: number;
  profilePhotoURL?: string;
  verificationStatus?: string;
};

type EmployerProfile = {
  area?: string;
  service?: string;
  budget?: number;
};

function normalized(value?: string) {
  return String(value || "").trim().toLowerCase();
}

function relevanceFor(maid: MaidProfile, employer: EmployerProfile | null) {
  if (!employer) return 0;
  let score = 0;
  const maidArea = normalized(maid.area);
  const employerArea = normalized(employer.area);
  const service = normalized(employer.service);
  const maidServices = normalized(maid.services);
  const workType = normalized(maid.workType);

  if (maidArea && employerArea && (maidArea.includes(employerArea) || employerArea.includes(maidArea))) score += 30;

  if (service) {
    if (service.includes("nanny") && (maidServices.includes("child") || maidServices.includes("nanny"))) score += 45;
    else if (service.includes("office") && maidServices.includes("clean")) score += 45;
    else if (service.includes("clean") && maidServices.includes("clean")) score += 45;
    else if (service.includes("maid") && (maidServices.includes("clean") || maidServices.includes("house") || maidServices.includes("laundry") || maidServices.includes("cook"))) score += 35;

    if (service.includes("full-time") && workType.includes("full")) score += 10;
    if (service.includes("part-time") && workType.includes("part")) score += 10;
    if (service.includes("live-in") && workType.includes("live")) score += 10;
  }

  if (Number(employer.budget || 0) > 0 && Number(maid.expectedRate || 0) > 0 && Number(maid.expectedRate) <= Number(employer.budget)) score += 15;
  return Math.min(score, 100);
}

export function ProfessionalsDirectory() {
  const router = useRouter();
  const [maids, setMaids] = useState<MaidProfile[]>([]);
  const [employer, setEmployer] = useState<EmployerProfile | null>(null);
  const [employerName, setEmployerName] = useState("Employer");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [workFilter, setWorkFilter] = useState("all");

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
        router.replace(base.role === "admin" ? "/admin" : "/dashboard");
        return;
      }

      setEmployerName(base.displayName || user.displayName || "Employer");
      const [employerSnapshot, maidSnapshot] = await Promise.all([
        getDoc(doc(db, "employers", user.uid)),
        getDocs(query(collection(db, "maidPublicProfiles"), where("verificationStatus", "==", "approved"))),
      ]);
      setEmployer(employerSnapshot.exists() ? (employerSnapshot.data() as EmployerProfile) : null);
      setMaids(maidSnapshot.docs.map((item) => ({ uid: item.id, ...(item.data() as Omit<MaidProfile, "uid">) })));
    } catch (err) {
      console.error(err);
      setError("Could not load approved professional profiles. Please try again.");
    } finally {
      setLoading(false);
    }
  }), [router]);

  const areas = useMemo(() => Array.from(new Set(maids.map((maid) => maid.area).filter((value): value is string => Boolean(value)))).sort(), [maids]);
  const workTypes = useMemo(() => Array.from(new Set(maids.map((maid) => maid.workType).filter((value): value is string => Boolean(value)))).sort(), [maids]);

  const visibleMaids = useMemo(() => {
    const term = normalized(searchText);
    return maids
      .filter((maid) => {
        const haystack = normalized([maid.fullName, maid.area, maid.services, maid.languages, maid.workType].filter(Boolean).join(" "));
        const matchesText = !term || haystack.includes(term);
        const matchesArea = areaFilter === "all" || maid.area === areaFilter;
        const matchesWork = workFilter === "all" || maid.workType === workFilter;
        return matchesText && matchesArea && matchesWork;
      })
      .map((maid) => ({ maid, relevance: relevanceFor(maid, employer) }))
      .sort((a, b) => b.relevance - a.relevance || String(a.maid.fullName || "").localeCompare(String(b.maid.fullName || "")));
  }, [areaFilter, employer, maids, searchText, workFilter]);

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
          <div><span className="overline">Approved professional directory</span><h1>Household professionals</h1><p>Search approved Maid Center profiles. Private identity documents, references and direct contact information are never loaded into this directory.</p></div>
          <Link className="outline-button" href="/dashboard">My account</Link>
        </div>

        {error ? <div className="professional-empty wide"><h3>Unable to load profiles</h3><p>{error}</p></div> : null}

        {!error ? <>
          <div className="directory-tools">
            <label className="directory-tool"><span>Search profiles</span><div style={{position:"relative"}}><Search size={17} style={{position:"absolute",left:12,top:12,color:"#65737b"}}/><input style={{paddingLeft:38}} value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Name, service, language…"/></div></label>
            <label className="directory-tool"><span>Area</span><select value={areaFilter} onChange={(event) => setAreaFilter(event.target.value)}><option value="all">All areas</option>{areas.map((area) => <option key={area} value={area}>{area}</option>)}</select></label>
            <label className="directory-tool"><span>Arrangement</span><select value={workFilter} onChange={(event) => setWorkFilter(event.target.value)}><option value="all">All arrangements</option>{workTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
          </div>

          <div className="directory-results-meta"><span><strong>{visibleMaids.length}</strong> approved profile{visibleMaids.length === 1 ? "" : "s"} shown</span><span><SlidersHorizontal size={14} style={{display:"inline",verticalAlign:"-2px",marginRight:5}}/>Relevance uses your saved service, area and budget where available.</span></div>
        </> : null}

        <div className="directory-grid">
          {visibleMaids.map(({ maid, relevance }) => (
            <Link className="professional-card" key={maid.uid} href={`/professionals/${maid.uid}`}>
              <div className="profile-head">
                {maid.profilePhotoURL ? <img src={maid.profilePhotoURL} alt={`${maid.fullName || "Maid"} profile`} className="profile-initial"/> : <span className="profile-initial">{String(maid.fullName || "M").charAt(0).toUpperCase()}</span>}
                <div className="professional-card-topline"><span className="verified-badge"><ShieldCheck size={14}/> Verified</span>{relevance >= 60 ? <span className="match-badge strong">Relevant to your request</span> : relevance > 0 ? <span className="match-badge">Some criteria match</span> : null}</div>
              </div>
              <h2>{maid.fullName || "Maid Center professional"}</h2>
              <p>{maid.services || "Household services"}</p>
              <ul>
                <li><MapPin/>{maid.area || "Location not set"}</li>
                <li><BriefcaseBusiness/>{Number(maid.experienceYears || 0)} years · {maid.workType || "Household professional"}</li>
                <li><Languages/>{maid.languages || "Languages not set"}</li>
              </ul>
              {Number(maid.expectedRate || 0) > 0 ? <div className="professional-card-match"><strong>Expected rate:</strong> ZMW {Number(maid.expectedRate).toLocaleString("en-ZM")}</div> : null}
              <span className="profile-link">View professional profile</span>
            </Link>
          ))}
          {!error && maids.length === 0 ? <div className="professional-empty wide"><h3>No approved profiles are available yet</h3><p>Approved worker profiles will appear here automatically after administrator verification and publishing.</p></div> : null}
          {!error && maids.length > 0 && visibleMaids.length === 0 ? <div className="directory-empty-filter"><h3>No profiles match those filters</h3><p>Try clearing the search, area or arrangement filter.</p></div> : null}
        </div>
      </div>
    </main>
  );
}
