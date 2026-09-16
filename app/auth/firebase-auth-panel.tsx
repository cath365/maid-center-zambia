"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  registerFirebaseAccount,
  sendFirebasePasswordReset,
  signInFirebaseAccount,
} from "@/lib/firebase-auth";
import styles from "./auth.module.css";

export function FirebaseAuthPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [role, setRole] = useState<"maid" | "employer">("maid");
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const formEmail = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    try {
      if (mode === "signin") {
        await signInFirebaseAccount(formEmail, password);
        toast.success("Welcome back.");
        router.push("/dashboard");
        return;
      }

      const displayName = String(form.get("displayName") || "").trim();
      const phone = String(form.get("phone") || "").trim();
      await registerFirebaseAccount({
        email: formEmail,
        password,
        displayName,
        phone,
        role,
      });
      toast.success("Account created successfully.");
      router.push(role === "maid" ? "/#register" : "/#register");
    } catch (error) {
      toast.error(firebaseMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword() {
    if (!email.trim()) {
      toast.error("Enter your email address first.");
      return;
    }
    try {
      await sendFirebasePasswordReset(email);
      toast.success("Password reset email sent.");
    } catch (error) {
      toast.error(firebaseMessage(error));
    }
  }

  return (
    <div className={styles.authCard}>
      <Toaster richColors position="top-center" />
      <div className={styles.switcher}>
        <button type="button" className={mode === "signin" ? styles.active : ""} onClick={() => setMode("signin")}>Sign in</button>
        <button type="button" className={mode === "register" ? styles.active : ""} onClick={() => setMode("register")}>Create account</button>
      </div>

      <div className={styles.cardIntro}>
        <span>{mode === "signin" ? "Account access" : "New account"}</span>
        <h2>{mode === "signin" ? "Sign in to your dashboard" : "Create your Maid Center account"}</h2>
        <p>{mode === "signin" ? "Use the email and password registered with Maid Center Zambia." : "Choose the account type that matches how you will use the platform."}</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {mode === "register" && (
          <>
            <div className={styles.roleChooser}>
              <button type="button" className={role === "maid" ? styles.selectedRole : ""} onClick={() => setRole("maid")}>
                <strong>I am a maid / worker</strong><small>Create a professional profile</small>
              </button>
              <button type="button" className={role === "employer" ? styles.selectedRole : ""} onClick={() => setRole("employer")}>
                <strong>I need household staff</strong><small>Create an employer profile</small>
              </button>
            </div>
            <label><span>Full name</span><input name="displayName" required minLength={3} autoComplete="name" /></label>
            <label><span>Phone number</span><input name="phone" required inputMode="tel" autoComplete="tel" /></label>
          </>
        )}
        <label><span>Email address</span><input name="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label><span>Password</span><input name="password" type="password" required minLength={6} autoComplete={mode === "signin" ? "current-password" : "new-password"} /></label>

        {mode === "signin" && <button type="button" className={styles.resetLink} onClick={resetPassword}>Forgot password?</button>}
        <button className={styles.submit} type="submit" disabled={busy}>
          {busy ? <><Loader2 size={18} className={styles.spin} />Please wait…</> : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      {mode === "register" && <p className={styles.note}>After creating your account, complete the registration form on the home page so Maid Center can verify your profile.</p>}
    </div>
  );
}

function firebaseMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Something went wrong.";
  if (message.includes("auth/email-already-in-use")) return "An account already exists for this email.";
  if (message.includes("auth/invalid-credential") || message.includes("auth/wrong-password")) return "Incorrect email or password.";
  if (message.includes("auth/weak-password")) return "Use a stronger password with at least 6 characters.";
  if (message.includes("auth/invalid-email")) return "Enter a valid email address.";
  return message.replace("Firebase: ", "");
}
