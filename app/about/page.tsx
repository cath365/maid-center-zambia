import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, HeartHandshake, LockKeyhole, ShieldCheck, UserCheck, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Learn how Maid Center Zambia approaches household staffing, worker verification, employer registration and safer placement.",
};

export default function AboutPage() {
  return (
    <main className="content-page">
      <header className="site-header">
        <div className="shell nav">
          <Link className="brand" href="/"><span className="brand-mark">MC</span><span>Maid Center <b>Zambia</b></span></Link>
          <nav className="desktop-nav"><Link href="/services">Services</Link><Link href="/process">How it works</Link><Link href="/professionals">Professionals</Link><Link href="/about">About</Link><Link href="/faq">FAQ</Link></nav>
          <div className="nav-actions"><Link className="nav-signin" href="/auth">Sign in</Link><Link className="button button-small" href="/register">Get started</Link></div>
        </div>
      </header>

      <section className="content-hero">
        <div className="shell content-hero-inner">
          <Link className="page-breadcrumb" href="/"><ArrowLeft size={16}/> Back to home</Link>
          <span className="eyebrow">About Maid Center Zambia</span>
          <h1>A more structured way to connect homes and household professionals.</h1>
          <p>Maid Center Zambia is being built as a household staffing and placement platform where registration, verification information and employer requirements are organised instead of handled through informal introductions alone.</p>
        </div>
      </section>

      <section className="content-section">
        <div className="shell content-lead">
          <div><span className="eyebrow dark">Our purpose</span><h2>Trust should come from process.</h2></div>
          <div><p>The platform gives workers a professional account for their experience, services and verification status, while employers create separate accounts for staffing requirements. That separation matters: public professional information can remain useful without exposing private identity documents, references or personal contact details.</p></div>
        </div>
      </section>

      <section className="content-section soft-bg">
        <div className="shell">
          <div className="section-heading"><span className="eyebrow dark">How we operate</span><h2>Clear responsibilities on both sides.</h2><p>Maid Center Zambia is designed around a small number of practical principles.</p></div>
          <div className="content-grid-3">
            <article className="content-card"><ShieldCheck/><h3>Verification workflow</h3><p>Worker identity information, references and work history can move through a defined review status before approval.</p></article>
            <article className="content-card"><LockKeyhole/><h3>Private records</h3><p>NRC copies, reference contacts and other sensitive verification information are treated as private account data rather than public profile content.</p></article>
            <article className="content-card"><HeartHandshake/><h3>Responsible placement</h3><p>Employer requests capture location, schedule, budget and duties so a placement can be considered against real requirements.</p></article>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell content-grid-2">
          <article className="content-card">
            <Users/>
            <h2>For household professionals</h2>
            <p>A worker account is intended to become a professional record that can be reviewed and updated over time.</p>
            <ul>
              <li><CheckCircle2/> Work history and experience</li>
              <li><CheckCircle2/> Services and preferred work arrangement</li>
              <li><CheckCircle2/> References and verification documents</li>
              <li><CheckCircle2/> Verification and availability status</li>
            </ul>
          </article>
          <article className="content-card">
            <UserCheck/>
            <h2>For employers</h2>
            <p>An employer account records what the household or workplace actually needs before profiles are considered.</p>
            <ul>
              <li><CheckCircle2/> Service and location</li>
              <li><CheckCircle2/> Preferred start date and working schedule</li>
              <li><CheckCircle2/> Budget and household requirements</li>
              <li><CheckCircle2/> Access to approved professional profiles</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="content-section soft-bg">
        <div className="shell content-cta">
          <div><span className="eyebrow">Start your account</span><h2>Use the platform for the role that applies to you.</h2><p>Register as a household professional or create an employer request.</p></div>
          <Link className="button" href="/register">Get started <ArrowRight size={18}/></Link>
        </div>
      </section>
    </main>
  );
}
