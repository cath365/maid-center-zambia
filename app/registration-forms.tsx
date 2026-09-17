"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  FileCheck2,
  Home,
  Loader2,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import {
  registerEmployerAccount,
  registerMaidAccount,
  saveEmployerProfile,
  saveMaidProfile,
  type EmployerProfileInput,
  type MaidProfileInput,
} from "@/lib/firebase-auth";

const workerSteps = ["Account", "Profile", "Experience", "References", "Documents", "Review"];
const clientSteps = ["Account", "Service", "Requirements", "Review"];

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`${label} timed out. Please check your connection and try again.`)), ms)),
  ]);
}

export function RegistrationForms() {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [workerStep, setWorkerStep] = useState(0);
  const [clientStep, setClientStep] = useState(0);
  const workerForm = useRef<HTMLFormElement>(null);
  const clientForm = useRef<HTMLFormElement>(null);

  async function finishRegistration(message: string) {
    toast.success(message);
    setBusy(null);
    router.replace("/dashboard");
    router.refresh();
  }

  function validateCurrentStep(form: HTMLFormElement | null, step: number) {
    if (!form) return false;
    const section = form.querySelector<HTMLElement>(`[data-step="${step}"]`);
    if (!section) return false;
    const fields = Array.from(section.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea"));
    for (const field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    return true;
  }

  function validateEntireForm(form: HTMLFormElement, setStep: (step: number) => void) {
    const fields = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea"));
    for (const field of fields) {
      if (!field.checkValidity()) {
        const section = field.closest<HTMLElement>("[data-step]");
        if (section?.dataset.step) setStep(Number(section.dataset.step));
        window.setTimeout(() => field.reportValidity(), 40);
        return false;
      }
    }
    return true;
  }

  async function submitWorker(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || !validateEntireForm(e.currentTarget, setWorkerStep)) return;
    setBusy("worker");
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") || "").trim();
    const password = String(f.get("password") || "");
    const profile: MaidProfileInput = {
      fullName: String(f.get("fullName") || ""),
      phone: String(f.get("phone") || ""),
      dateOfBirth: String(f.get("dateOfBirth") || ""),
      nrcNumber: String(f.get("nrcNumber") || ""),
      area: String(f.get("area") || ""),
      experienceYears: Number(f.get("experienceYears") || 0),
      workType: String(f.get("workType") || ""),
      expectedRate: Number(f.get("expectedRate") || 0),
      services: String(f.get("services") || ""),
      languages: String(f.get("languages") || ""),
      workHistory: String(f.get("workHistory") || ""),
      reference1Name: String(f.get("reference1Name") || ""),
      reference1Phone: String(f.get("reference1Phone") || ""),
      reference2Name: String(f.get("reference2Name") || ""),
      reference2Phone: String(f.get("reference2Phone") || ""),
      emergencyName: String(f.get("emergencyName") || ""),
      emergencyPhone: String(f.get("emergencyPhone") || ""),
      profilePhoto: f.get("profilePhoto") instanceof File ? f.get("profilePhoto") as File : null,
      nrcDocument: f.get("nrcDocument") instanceof File ? f.get("nrcDocument") as File : null,
    };

    try {
      if (auth.currentUser) {
        if (auth.currentUser.email?.toLowerCase() !== email.toLowerCase()) throw new Error("Use the email address of the account currently signed in.");
        await withTimeout(saveMaidProfile(auth.currentUser, profile), 45000, "Maid registration");
      } else {
        if (password.length < 6) throw new Error("Password must contain at least 6 characters.");
        await withTimeout(registerMaidAccount({ email, password, displayName: profile.fullName, phone: profile.phone }, profile), 60000, "Maid registration");
      }
      await finishRegistration("Your professional profile was submitted for verification.");
    } catch (error) {
      setBusy(null);
      toast.error(firebaseMessage(error));
    }
  }

  async function submitEmployer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || !validateEntireForm(e.currentTarget, setClientStep)) return;
    setBusy("client");
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") || "").trim();
    const password = String(f.get("password") || "");
    const profile: EmployerProfileInput = {
      fullName: String(f.get("fullName") || ""),
      phone: String(f.get("phone") || ""),
      email,
      area: String(f.get("area") || ""),
      service: String(f.get("service") || ""),
      startDate: String(f.get("startDate") || ""),
      schedule: String(f.get("schedule") || ""),
      budget: Number(f.get("budget") || 0),
      householdSize: Number(f.get("householdSize") || 1),
      requirements: String(f.get("requirements") || ""),
    };

    try {
      if (auth.currentUser) {
        if (auth.currentUser.email?.toLowerCase() !== email.toLowerCase()) throw new Error("Use the email address of the account currently signed in.");
        await withTimeout(saveEmployerProfile(auth.currentUser, profile), 30000, "Employer registration");
      } else {
        if (password.length < 6) throw new Error("Password must contain at least 6 characters.");
        await withTimeout(registerEmployerAccount({ email, password, displayName: profile.fullName, phone: profile.phone }, profile), 45000, "Employer registration");
      }
      await finishRegistration("Your staffing request was saved successfully.");
    } catch (error) {
      setBusy(null);
      toast.error(firebaseMessage(error));
    }
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <Tabs defaultValue="worker" className="registration-tabs registration-wizard-tabs">
        <TabsList className="tab-list registration-type-tabs">
          <TabsTrigger value="worker"><UserRound /> Apply for work</TabsTrigger>
          <TabsTrigger value="client"><Home /> Find household support</TabsTrigger>
        </TabsList>

        <TabsContent value="worker">
          <form ref={workerForm} className="form-card wizard-card" onSubmit={submitWorker} noValidate>
            <WizardHeader
              label="Worker application"
              title="Build your professional profile"
              copy="Complete one section at a time. Your private identity and reference information is used for verification and is not published as part of your public profile."
              steps={workerSteps}
              activeStep={workerStep}
            />

            <WizardSection step={0} activeStep={workerStep} title="Create your account" copy="Use an email address and phone number you can access. You will use this account to track your profile.">
              <F label="Full name"><input name="fullName" required minLength={3} autoComplete="name" placeholder="Your legal full name" /></F>
              <F label="Phone number"><input name="phone" required inputMode="tel" autoComplete="tel" placeholder="e.g. 097..." /></F>
              <F label="Email address"><input name="email" type="email" required autoComplete="email" placeholder="you@example.com" /></F>
              <F label="Password"><input name="password" type="password" minLength={6} autoComplete="new-password" placeholder="At least 6 characters" /></F>
            </WizardSection>

            <WizardSection step={1} activeStep={workerStep} title="Personal profile" copy="These details help Maid Center confirm identity and understand your location and availability.">
              <F label="Date of birth"><input name="dateOfBirth" type="date" required /></F>
              <F label="NRC number"><input name="nrcNumber" required placeholder="000000/00/0" /></F>
              <F label="Residential area"><input name="area" required placeholder="e.g. Chelstone, Lusaka" /></F>
              <F label="Preferred arrangement"><select name="workType" required defaultValue=""><option value="" disabled>Choose arrangement</option><option>Full-time</option><option>Part-time</option><option>Live-in</option><option>Once-off jobs</option></select></F>
            </WizardSection>

            <WizardSection step={2} activeStep={workerStep} title="Experience and services" copy="Describe the work you can confidently perform. Accurate profiles improve matching with employer requirements.">
              <F label="Years of experience"><input name="experienceYears" type="number" min="0" max="50" required /></F>
              <F label="Expected salary / rate (ZMW)"><input name="expectedRate" type="number" min="0" required /></F>
              <F label="Services offered" full><input name="services" required placeholder="Cleaning, laundry, cooking, childcare…" /></F>
              <F label="Languages spoken" full><input name="languages" required placeholder="English, Nyanja, Bemba…" /></F>
              <F label="Work history" full><textarea name="workHistory" rows={5} required placeholder="Tell us where you have worked, your duties and the experience you gained." /></F>
            </WizardSection>

            <WizardSection step={3} activeStep={workerStep} title="References and emergency contact" copy="Provide people who can confirm your previous work and a separate emergency contact where possible.">
              <F label="Reference 1 name"><input name="reference1Name" required /></F>
              <F label="Reference 1 phone"><input name="reference1Phone" required inputMode="tel" /></F>
              <F label="Reference 2 name"><input name="reference2Name" required /></F>
              <F label="Reference 2 phone"><input name="reference2Phone" required inputMode="tel" /></F>
              <F label="Emergency contact name"><input name="emergencyName" required /></F>
              <F label="Emergency contact phone"><input name="emergencyPhone" required inputMode="tel" /></F>
            </WizardSection>

            <WizardSection step={4} activeStep={workerStep} title="Documents" copy="Uploads support profile review. Keep files clear and readable. Sensitive verification documents are not meant for public display.">
              <UploadField icon={<Camera />} label="Profile photo" help="Optional. JPG, PNG or WebP."><input name="profilePhoto" type="file" accept="image/jpeg,image/png,image/webp" /></UploadField>
              <UploadField icon={<FileCheck2 />} label="NRC copy" help="Optional. JPG, PNG or PDF."><input name="nrcDocument" type="file" accept="image/jpeg,image/png,application/pdf" /></UploadField>
            </WizardSection>

            <WizardSection step={5} activeStep={workerStep} title="Review and submit" copy="Confirm the statements below, then submit your profile for review.">
              <div className="review-panel full">
                <ShieldCheck size={28} />
                <div><strong>Before you submit</strong><p>You can use Back to review any section. After submission, your account opens in the dashboard with your verification status.</p></div>
              </div>
              <Consent name="adultConfirmed" text="I confirm that I am at least 18 years old." />
              <Consent name="consent" text="I consent to identity and reference verification for placement purposes." />
            </WizardSection>

            <WizardFooter
              step={workerStep}
              count={workerSteps.length}
              busy={busy === "worker"}
              submitText="Submit profile for verification"
              onBack={() => setWorkerStep((s) => Math.max(0, s - 1))}
              onNext={() => validateCurrentStep(workerForm.current, workerStep) && setWorkerStep((s) => Math.min(workerSteps.length - 1, s + 1))}
            />
          </form>
        </TabsContent>

        <TabsContent value="client">
          <form ref={clientForm} className="form-card wizard-card" onSubmit={submitEmployer} noValidate>
            <WizardHeader
              label="Employer request"
              title="Tell us what support you need"
              copy="Create a secure employer account first, then describe the service, schedule and requirements for your household or workplace."
              steps={clientSteps}
              activeStep={clientStep}
            />

            <WizardSection step={0} activeStep={clientStep} title="Create your account" copy="These details identify the person responsible for the staffing request.">
              <F label="Full name"><input name="fullName" required autoComplete="name" /></F>
              <F label="Phone number"><input name="phone" required inputMode="tel" autoComplete="tel" /></F>
              <F label="Email address"><input name="email" type="email" required autoComplete="email" /></F>
              <F label="Password"><input name="password" type="password" minLength={6} autoComplete="new-password" placeholder="At least 6 characters" /></F>
            </WizardSection>

            <WizardSection step={1} activeStep={clientStep} title="Service and location" copy="Tell us the type of support you are requesting and where the placement will be based.">
              <F label="Area in Lusaka"><input name="area" required placeholder="e.g. Kabulonga, Woodlands" /></F>
              <F label="Service needed"><select name="service" required defaultValue=""><option value="" disabled>Choose service</option><option>Full-time maid</option><option>Part-time maid</option><option>Live-in maid</option><option>Nanny support</option><option>Once-off cleaning</option><option>Office cleaning</option></select></F>
              <F label="Preferred start date"><input name="startDate" type="date" required /></F>
              <F label="Household size"><input name="householdSize" type="number" min="1" max="30" required /></F>
            </WizardSection>

            <WizardSection step={2} activeStep={clientStep} title="Schedule and requirements" copy="Specific information helps the placement team identify profiles that fit your actual needs.">
              <F label="Budget (ZMW)"><input name="budget" type="number" min="0" required /></F>
              <F label="Working schedule"><input name="schedule" required placeholder="e.g. Monday–Friday, 07:00–17:00" /></F>
              <F label="Duties and requirements" full><textarea name="requirements" rows={6} required placeholder="Describe the main duties, experience you require, household expectations and any important schedule information." /></F>
            </WizardSection>

            <WizardSection step={3} activeStep={clientStep} title="Review and submit" copy="Confirm the employer responsibility statement and submit the request to your account.">
              <div className="review-panel full">
                <ShieldCheck size={28} />
                <div><strong>Privacy and safeguarding</strong><p>Worker personal contact and verification documents are not intended to be shared publicly. Placement details should be handled through the approved process.</p></div>
              </div>
              <Consent name="consent" text="I consent to client verification and agree to provide a safe, lawful and respectful working environment." />
            </WizardSection>

            <WizardFooter
              step={clientStep}
              count={clientSteps.length}
              busy={busy === "client"}
              submitText="Submit staffing request"
              onBack={() => setClientStep((s) => Math.max(0, s - 1))}
              onNext={() => validateCurrentStep(clientForm.current, clientStep) && setClientStep((s) => Math.min(clientSteps.length - 1, s + 1))}
            />
          </form>
        </TabsContent>
      </Tabs>
    </>
  );
}

