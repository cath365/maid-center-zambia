import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Baby,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  HeartHandshake,
  House,
  LockKeyhole,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";

const services = [
  {
    title: "Home maid",
    copy: "Reliable day-to-day support for cleaning, laundry and household organisation.",
    href: "/services/home-maid",
    icon: House,
  },
  {
    title: "Nanny support",
    copy: "Adult childcare professionals matched around your family routine and requirements.",
    href: "/services/nanny-support",
    icon: Baby,
  },
  {
    title: "Once-off cleaning",
    copy: "Focused cleaning for moving, deep-cleaning days, events and occasional support.",
    href: "/services/once-off-cleaning",
    icon: Sparkles,
  },
  {
    title: "Office cleaning",
    copy: "Structured cleaning arrangements for offices and other professional spaces.",
    href: "/services/office-cleaning",
    icon: Building2,
  },
];

const trustPoints = [
  [ShieldCheck, "Identity review", "Worker identity details are submitted for verification."],
  [UserCheck, "Reference checks", "Employment references can be reviewed before placement."],
  [LockKeyhole, "Private records", "Sensitive documents are not published on public profiles."],
  [HeartHandshake, "Placement support", "Clients and workers follow a structured placement process."],
] as const;

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <div className="shell nav">
          <Link className="brand" href="/" aria-label="Maid Center Zambia home">
            <span className="brand-mark">MC</span>
            <span>Maid Center <b>Zambia</b></span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <Link href="/services">Services</Link>
            <Link href="/process">How it works</Link>
            <Link href="/professionals">Professionals</Link>
            <Link href="/about">About</Link>
            <Link href="/faq">FAQ</Link>
          </nav>

          <div className="nav-actions">
            <Link className="nav-signin" href="/auth">Sign in</Link>
            <Link className="button button-small" href="/register">Get started</Link>
            <details className="mobile-menu">
              <summary aria-label="Open navigation"><Menu size={22}/></summary>
              <div className="mobile-menu-panel">
                <Link href="/services">Services</Link>
                <Link href="/process">How it works</Link>
                <Link href="/professionals">Professionals</Link>
                <Link href="/about">About</Link>
                <Link href="/faq">FAQ</Link>
                <Link href="/auth">Sign in</Link>
                <Link href="/register">Get started</Link>
              </div>
            </details>
          </div>
        </div>
      </header>

      <section className="hero home-hero">
        <div className="shell hero-grid home-hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Professional household staffing in Zambia</span>
            <h1>Household support built on <em>verification,</em> not guesswork.</h1>
            <p>
              Maid Center Zambia connects households and businesses with maids, nannies and cleaners through a structured registration, screening and placement process.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/register">Find a professional <ArrowRight size={18}/></Link>
              <Link className="button secondary" href="/register">Apply for work</Link>
            </div>
            <div className="hero-proof">
              <span><CheckCircle2 size={17}/> Clear application process</span>
              <span><CheckCircle2 size={17}/> Private verification records</span>
              <span><CheckCircle2 size={17}/> Employer and worker accounts</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Maid Center Zambia professional placement">
            <div className="hero-photo-card">
              <Image
                src="/maid-center-hero.webp"
                alt="Maid Center Zambia household professional"
                fill
                priority
                sizes="(max-width: 850px) 100vw, 46vw"
              />
              <div className="hero-photo-overlay"/>
              <div className="hero-photo-caption">
                <span>Structured placement</span>
                <strong>Professional profiles. Safer introductions.</strong>
              </div>
            </div>
            <div className="floating-verification-card">
              <span className="verification-icon"><BadgeCheck size={21}/></span>
              <div><strong>Verification workflow</strong><small>Identity • references • profile review</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Maid Center trust commitments">
        <div className="shell trust-grid">
          {trustPoints.map(([Icon, title, copy]) => (
            <article key={title}>
              <Icon/>
              <div><strong>{title}</strong><span>{copy}</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="services">
        <div className="shell">
          <div className="section-heading left-heading">
            <span className="eyebrow dark">Services</span>
            <h2>Support designed around real households and workplaces.</h2>
            <p>Choose a service, tell us your requirements and use your account to continue the placement journey.</p>
          </div>

          <div className="service-grid premium-service-grid">
            {services.map(({ title, copy, href, icon: Icon }, index) => (
              <Link className="service-card premium-service-card" href={href} key={title}>
                <div className="service-icon"><Icon size={22}/></div>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <strong>View service <ArrowRight size={15}/></strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section process-showcase" id="how">
        <div className="shell process-layout">
          <div className="process-intro">
            <span className="eyebrow dark">How Maid Center works</span>
            <h2>A clear process from registration to placement.</h2>
            <p>Every account has a purpose. Workers build a professional profile, employers submit their requirements, and the platform keeps the placement workflow organised.</p>
            <Link className="text-link" href="/process">See the complete process <ArrowRight size={17}/></Link>
          </div>

          <div className="process-list">
            <ProcessStep icon={<Users/>} n="01" title="Register" copy="Create the correct worker or employer account and provide the required information."/>
            <ProcessStep icon={<ClipboardCheck/>} n="02" title="Review" copy="Profiles, identity details, references and employer requirements move through review."/>
            <ProcessStep icon={<Search/>} n="03" title="Match" copy="Approved professionals can be considered against a client's service, location and schedule."/>
            <ProcessStep icon={<BriefcaseBusiness/>} n="04" title="Place" copy="Interview, placement status and follow-up can be managed through the platform."/>
          </div>
        </div>
      </section>

      <section className="section role-section">
        <div className="shell role-grid">
          <article className="role-card role-card-dark">
            <span className="role-number">For households & businesses</span>
            <h2>Hire with more context.</h2>
            <p>Create an employer account, submit your staffing requirements and browse approved professional profiles without exposing private worker documents.</p>
            <ul>
              <li><CheckCircle2/> Service and schedule requirements</li>
              <li><CheckCircle2/> Approved professional directory</li>
              <li><CheckCircle2/> Private account dashboard</li>
            </ul>
            <Link className="button" href="/register">Request household support <ArrowRight size={18}/></Link>
          </article>

          <article className="role-card role-card-light">
            <span className="role-number">For household professionals</span>
            <h2>Build a profile that represents your experience.</h2>
            <p>Register once, add your work history, services and references, and follow your verification status from your account.</p>
            <ul>
              <li><CheckCircle2/> Professional work profile</li>
              <li><CheckCircle2/> Verification status</li>
              <li><CheckCircle2/> Secure document submission</li>
            </ul>
            <Link className="outline-button strong-outline" href="/register">Apply for work <ArrowRight size={18}/></Link>
          </article>
        </div>
      </section>

      <section className="section principles-section">
        <div className="shell">
          <div className="section-heading">
            <span className="eyebrow dark">Built for trust</span>
            <h2>A staffing platform should protect people, not just collect forms.</h2>
            <p>The platform separates public professional information from private verification records and keeps employer access account-based.</p>
          </div>
          <div className="principles-grid">
            <article><ShieldCheck/><h3>Verification first</h3><p>Professional profiles can move through a defined review status before being presented as approved.</p></article>
            <article><LockKeyhole/><h3>Privacy by design</h3><p>NRC details, references and uploaded documents are treated as verification data rather than public profile content.</p></article>
            <article><HeartHandshake/><h3>Respect on both sides</h3><p>Worker and employer registration are separated so expectations and responsibilities can be managed clearly.</p></article>
          </div>
        </div>
      </section>

      <section className="final-cta-section">
        <div className="shell final-cta-card">
          <div>
            <span className="eyebrow">Start with the right account</span>
            <h2>Ready to find support or apply for work?</h2>
            <p>Registration creates your secure account and connects you to the correct Maid Center workflow.</p>
          </div>
          <div className="final-cta-actions">
            <Link className="button" href="/register">Create an account <ArrowRight size={18}/></Link>
            <Link className="button secondary" href="/auth">Sign in</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="shell footer-grid expanded-footer">
          <div>
            <div className="brand"><span className="brand-mark">MC</span><span>Maid Center <b>Zambia</b></span></div>
            <p>Structured connections between households, businesses and household professionals in Zambia.</p>
          </div>
          <div><strong>Platform</strong><Link href="/services">Services</Link><Link href="/process">How it works</Link><Link href="/professionals">Professionals</Link><Link href="/register">Registration</Link></div>
          <div><strong>Company</strong><Link href="/about">About</Link><Link href="/faq">FAQ</Link><Link href="/auth">Sign in</Link><Link href="/dashboard">My account</Link></div>
          <div><strong>Service area</strong><span>Lusaka, Zambia</span><span>Additional service areas can be added as operations expand.</span></div>
        </div>
        <div className="shell copyright">© 2026 Maid Center Zambia. Household staffing and placement platform.</div>
      </footer>
    </main>
  );
}

function ProcessStep({ icon, n, title, copy }: { icon: React.ReactNode; n: string; title: string; copy: string }) {
  return <article className="process-step"><div className="process-step-icon">{icon}</div><div><span>{n}</span><h3>{title}</h3><p>{copy}</p></div></article>;
}
