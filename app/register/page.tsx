import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { RegistrationForms } from "../registration-forms";

export default function RegisterPage(){
  return <main>
    <header className="site-header"><div className="shell nav"><Link className="brand" href="/"><span className="brand-mark">MC</span><span>Maid Center <b>Zambia</b></span></Link><nav><Link href="/services">Services</Link><Link href="/process">Our process</Link><Link href="/register">Registration</Link><Link href="/dashboard">My account</Link></nav><Link className="button button-small" href="/auth">Sign in</Link></div></header>
    <section className="section register-section" style={{minHeight:"calc(100vh - 120px)"}}>
      <div className="shell">
        <Link href="/" className="back-link" style={{display:"inline-flex",marginBottom:24}}><ArrowLeft size={17}/>Back to home</Link>
        <div className="section-heading"><span className="eyebrow dark">Registration</span><h1 style={{fontSize:"clamp(2.2rem,5vw,4rem)",marginBottom:14}}>Choose how you want to get started</h1><p>Create your secure account while submitting your maid profile or employer request. Private identity and verification details are never displayed publicly.</p></div>
        <RegistrationForms/>
        <div style={{display:"flex",gap:12,alignItems:"center",justifyContent:"center",marginTop:28,color:"var(--muted, #64748b)",textAlign:"center"}}><ShieldCheck size={20}/><span>Your registration information is handled through Firebase authentication and protected account records.</span></div>
      </div>
    </section>
  </main>
}
