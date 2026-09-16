"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Tabs,TabsContent,TabsList,TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2,UserRound,Home } from "lucide-react";
import { auth } from "@/lib/firebase";
import {
  registerEmployerAccount,
  registerMaidAccount,
  saveEmployerProfile,
  saveMaidProfile,
  type EmployerProfileInput,
  type MaidProfileInput,
} from "@/lib/firebase-auth";

export function RegistrationForms(){
  const router=useRouter();
  const[busy,setBusy]=useState<string|null>(null);

  async function submitWorker(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();setBusy("worker");
    const f=new FormData(e.currentTarget);
    const email=String(f.get("email")||"").trim();
    const password=String(f.get("password")||"");
    const profile:MaidProfileInput={
      fullName:String(f.get("fullName")||""),phone:String(f.get("phone")||""),dateOfBirth:String(f.get("dateOfBirth")||""),nrcNumber:String(f.get("nrcNumber")||""),area:String(f.get("area")||""),experienceYears:Number(f.get("experienceYears")||0),workType:String(f.get("workType")||""),expectedRate:Number(f.get("expectedRate")||0),services:String(f.get("services")||""),languages:String(f.get("languages")||""),workHistory:String(f.get("workHistory")||""),reference1Name:String(f.get("reference1Name")||""),reference1Phone:String(f.get("reference1Phone")||""),reference2Name:String(f.get("reference2Name")||""),reference2Phone:String(f.get("reference2Phone")||""),emergencyName:String(f.get("emergencyName")||""),emergencyPhone:String(f.get("emergencyPhone")||""),profilePhoto:f.get("profilePhoto") instanceof File ? f.get("profilePhoto") as File:null,nrcDocument:f.get("nrcDocument") instanceof File ? f.get("nrcDocument") as File:null,
    };
    try{
      if(auth.currentUser){
        if(auth.currentUser.email?.toLowerCase()!==email.toLowerCase())throw new Error("Use the email address of the account currently signed in.");
        await saveMaidProfile(auth.currentUser,profile);
      }else{
        if(password.length<6)throw new Error("Password must contain at least 6 characters.");
        await registerMaidAccount({email,password,displayName:profile.fullName,phone:profile.phone},profile);
      }
      toast.success("Maid profile submitted for verification.");
      router.push("/dashboard");
    }catch(error){toast.error(firebaseMessage(error))}finally{setBusy(null)}
  }

  async function submitEmployer(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();setBusy("client");
    const f=new FormData(e.currentTarget);
    const email=String(f.get("email")||"").trim();
    const password=String(f.get("password")||"");
    const profile:EmployerProfileInput={fullName:String(f.get("fullName")||""),phone:String(f.get("phone")||""),email,area:String(f.get("area")||""),service:String(f.get("service")||""),startDate:String(f.get("startDate")||""),schedule:String(f.get("schedule")||""),budget:Number(f.get("budget")||0),householdSize:Number(f.get("householdSize")||1),requirements:String(f.get("requirements")||"")};
    try{
      if(auth.currentUser){
        if(auth.currentUser.email?.toLowerCase()!==email.toLowerCase())throw new Error("Use the email address of the account currently signed in.");
        await saveEmployerProfile(auth.currentUser,profile);
      }else{
        if(password.length<6)throw new Error("Password must contain at least 6 characters.");
        await registerEmployerAccount({email,password,displayName:profile.fullName,phone:profile.phone},profile);
      }
      toast.success("Employer request saved successfully.");
      router.push("/dashboard");
    }catch(error){toast.error(firebaseMessage(error))}finally{setBusy(null)}
  }

  return <><Toaster richColors position="top-center"/><Tabs defaultValue="worker" className="registration-tabs"><TabsList className="tab-list"><TabsTrigger value="worker"><UserRound/> Register for work</TabsTrigger><TabsTrigger value="client"><Home/> Find a maid</TabsTrigger></TabsList>
  <TabsContent value="worker"><form className="form-card" onSubmit={submitWorker}><Intro label="Worker application" title="Build your verified profile" copy="Your account and professional details are stored securely in Firebase for review."/><div className="form-grid"><F label="Full name"><input name="fullName" required minLength={3}/></F><F label="Phone number"><input name="phone" required inputMode="tel"/></F><F label="Email address"><input name="email" type="email" required autoComplete="email"/></F><F label="Password"><input name="password" type="password" minLength={6} placeholder="Only needed when creating a new account"/></F><F label="Date of birth"><input name="dateOfBirth" type="date" required/></F><F label="NRC number"><input name="nrcNumber" required placeholder="000000/00/0"/></F><F label="Residential area"><input name="area" required/></F><F label="Years of experience"><input name="experienceYears" type="number" min="0" max="50" required/></F><F label="Preferred arrangement"><select name="workType" required><option value="">Choose</option><option>Full-time</option><option>Part-time</option><option>Live-in</option><option>Once-off jobs</option></select></F><F label="Expected salary / rate (ZMW)"><input name="expectedRate" type="number" min="0" required/></F><F label="Services offered" full><input name="services" required placeholder="Cleaning, laundry, cooking, childcare…"/></F><F label="Languages spoken" full><input name="languages" required/></F><F label="Work history" full><textarea name="workHistory" rows={4} required/></F><F label="Reference 1 name"><input name="reference1Name" required/></F><F label="Reference 1 phone"><input name="reference1Phone" required/></F><F label="Reference 2 name"><input name="reference2Name" required/></F><F label="Reference 2 phone"><input name="reference2Phone" required/></F><F label="Emergency contact name"><input name="emergencyName" required/></F><F label="Emergency contact phone"><input name="emergencyPhone" required/></F><F label="Profile photo (optional)"><input name="profilePhoto" type="file" accept="image/jpeg,image/png,image/webp"/></F><F label="NRC copy (optional)"><input name="nrcDocument" type="file" accept="image/jpeg,image/png,application/pdf"/></F><Consent name="adultConfirmed" text="I confirm that I am at least 18 years old."/><Consent name="consent" text="I consent to identity and reference verification."/><Submit busy={busy==="worker"} text="Create account & submit profile"/></div></form></TabsContent>
  <TabsContent value="client"><form className="form-card" onSubmit={submitEmployer}><Intro label="Employer request" title="Tell us who your home needs" copy="Create a secure employer account and save your staffing requirements."/><div className="form-grid"><F label="Full name"><input name="fullName" required/></F><F label="Phone number"><input name="phone" required/></F><F label="Email address"><input name="email" type="email" required/></F><F label="Password"><input name="password" type="password" minLength={6} placeholder="Only needed when creating a new account"/></F><F label="Area in Lusaka"><input name="area" required/></F><F label="Service needed"><select name="service" required><option value="">Choose</option><option>Full-time maid</option><option>Part-time maid</option><option>Live-in maid</option><option>Nanny support</option><option>Once-off cleaning</option><option>Office cleaning</option></select></F><F label="Preferred start date"><input name="startDate" type="date" required/></F><F label="Working schedule" full><input name="schedule" required/></F><F label="Budget (ZMW)"><input name="budget" type="number" min="0" required/></F><F label="Household size"><input name="householdSize" type="number" min="1" max="30" required/></F><F label="Duties and requirements" full><textarea name="requirements" rows={5} required/></F><Consent name="consent" text="I consent to client verification and agree to provide a safe, respectful workplace."/><Submit busy={busy==="client"} text="Create account & submit request"/></div></form></TabsContent></Tabs></>
}

function F({label,children,full=false}:{label:string;children:React.ReactNode;full?:boolean}){return <label className={`field ${full?"full":""}`}><span>{label}</span>{children}</label>}
function Intro({label,title,copy}:{label:string;title:string;copy:string}){return <div className="form-intro"><span>{label}</span><h3>{title}</h3><p>{copy}</p></div>}
function Consent({name,text}:{name:string;text:string}){return <label className="consent full"><Checkbox name={name} required/><span>{text}</span></label>}
function Submit({busy,text}:{busy:boolean;text:string}){return <div className="full"><Button className="submit-button" disabled={busy} type="submit">{busy?<><Loader2 className="spin"/>Saving…</>:text}</Button></div>}
function firebaseMessage(error:unknown){const m=error instanceof Error?error.message:"Please try again.";if(m.includes("auth/email-already-in-use"))return "An account already exists for this email. Sign in first, then complete the form.";if(m.includes("auth/weak-password"))return "Use a password with at least 6 characters.";if(m.includes("storage/unauthorized"))return "File upload is not allowed yet. Check Firebase Storage security rules.";if(m.includes("permission-denied"))return "Firebase security rules blocked this request. Check Firestore rules.";return m.replace("Firebase: ","")}