function WizardHeader({ label, title, copy, steps, activeStep }: { label: string; title: string; copy: string; steps: string[]; activeStep: number }) {
  return (
    <div className="wizard-header">
      <div className="form-intro wizard-intro"><span>{label}</span><h3>{title}</h3><p>{copy}</p></div>
      <div className="wizard-progress" aria-label={`Step ${activeStep + 1} of ${steps.length}`}>
        <div className="wizard-progress-meta"><strong>Step {activeStep + 1} of {steps.length}</strong><span>{steps[activeStep]}</span></div>
        <div className="wizard-progress-track"><span style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} /></div>
        <div className="wizard-step-labels">{steps.map((step, index) => <span key={step} className={index === activeStep ? "active" : index < activeStep ? "complete" : ""}>{index < activeStep ? <CheckCircle2 size={14} /> : index + 1}<small>{step}</small></span>)}</div>
      </div>
    </div>
  );
}

function WizardSection({ step, activeStep, title, copy, children }: { step: number; activeStep: number; title: string; copy: string; children: React.ReactNode }) {
  return (
    <section className="wizard-step" data-step={step} hidden={step !== activeStep}>
      <div className="wizard-step-heading"><span>Section {step + 1}</span><h4>{title}</h4><p>{copy}</p></div>
      <div className="form-grid">{children}</div>
    </section>
  );
}

