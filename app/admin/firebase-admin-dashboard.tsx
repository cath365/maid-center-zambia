"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import {
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  Loader2,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { db } from "@/lib/firebase";
import { getFirebaseUserProfile, signOutFirebaseAccount, subscribeToFirebaseAuth } from "@/lib/firebase-auth";

type MaidRecord = {
  uid: string;
  fullName?: string;
  phone?: string;
  area?: string;
  workType?: string;
  services?: string;
  experienceYears?: number;
  verificationStatus?: string;
  nrcDocumentURL?: string;
};

type EmployerRecord = {
  uid: string;
  fullName?: string;
  phone?: string;
  email?: string;
  area?: string;
  service?: string;
  budget?: number;
  verificationStatus?: string;
};

type ApplicationRecord = {
  id: string;
  maidId?: string;
  employerId?: string;
  createdBy?: string;
  type?: string;
  status?: string;
  note?: string;
  createdAt?: { seconds?: number };
};

type Tab = "workers" | "clients" | "applications";

export function FirebaseAdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [denied, setDenied] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [tab, setTab] = useState<Tab>("workers");
  const [maids, setMaids] = useState<MaidRecord[]>([]);
  const [employers, setEmployers] = useState<EmployerRecord[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);

  const loadData = useCallback(async () => {
    const [maidSnapshot, employerSnapshot, applicationSnapshot] = await Promise.all([
      getDocs(collection(db, "maids")),
      getDocs(collection(db, "employers")),
      getDocs(collection(db, "applications")),
    ]);

    setMaids(maidSnapshot.docs.map((item) => ({ uid: item.id, ...(item.data() as Omit<MaidRecord, "uid">) })));
    setEmployers(employerSnapshot.docs.map((item) => ({ uid: item.id, ...(item.data() as Omit<EmployerRecord, "uid">) })));
    setApplications(applicationSnapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<ApplicationRecord, "id">) })));
  }, []);

  useEffect(() => subscribeToFirebaseAuth(async (user) => {
    if (!user) {
      router.replace("/auth");
      return;
    }

    try {
      const profile = await getFirebaseUserProfile(user.uid);
      if (!profile || profile.role !== "admin") {
        setDenied(true);
        setLoading(false);
        return;
      }
      setAdminEmail(user.email || profile.email || "Administrator");
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error("Could not load Firebase administration data.");
    } finally {
      setLoading(false);
    }
  }), [loadData, router]);

  const maidNames = useMemo(() => new Map(maids.map((maid) => [maid.uid, maid.fullName || "Professional"])), [maids]);
  const employerNames = useMemo(() => new Map(employers.map((employer) => [employer.uid, employer.fullName || "Employer"])), [employers]);

  async function refresh() {
    setRefreshing(true);
    try {
      await loadData();
      toast.success("Dashboard refreshed.");
    } catch (error) {
      console.error(error);
      toast.error("Could not refresh dashboard data.");
    } finally {
      setRefreshing(false);
    }
  }

  async function updateVerification(collectionName: "maids" | "employers", uid: string, status: string) {
    try {
      await updateDoc(doc(db, collectionName, uid), { verificationStatus: status, updatedAt: serverTimestamp() });
      if (collectionName === "maids") setMaids((rows) => rows.map((row) => row.uid === uid ? { ...row, verificationStatus: status } : row));
      else setEmployers((rows) => rows.map((row) => row.uid === uid ? { ...row, verificationStatus: status } : row));
      toast.success(`Status changed to ${status}.`);
    } catch (error) {
      console.error(error);
      toast.error("Firebase blocked the status update. Confirm the signed-in user has the admin role.");
    }
  }

  async function updateApplication(id: string, status: string) {
    try {
      await updateDoc(doc(db, "applications", id), { status, updatedAt: serverTimestamp() });
      setApplications((rows) => rows.map((row) => row.id === id ? { ...row, status } : row));
      toast.success(`Application moved to ${status}.`);
    } catch (error) {
      console.error(error);
      toast.error("Could not update the application status.");
    }
  }

  async function logout() {
    await signOutFirebaseAccount();
    router.replace("/auth");
  }

  if (loading) return <main className="admin-body admin-state"><Loader2 className="spin"/><span>Loading operations dashboard…</span></main>;

  if (denied) {
    return (
      <main className="admin-body admin-state">
        <ShieldCheck size={45}/>
        <h1>Administrator access required</h1>
        <p>This page reads protected Firebase worker, employer and placement records. Sign in with an account whose <strong>users</strong> record has role <strong>admin</strong>.</p>
        <div className="admin-state-actions"><Link className="button" href="/auth">Sign in</Link><Link className="admin-outline-button" href="/">Return home</Link></div>
      </main>
    );
  }

  const approvedWorkers = maids.filter((item) => item.verificationStatus === "approved").length;
  const pendingWorkers = maids.filter((item) => !item.verificationStatus || item.verificationStatus === "pending").length;
  const openApplications = applications.filter((item) => !["placed", "declined", "closed"].includes(String(item.status || "requested"))).length;

  return (
    <main className="admin-body">
      <Toaster richColors position="top-center"/>
      <header className="admin-header">
        <div className="shell admin-nav">
          <Link className="brand" href="/"><span className="brand-mark">MC</span>Maid Center Admin</Link>
          <div className="admin-header-actions"><span>{adminEmail}</span><button onClick={refresh} disabled={refreshing}><RefreshCw size={16} className={refreshing ? "spin" : ""}/>Refresh</button><button onClick={logout}><LogOut size={16}/>Sign out</button></div>
        </div>
      </header>

      <div className="shell admin-main">
        <div className="admin-title"><div><span className="admin-kicker">Firebase operations</span><h1>Operations dashboard</h1><p>Review the same records created by real worker and employer registrations.</p></div></div>

        <div className="admin-stats">
          <Stat icon={<Users/>} n={maids.length} t="Worker profiles"/>
          <Stat icon={<CheckCircle2/>} n={approvedWorkers} t="Approved workers"/>
          <Stat icon={<BriefcaseBusiness/>} n={employers.length} t="Employer requests"/>
          <Stat icon={<ClipboardList/>} n={openApplications} t="Open applications"/>
        </div>

        <div className="admin-alert"><ShieldCheck size={20}/><div><strong>One source of truth</strong><span>This dashboard now uses Firestore—the same database used by registration, professional profiles and employer requests.</span></div></div>

        <div className="admin-tabs" role="tablist">
          <button className={tab === "workers" ? "active" : ""} onClick={() => setTab("workers")}>Workers <span>{maids.length}</span></button>
          <button className={tab === "clients" ? "active" : ""} onClick={() => setTab("clients")}>Employers <span>{employers.length}</span></button>
          <button className={tab === "applications" ? "active" : ""} onClick={() => setTab("applications")}>Placement pipeline <span>{applications.length}</span></button>
        </div>

        {tab === "workers" && <section className="admin-card"><div className="admin-card-title"><div><h2>Worker verification</h2><p>{pendingWorkers} profile{pendingWorkers === 1 ? "" : "s"} currently awaiting a decision.</p></div></div>{maids.length ? <div className="admin-table-wrap"><table className="data-table"><thead><tr><th>Professional</th><th>Location & work</th><th>Experience</th><th>Status</th><th>Verification</th></tr></thead><tbody>{maids.map((maid) => <tr key={maid.uid}><td><strong>{maid.fullName || "Unnamed professional"}</strong><br/><small>{maid.phone || "No phone"}</small><br/><small>{maid.services || "No services listed"}</small></td><td>{maid.area || "Not set"}<br/><small>{maid.workType || "Not set"}</small></td><td>{Number(maid.experienceYears || 0)} years</td><td><Status value={maid.verificationStatus || "pending"}/></td><td><div className="admin-actions"><button onClick={() => updateVerification("maids", maid.uid, "screening")}>Screening</button><button className="approve" onClick={() => updateVerification("maids", maid.uid, "approved")}>Approve</button><button className="reject" onClick={() => updateVerification("maids", maid.uid, "rejected")}>Reject</button>{maid.nrcDocumentURL ? <a href={maid.nrcDocumentURL} target="_blank" rel="noreferrer">View NRC</a> : null}</div></td></tr>)}</tbody></table></div> : <Empty text="No worker profiles have been submitted yet."/>}</section>}

        {tab === "clients" && <section className="admin-card"><div className="admin-card-title"><div><h2>Employer verification</h2><p>Review staffing requests before sensitive placement information is shared.</p></div></div>{employers.length ? <div className="admin-table-wrap"><table className="data-table"><thead><tr><th>Employer</th><th>Request</th><th>Budget</th><th>Status</th><th>Verification</th></tr></thead><tbody>{employers.map((employer) => <tr key={employer.uid}><td><strong>{employer.fullName || "Unnamed employer"}</strong><br/><small>{employer.phone || employer.email || "No contact"}</small></td><td>{employer.service || "Not set"}<br/><small>{employer.area || "Area not set"}</small></td><td>ZMW {Number(employer.budget || 0).toLocaleString("en-ZM")}</td><td><Status value={employer.verificationStatus || "pending"}/></td><td><div className="admin-actions"><button onClick={() => updateVerification("employers", employer.uid, "screening")}>Screening</button><button className="approve" onClick={() => updateVerification("employers", employer.uid, "approved")}>Verify</button><button className="reject" onClick={() => updateVerification("employers", employer.uid, "rejected")}>Reject</button></div></td></tr>)}</tbody></table></div> : <Empty text="No employer requests have been submitted yet."/>}</section>}

        {tab === "applications" && <section className="admin-card"><div className="admin-card-title"><div><h2>Placement pipeline</h2><p>Interview requests created by employers appear here automatically.</p></div></div>{applications.length ? <div className="admin-table-wrap"><table className="data-table"><thead><tr><th>Professional</th><th>Employer</th><th>Type</th><th>Status</th><th>Pipeline actions</th></tr></thead><tbody>{applications.map((application) => <tr key={application.id}><td><strong>{maidNames.get(application.maidId || "") || "Unknown professional"}</strong></td><td>{employerNames.get(application.employerId || "") || "Unknown employer"}</td><td>{application.type === "interview_request" ? "Interview request" : application.type || "Application"}</td><td><Status value={application.status || "requested"}/></td><td><div className="admin-actions"><button onClick={() => updateApplication(application.id, "shortlisted")}>Shortlist</button><button onClick={() => updateApplication(application.id, "interview")}>Interview</button><button className="approve" onClick={() => updateApplication(application.id, "placed")}>Placed</button><button className="reject" onClick={() => updateApplication(application.id, "declined")}>Declined</button></div></td></tr>)}</tbody></table></div> : <Empty text="No interview requests or placement applications yet."/>}</section>}
      </div>
    </main>
  );
}

function Stat({ icon, n, t }: { icon: React.ReactNode; n: number; t: string }) {
  return <article className="stat admin-stat"><span>{icon}</span><div><strong>{n}</strong><small>{t}</small></div></article>;
}

function Status({ value }: { value: string }) {
  const normal = value.toLowerCase().replace(/\s+/g, "-");
  return <span className={`status ${normal}`}>{value}</span>;
}

function Empty({ text }: { text: string }) {
  return <div className="empty"><ClipboardList size={32}/><p>{text}</p></div>;
}
