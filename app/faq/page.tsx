import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about Maid Center Zambia registration, verification, professional profiles and household staffing requests.",
};

const faqs = [
  ["Who can register as a household professional?", "Worker registration is intended for adults aged 18 or older who want to create a household-work profile and provide the information needed for review."],
  ["What information is used during worker verification?", "The current workflow collects identity details, work history, references, services offered, location and optional document uploads. Verification status is managed separately from the public-facing profile."],
  ["Are NRC details and reference phone numbers shown publicly?", "No. Sensitive identity, reference and emergency-contact information is treated as verification data and is not intended to appear on the public professional directory."],
  ["How does an employer request work?", "An employer creates an account and provides the service needed, location, start date, schedule, budget, household size and duties or requirements. These details are used to organise the staffing request."],
  ["Can employers browse workers directly?", "Registered employer accounts can access the approved professional directory. Profiles are designed to show useful professional information without exposing private verification documents or contact details."],
  ["What services are available?", "The platform currently supports home-maid placements, nanny support, once-off cleaning and office cleaning. Specific schedules and arrangements are discussed as part of the staffing request."],
  ["Does registering guarantee a job or placement?", "No. Registration creates a profile or staffing request and allows it to enter the review process. Approval, matching, interviews and placement depend on verification and suitable requirements being available."],
  ["Can I update my information after registering?", "Yes. Signed-in accounts can return to the platform and update registration information. The dashboard also displays the account role and current verification-related information."],
  ["What happens after a professional profile is approved?", "Approved professional profiles can become available in the employer directory. Matching and placement still depend on the employer's location, service, schedule and other requirements."],
  ["Why does Maid Center use separate worker and employer accounts?", "The two roles provide different information and have different privacy needs. Separate accounts keep worker verification records distinct from employer staffing requests and make access control clearer."],
];

export default function FAQPage() {
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
          <span className="eyebrow">Frequently asked questions</span>
          <h1>Clear answers before you register.</h1>
          <p>These answers describe how the current Maid Center Zambia platform handles registration, privacy, verification and employer access.</p>
        </div>
      </section>

      <section className="content-section soft-bg">
        <div className="shell faq-wrap">
          <div className="faq-intro"><span className="eyebrow dark">Platform FAQ</span><h2>What you should know.</h2><p>If a process changes, the platform should be updated here so users are not working from outdated instructions.</p></div>
          <div className="faq-list">
            {faqs.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}</summary><p>{answer}</p></details>)}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="shell content-cta">
          <div><span className="eyebrow">Ready to continue?</span><h2>Create the account that matches your role.</h2><p>Apply for household work or submit an employer staffing request.</p></div>
          <Link className="button" href="/register">Open registration <ArrowRight size={18}/></Link>
        </div>
      </section>
    </main>
  );
}
