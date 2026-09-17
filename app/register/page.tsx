import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { RegistrationForms } from "../registration-forms";

export const metadata: Metadata = {
  title: "Registration",
  description: "Create a Maid Center Zambia worker or employer account and submit the information needed for household staffing and placement.",
};

export default function RegisterPage() {
  return (
    <main>
      <header className="site-header">
        <div className="shell nav">
          <Link className="brand" href="/"><span className="brand-mark">MC</span><span>Maid Center <b>Zambia</b></span></Link>
          <nav className="desktop-nav"><Link href="/services">Services</Link><Link href="/process">How it works</Link><Link href="/about">About</Link><Link href="/faq">FAQ</Link></nav>
          <div className="nav-actions"><Link className="nav-signin" href="/auth">Sign in</Link></div>
        </div>
      </header>

      <section className="section register-section" style={{ minHeight: "calc(100vh - 120px)" }}>
        <div className="shell">
          <Link href="/" className="back-link" style={{ display: "inline-flex", marginBottom: 24 }}><ArrowLeft size={17} />Back to home</Link>
          <div className="section-heading">
            <span className="eyebrow dark">Secure registration</span>
            <h1 style={{ fontSize: "clamp(2.2rem,5vw,4rem)", marginBottom: 14 }}>Start with the account that matches your role.</h1>
            <p>Workers create a professional profile for review. Employers create a staffing request. Each flow stores the correct information in your signed-in account.</p>
          </div>

          <RegistrationForms />

          <div className="registration-security-note">
            <ShieldCheck size={21} />
            <span>Account authentication is handled through Firebase. Identity documents, reference contacts and other verification details are not intended to be displayed on public professional profiles.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
