"use client";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export type PublicAccountRole = "maid" | "employer";

export interface RegisterAccountInput {
  email: string;
  password: string;
  displayName: string;
  role: PublicAccountRole;
  phone?: string;
}

export async function registerFirebaseAccount({
  email,
  password,
  displayName,
  role,
  phone = "",
}: RegisterAccountInput) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim().toLowerCase(),
    password,
  );

  await updateProfile(credential.user, { displayName: displayName.trim() });

  await setDoc(doc(db, "users", credential.user.uid), {
    uid: credential.user.uid,
    email: credential.user.email,
    displayName: displayName.trim(),
    phone: phone.trim(),
    role,
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return credential.user;
}

export async function signInFirebaseAccount(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim().toLowerCase(),
    password,
  );

  return credential.user;
}

export async function signOutFirebaseAccount() {
  await signOut(auth);
}

export function subscribeToFirebaseAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