function WizardFooter({ step, count, busy, submitText, onBack, onNext }: { step: number; count: number; busy: boolean; submitText: string; onBack: () => void; onNext: () => void }) {
  const last = step === count - 1;
  return (
    <div className="wizard-footer">
      <button className="wizard-back" type="button" onClick={onBack} disabled={step === 0 || busy}><ArrowLeft size={17} /> Back</button>
      <span>{step + 1} / {count}</span>
      {last ? (
        <Button className="submit-button wizard-submit" disabled={busy} type="submit">{busy ? <><Loader2 className="spin" />Saving…</> : <>{submitText}<CheckCircle2 size={18} /></>}</Button>
      ) : (
        <button className="wizard-next" type="button" onClick={onNext}>Continue <ArrowRight size={17} /></button>
      )}
    </div>
  );
}

function F({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={`field ${full ? "full" : ""}`}><span>{label}</span>{children}</label>;
}

function UploadField({ icon, label, help, children }: { icon: React.ReactNode; label: string; help: string; children: React.ReactNode }) {
  return <label className="upload-field">{icon}<span><strong>{label}</strong><small>{help}</small></span>{children}</label>;
}

function Consent({ name, text }: { name: string; text: string }) {
  return <label className="consent full"><input name={name} type="checkbox" required /><span>{text}</span></label>;
}

function firebaseMessage(error: unknown) {
  const m = error instanceof Error ? error.message : "Please try again.";
  if (m.includes("auth/email-already-in-use")) return "An account already exists for this email. Sign in first, then complete the form.";
  if (m.includes("auth/weak-password")) return "Use a password with at least 6 characters.";
  if (m.includes("storage/unauthorized")) return "File upload is not allowed yet. Check Firebase Storage security rules.";
  if (m.includes("permission-denied")) return "Firebase security rules blocked this request. Check Firestore rules.";
  if (m.includes("timed out")) return m;
  return m.replace("Firebase: ", "");
}
