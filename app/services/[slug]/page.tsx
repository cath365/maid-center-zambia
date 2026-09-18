import Link from "next/link";
import { ArrowLeft, ArrowRight, Baby, Building2, CheckCircle2, Clock3, House, ShieldCheck, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import styles from "./service-detail.module.css";

const serviceMap = {
  "home-maid": {
    title: "Home maid",
    eyebrow: "Household support",
    subtitle: "Reliable day-to-day help for a well-managed home.",
    description: "Home maid placements are designed for households that need dependable support with regular cleaning, laundry, organisation and everyday home routines.",
    icon: House,
    idealFor: "Families, professionals, shared homes and households that need recurring support.",
    schedule: "Full-time, part-time, live-in or schedule-based arrangements can be discussed during placement.",
    includes: ["General household cleaning", "Laundry and ironing", "Kitchen, bedroom and living-area organisation", "Routine household support", "Placement matched to your schedule and requirements"],
  },
  "nanny-support": {
    title: "Nanny support",
    eyebrow: "Childcare support",
    subtitle: "Practical childcare matched to your family routine.",
    description: "Nanny support helps families find an adult childcare professional whose availability and experience fit the household's daily requirements.",
    icon: Baby,
    idealFor: "Parents and guardians who need regular or schedule-based childcare support at home.",
    schedule: "Availability can be matched around working hours, school routines and agreed household schedules.",
    includes: ["Child supervision", "Support with feeding and daily routines", "Light child-related housekeeping", "Schedule matching", "Reference and profile review before placement"],
  },
  "once-off-cleaning": {
    title: "Once-off cleaning",
    eyebrow: "Flexible cleaning",
    subtitle: "Focused cleaning support when you need it most.",
    description: "Once-off cleaning is for households that need a concentrated cleaning service without committing to a recurring placement.",
    icon: Sparkles,
    idealFor: "Moving, events, deep-cleaning days, post-renovation cleaning and occasional household resets.",
    schedule: "The date, duration and cleaning priorities are agreed before matching a suitable cleaner.",
    includes: ["Deep household cleaning", "Moving-in or moving-out cleaning", "Special-event preparation or clean-up", "Post-renovation cleaning support", "One-time service without a long-term commitment"],
  },
  "office-cleaning": {
    title: "Office cleaning",
    eyebrow: "Workplace support",
    subtitle: "Structured cleaning for professional spaces.",
    description: "Office cleaning provides reliable cleaning support for workplaces that need a defined recurring or flexible cleaning schedule.",
    icon: Building2,
    idealFor: "Offices, studios, shops, clinics and other small-to-medium professional spaces.",
    schedule: "Morning, evening or agreed recurring schedules can be defined according to workplace requirements.",
    includes: ["Routine workplace cleaning", "Floors and shared areas", "Washroom and kitchen-area cleaning", "Workstation and common-area support", "Flexible recurring schedules"],
  },
} as const;

type ServiceSlug = keyof typeof serviceMap;

export function generateStaticParams() {
  return Object.keys(serviceMap).map((slug) => ({ slug }));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = serviceMap[slug as ServiceSlug];
  if (!service) notFound();
  const Icon = service.icon;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.shell}>
          <Link className={styles.brand} href="/"><span>MC</span><strong>Maid Center <b>Zambia</b></strong></Link>
          <nav><Link href="/">Home</Link><Link className={styles.active} href="/services">Services</Link><Link href="/process">Our process</Link><Link href="/register">Registration</Link></nav>
          <Link className={styles.signIn} href="/auth">Sign in</Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.copy}>
            <Link className={styles.back} href="/services"><ArrowLeft size={17}/> All services</Link>
            <span className={styles.eyebrow}>{service.eyebrow}</span>
            <h1>{service.title}</h1>
            <h2>{service.subtitle}</h2>
            <p>{service.description}</p>
            <div className={styles.actions}>
              <Link className={styles.primary} href="/register">Request this service <ArrowRight size={18}/></Link>
              <Link className={styles.secondary} href="/register">Apply for work</Link>
            </div>
          </div>
          <div className={styles.iconPanel}>
            <div className={styles.iconCircle}><Icon aria-hidden="true" /></div>
            <strong>{service.title}</strong>
            <span>Professional • Reviewed • Matched</span>
          </div>
        </div>
      </section>

      <section className={styles.details}>
        <div className={styles.detailGrid}>
          <article className={styles.mainCard}>
            <span className={styles.label}>What is included</span>
            <h2>Service coverage</h2>
            <ul>{service.includes.map((item) => <li key={item}><CheckCircle2 size={20}/><span>{item}</span></li>)}</ul>
          </article>
          <div className={styles.sideCards}>
            <article><ShieldCheck/><div><strong>Who it is for</strong><p>{service.idealFor}</p></div></article>
            <article><Clock3/><div><strong>Scheduling</strong><p>{service.schedule}</p></div></article>
          </div>
        </div>
      </section>

      <section className={styles.process}>
        <div className={styles.processInner}>
          <div><span className={styles.eyebrow}>Placement process</span><h2>A clear path from request to placement.</h2></div>
          <div className={styles.steps}>
            <div><span>01</span><strong>Submit requirements</strong><p>Tell us the service, location and schedule you need.</p></div>
            <div><span>02</span><strong>Review</strong><p>Requirements and available profiles are reviewed.</p></div>
            <div><span>03</span><strong>Shortlist</strong><p>Suitable professionals are identified for your request.</p></div>
            <div><span>04</span><strong>Placement</strong><p>Interview, placement and follow-up are coordinated.</p></div>
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div><span className={styles.label}>Need this service?</span><h2>Start your {service.title.toLowerCase()} request.</h2></div>
        <Link className={styles.primary} href="/register">Get started <ArrowRight size={18}/></Link>
      </section>
    </main>
  );
}
