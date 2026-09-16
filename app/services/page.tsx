import Link from "next/link";
import { ArrowRight, Baby, Building2, CheckCircle2, House, ShieldCheck, Sparkles } from "lucide-react";
import styles from "./services.module.css";

const services = [
  {
    id: "home-maid",
    href: "/services/home-maid",
    number: "01",
    title: "Home maid",
    subtitle: "Reliable day-to-day household support",
    description: "For homes that need consistent help with cleaning, laundry, organisation and general household routines.",
    includes: ["General house cleaning", "Laundry and ironing", "Kitchen and room organisation", "Flexible full-time, part-time or live-in arrangements"],
    icon: House,
  },
  {
    id: "nanny-support",
    href: "/services/nanny-support",
    number: "02",
    title: "Nanny support",
    subtitle: "Practical childcare for busy families",
    description: "Matched childcare support for families that need a responsible adult to assist with children and their daily routine.",
    includes: ["Child supervision", "Help with feeding and routines", "Light child-related housekeeping", "Schedule matching based on your household needs"],
    icon: Baby,
  },
  {
    id: "once-off-cleaning",
    href: "/services/once-off-cleaning",
    number: "03",
    title: "Once-off cleaning",
    subtitle: "Focused cleaning when you need extra help",
    description: "Suitable for deep cleaning, moving, events, post-renovation cleaning or a one-time household reset.",
    includes: ["Deep household cleaning", "Moving-in or moving-out cleaning", "Special occasion preparation", "One-time bookings without long-term commitment"],
    icon: Sparkles,
  },
  {
    id: "office-cleaning",
    href: "/services/office-cleaning",
    number: "04",
    title: "Office cleaning",
    subtitle: "Professional support for workplaces",
    description: "Flexible cleaning support for offices, studios, shops and small businesses that need a cleaner working to a defined schedule.",
    includes: ["Routine workplace cleaning", "Floors and shared areas", "Washroom and kitchen-area cleaning", "Flexible recurring schedules"],
    icon: Building2,
  },
];

export default function ServicesPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.shell}>
          <Link className={styles.brand} href="/"><span>MC</span><strong>Maid Center <b>Zambia</b></strong></Link>
          <nav><Link href="/">Home</Link><Link className={styles.active} href="/services">Services</Link><Link href="/#how">Our process</Link><Link href="/#register">Registration</Link><Link href="/dashboard">My account</Link></nav>
          <Link className={styles.signIn} href="/auth">Sign in</Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <span className={styles.eyebrow}>Our services</span>
            <h1>Household support built around real needs.</h1>
            <p>Choose the kind of support you need. Maid Center Zambia helps structure the request, verify applicants and manage the placement process.</p>
            <div className={styles.heroActions}>
              <Link href="/#register" className={styles.primary}>Request a professional <ArrowRight size={18}/></Link>
              <Link href="/#register" className={styles.secondary}>Apply for work</Link>
            </div>
          </div>
          <div className={styles.heroCard}>
            <ShieldCheck size={34}/>
            <strong>Structured placement</strong>
            <p>Profiles, references and requirements are reviewed before matching.</p>
          </div>
        </div>
      </section>

      <section className={styles.servicesSection}>
        <div className={styles.servicesIntro}>
          <span className={styles.eyebrowDark}>Available services</span>
          <h2>Choose the support that fits your home or workplace</h2>
          <p>Each request is reviewed before a worker is shortlisted.</p>
        </div>
        <div className={styles.serviceList}>
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <article id={service.id} className={`${styles.serviceRow} ${index % 2 ? styles.reverse : ""}`} key={service.id}>
                <div className={styles.illustration}>
                  <div className={styles.iconCircle}><Icon aria-hidden="true" /></div>
                  <span className={styles.iconLabel}>{service.title}</span>
                </div>
                <div className={styles.serviceCopy}>
                  <span className={styles.number}>{service.number}</span>
                  <h3>{service.title}</h3>
                  <strong>{service.subtitle}</strong>
                  <p>{service.description}</p>
                  <ul>{service.includes.map(item => <li key={item}><CheckCircle2 size={17}/><span>{item}</span></li>)}</ul>
                  <Link href={service.href} className={styles.serviceCta}>View full service <ArrowRight size={17}/></Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.process}>
        <div className={styles.processInner}>
          <div><span className={styles.eyebrow}>Simple process</span><h2>Tell us what you need. We handle the matching.</h2></div>
          <div className={styles.processSteps}>{[["01","Submit your request"],["02","We review the requirement"],["03","Suitable candidates are shortlisted"],["04","Interview, placement and follow-up"]].map(([n,t]) => <div key={n}><span>{n}</span><strong>{t}</strong></div>)}</div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div><span className={styles.eyebrowDark}>Ready to begin?</span><h2>Find the right household support with a clearer process.</h2></div>
        <Link href="/#register" className={styles.primary}>Start your request <ArrowRight size={18}/></Link>
      </section>
    </main>
  );
}
