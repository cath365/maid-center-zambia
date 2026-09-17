import Link from "next/link";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, CheckCircle2, Search, ShieldCheck, Users } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: <Users />,
    title: "Register",
    copy: "Create a secure account and submit the correct worker or employer application with the required information.",
  },
  {
    n: "02",
    icon: <ShieldCheck />,
    title: "Verification",
    copy: "Maid Center reviews identity details, references, work history and the information supplied by clients and workers.",
  },
  {
    n: "03",
    icon: <Search />,
    title: "Shortlisting",
    copy: "Suitable approved household professionals are matched against the employer's service, area, schedule and requirements.",
  },
  {
    n: "04",
    icon: <BriefcaseBusiness />,
    title: "Interview and placement",
    copy: "The employer can review suitable profiles, request an interview and proceed with a placement after both sides agree.",
  },
  {
    n: "05",
    icon: <CheckCircle2 />,
    title: "Follow-up",
    copy: "Placement progress and follow-up are recorded so Maid Center can support a safer, more accountable process.",
  },
];

export default function ProcessPage() {
  return (
    <main>
      <header className="site-header">
        <div className="shell nav">
          <Link className="brand" href="/">
            <span className="brand-mark">MC</span>
            <span>Maid Center <b>Zambia</b></span>
          </Link>
          <nav>
            <Link href="/services">Services</Link>
            <Link href="/process">Our process</Link>
            <Link href="/#register">Registration</Link>
            <Link href="/dashboard">My account</Link>
          </nav>
          <Link className="button button-small" href="/auth">Sign in</Link>
        </div>
      </header>

      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <span className="eyebrow">How Maid Center works</span>
            <h1>A structured process built around trust, verification and safer placement.</h1>
            <p>From registration to placement, every stage is designed to give employers and household professionals a clear, accountable path.</p>
            <div className="hero-actions">
              <Link className="button" href="/#register">Get started <ArrowRight size={18}/></Link>
              <Link className="button secondary" href="/services">View services</Link>
            </div>
          </div>
          <div className="hero-panel professional-panel">
            <span className="panel-label">Our placement process</span>
            <h2>Five clear stages from application to follow-up</h2>
            <p>Profiles are not treated as ready for placement until the relevant information has been reviewed.</p>
            <div className="trust"><ShieldCheck/><span><strong>Verification-led</strong><small>Identity, references and work history are reviewed before matching.</small></span></div>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="shell steps">
          <div>
            <span className="eyebrow dark">Step by step</span>
            <h2>What happens after you register</h2>
            <p>Each stage moves the application closer to a suitable and documented placement.</p>
          </div>
          <ol>
            {steps.map((step) => (
              <li key={step.n}>
                <b>{step.n}</b>
                <span>
                  <strong>{step.title}</strong>
                  <small>{step.copy}</small>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <span className="eyebrow dark">For employers</span>
            <h2>Request, review and proceed with confidence</h2>
            <p>Tell Maid Center what you need, review suitable approved profiles and request an interview when you are ready.</p>
          </div>
          <div className="service-grid">
            <div className="service-card"><span>01</span><h3>Submit your request</h3><p>Share your location, service, schedule, budget and household requirements.</p></div>
            <div className="service-card"><span>02</span><h3>Review suitable profiles</h3><p>Approved professionals can be shortlisted according to your requirements.</p></div>
            <div className="service-card"><span>03</span><h3>Request an interview</h3><p>Move forward with a candidate only after reviewing their professional profile.</p></div>
            <div className="service-card"><span>04</span><h3>Confirm placement</h3><p>Maid Center records the placement and supports the follow-up process.</p></div>
          </div>
        </div>
      </section>

      <section className="safety">
        <div className="shell safety-grid">
          <div><ShieldCheck size={38}/><h2>Privacy and safeguarding remain part of every stage</h2></div>
          <div>
            <p><CheckCircle2/> Worker identity and verification documents are kept private.</p>
            <p><CheckCircle2/> Employers access approved profiles through the platform.</p>
            <p><CheckCircle2/> Contact details are not intended to be shared before the proper placement stage.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell" style={{textAlign:"center"}}>
          <span className="eyebrow dark">Ready to begin?</span>
          <h2>Start with the correct registration form.</h2>
          <div className="hero-actions" style={{justifyContent:"center", marginTop:24}}>
            <Link className="button" href="/#register">Register now <ArrowRight size={18}/></Link>
            <Link className="button secondary" href="/"><ArrowLeft size={18}/> Back to home</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="shell footer-grid">
          <div><div className="brand"><span className="brand-mark">MC</span><span>Maid Center <b>Zambia</b></span></div><p>Safer connections between homes and household professionals.</p></div>
          <div><strong>Platform</strong><Link href="/services">Services</Link><Link href="/process">Our process</Link><Link href="/#register">Registration</Link><Link href="/auth">Sign in</Link></div>
          <div><strong>Location</strong><span>Lusaka, Zambia</span><span>Contact details coming soon</span></div>
        </div>
        <div className="shell copyright">© 2026 Maid Center Zambia</div>
      </footer>
    </main>
  );
}
