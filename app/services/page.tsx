import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import styles from "./services.module.css";

const services = [
  {
    id: "home-maid",
    number: "01",
    title: "Home maid",
    subtitle: "Reliable day-to-day household support",
    description: "For homes that need consistent help with cleaning, laundry, organisation and general household routines.",
    includes: ["General house cleaning", "Laundry and ironing", "Kitchen and room organisation", "Flexible full-time, part-time or live-in arrangements"],
    icon: <MaidIcon />,
  },
  {
    id: "nanny",
    number: "02",
    title: "Nanny support",
    subtitle: "Practical childcare for busy families",
    description: "Matched childcare support for families that need a responsible adult to assist with children and their daily routine.",
    includes: ["Child supervision", "Help with feeding and routines", "Light child-related housekeeping", "Schedule matching based on your household needs"],
    icon: <NannyIcon />,
  },
  {
    id: "once-off",
    number: "03",
    title: "Once-off cleaning",
    subtitle: "Focused cleaning when you need extra help",
    description: "Suitable for deep cleaning, moving, events, post-renovation cleaning or a one-time household reset.",
    includes: ["Deep household cleaning", "Moving-in or moving-out cleaning", "Special occasion preparation", "One-time bookings without long-term commitment"],
    icon: <CleaningToolsIcon />,
  },
  {
    id: "office",
    number: "04",
    title: "Office cleaning",
    subtitle: "Professional support for workplaces",
    description: "Flexible cleaning support for offices, studios, shops and small businesses that need a cleaner working to a defined schedule.",
    includes: ["Routine workplace cleaning", "Floors and shared areas", "Washroom and kitchen-area cleaning", "Flexible recurring schedules"],
    icon: <ProfessionalCleanerIcon />,
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
          {services.map((service, index) => (
            <article id={service.id} className={`${styles.serviceRow} ${index % 2 ? styles.reverse : ""}`} key={service.id}>
              <div className={styles.illustration}>{service.icon}</div>
              <div className={styles.serviceCopy}>
                <span className={styles.number}>{service.number}</span>
                <h3>{service.title}</h3>
                <strong>{service.subtitle}</strong>
                <p>{service.description}</p>
                <ul>{service.includes.map(item => <li key={item}><CheckCircle2 size={17}/><span>{item}</span></li>)}</ul>
                <Link href="/#register" className={styles.serviceCta}>Request this service <ArrowRight size={17}/></Link>
              </div>
            </article>
          ))}
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

function CleaningToolsIcon(){return <svg viewBox="0 0 420 360" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"><path d="M80 135h150v32H80zM95 167l8 145h108l8-145M235 255c-37-31-88-8-88 34 0 22 17 38 39 38h98c24 0 29-27 8-34-15-5-26-16-28-32-2-14-14-28-29-32zM235 255L340 77c11-18-11-31-23-14L210 233M152 72v-28M138 58h28M210 98V70M196 84h28M285 183v-28M271 169h28"/></g></svg>}
function MaidIcon(){return <svg viewBox="0 0 420 420" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"><path d="M128 122c-22 0-33-27-17-43 7-7 17-8 26-5 15-35 67-50 102-12 23-8 48 9 48 34 0 12-6 22-16 28M138 118c0 70 31 110 72 110s72-40 72-110M151 130c18-5 35-19 45-37 21 24 47 34 79 36M156 217l-12 52-43 24c-28 16-43 43-43 76v23h304v-23c0-33-15-60-43-76l-43-24-12-52M147 268l63 49 63-49M128 319l18 73M292 319l-18 73"/></g></svg>}
function NannyIcon(){return <svg viewBox="0 0 500 360" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round"><path d="M118 214c0-44-32-72-65-72-31 0-53 24-53 55 0 41 29 69 68 69h70M54 148c0-13 9-22 20-22 12 0 22 9 22 22M295 88c0-43-36-70-73-70-40 0-70 27-70 67 0 43 34 69 72 69 37 0 71-26 71-66M169 85c19 12 49 16 76 2M294 102c23 7 39 27 43 52l17 112M170 154c-28 16-45 45-46 82v89h188v-88c0-38-19-68-48-84M147 189l52 40 66-52M177 222l-27 46M265 177l-35 68M150 267l-49-1M101 266l-34 25M201 228l-37 3"/></g></svg>}
function ProfessionalCleanerIcon(){return <svg viewBox="0 0 420 430" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round"><circle cx="220" cy="84" r="48"/><path d="M180 81c21-11 44-24 68-2M173 118l-20 53-31 57M264 118l29 54 27 70M160 172h113v138H145l15-138M184 172v138M235 172v138M152 228L93 340M93 340h-32M91 340l11 31M303 244l41 99M344 343h31M342 343l-10 31M123 232l-38 124M77 356h38M313 247l34 110"/></g></svg>}
