"use client";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "./firebase";

export type PublicAccountRole = "maid" | "employer";

export interface FirebaseUserProfile {
  uid: string;
  email: string | null;
  displayName: string;
  phone: string;
  role: PublicAccountRole;
  status: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface RegisterAccountInput {
  email: string;
  password: string;
  displayName: string;
  role: PublicAccountRole;
  phone?: string;
}

export interface MaidProfileInput {
  fullName: string;
  phone: string;
  dateOfBirth: string;
  nrcNumber: string;
  area: string;
  experienceYears: number;
  workType: string;
  expectedRate: number;
  services: string;
  languages: string;
  workHistory: string;
  reference1Name: string;
  reference1Phone: string;
  reference2Name: string;
  reference2Phone: string;
  emergencyName: string;
  emergencyPhone: string;
  profilePhoto?: File | null;
  nrcDocument?: File | null;
}

export interface EmployerProfileInput {
  fullName: string;
  phone: string;
  email: string;
  area: string;
  service: string;
  startDate: string;
  schedule: string;
  budget: number;
  householdSize: number;
  requirements: string;
}

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function uploadPrivateUserFile(uid: string, folder: string, file?: File | null) {
  if (!file) return null;
  const objectRef = ref(storage, `users/${uid}/${folder}/${Date.now()}-${safeFileName(file.name)}`);
  await uploadBytes(objectRef, file, { contentType: file.type || undefined });
  return getDownloadURL(objectRef);
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

export async function registerMaidAccount(
  account: Omit<RegisterAccountInput, "role">,
  profile: MaidProfileInput,
) {
  const user = await registerFirebaseAccount({ ...account, role: "maid" });
  const [profilePhotoURL, nrcDocumentURL] = await Promise.all([
    uploadPrivateUserFile(user.uid, "profile", profile.profilePhoto),
    uploadPrivateUserFile(user.uid, "verification", profile.nrcDocument),
  ]);

  await setDoc(doc(db, "maids", user.uid), {
    uid: user.uid,
    fullName: profile.fullName.trim(),
    phone: profile.phone.trim(),
    dateOfBirth: profile.dateOfBirth,
    nrcNumber: profile.nrcNumber.trim(),
    area: profile.area.trim(),
    experienceYears: Number(profile.experienceYears) || 0,
    workType: profile.workType,
    expectedRate: Number(profile.expectedRate) || 0,
    services: profile.services.trim(),
    languages: profile.languages.trim(),
    workHistory: profile.workHistory.trim(),
    references: [
      { name: profile.reference1Name.trim(), phone: profile.reference1Phone.trim() },
      { name: profile.reference2Name.trim(), phone: profile.reference2Phone.trim() },
    ],
    emergencyContact: {
      name: profile.emergencyName.trim(),
      phone: profile.emergencyPhone.trim(),
    },
    profilePhotoURL,
    nrcDocumentURL,
    verificationStatus: "pending",
    availability: "available",
    profileViews: 0,
    rating: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return user;
}

export async function registerEmployerAccount(
  account: Omit<RegisterAccountInput, "role">,
  profile: EmployerProfileInput,
) {
  const user = await registerFirebaseAccount({ ...account, role: "employer" });

  await setDoc(doc(db, "employers", user.uid), {
    uid: user.uid,
    fullName: profile.fullName.trim(),
    phone: profile.phone.trim(),
    email: profile.email.trim().toLowerCase(),
    area: profile.area.trim(),
    service: profile.service,
    preferredStartDate: profile.startDate,
    schedule: profile.schedule.trim(),
    budget: Number(profile.budget) || 0,
    householdSize: Number(profile.householdSize) || 1,
    requirements: profile.requirements.trim(),
    verificationStatus: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return user;
}

export async function signInFirebaseAccount(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim().toLowerCase(),
    password,
  );
  return credential.user;
}

export async function sendFirebasePasswordReset(email: string) {
  await sendPasswordResetEmail(auth, email.trim().toLowerCase());
}

export async function signOutFirebaseAccount() {
  await signOut(auth);
}

export async function getFirebaseUserProfile(uid: string): Promise<FirebaseUserProfile | null> {
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.exists() ? (snapshot.data() as FirebaseUserProfile) : null;
}

export async function updateFirebaseUserPhone(uid: string, phone: string) {
  await updateDoc(doc(db, "users", uid), {
    phone: phone.trim(),
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToFirebaseAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
