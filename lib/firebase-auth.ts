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
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "./firebase";

export type PublicAccountRole = "maid" | "employer";
export interface FirebaseUserProfile { uid:string; email:string|null; displayName:string; phone:string; role:PublicAccountRole; status:string; createdAt?:unknown; updatedAt?:unknown }
export interface RegisterAccountInput { email:string; password:string; displayName:string; role:PublicAccountRole; phone?:string }
export interface MaidProfileInput { fullName:string; phone:string; dateOfBirth:string; nrcNumber:string; area:string; experienceYears:number; workType:string; expectedRate:number; services:string; languages:string; workHistory:string; reference1Name:string; reference1Phone:string; reference2Name:string; reference2Phone:string; emergencyName:string; emergencyPhone:string; profilePhoto?:File|null; nrcDocument?:File|null }
export interface EmployerProfileInput { fullName:string; phone:string; email:string; area:string; service:string; startDate:string; schedule:string; budget:number; householdSize:number; requirements:string }

function withTimeout<T>(promise:Promise<T>,ms:number,label:string):Promise<T>{
  return Promise.race([
    promise,
    new Promise<T>((_,reject)=>setTimeout(()=>reject(new Error(`${label} timed out. Please check your Firebase connection and try again.`)),ms)),
  ]);
}

function safeFileName(name:string){return name.replace(/[^a-zA-Z0-9._-]/g,"_")}
async function uploadPrivateUserFile(uid:string,folder:string,file?:File|null){
  if(!file)return null;
  const objectRef=ref(storage,`users/${uid}/${folder}/${Date.now()}-${safeFileName(file.name)}`);
  await withTimeout(uploadBytes(objectRef,file,{contentType:file.type||undefined}),15000,"File upload");
  return withTimeout(getDownloadURL(objectRef),10000,"File URL retrieval");
}

export async function registerFirebaseAccount({email,password,displayName,role,phone=""}:RegisterAccountInput){
  const credential=await withTimeout(createUserWithEmailAndPassword(auth,email.trim().toLowerCase(),password),15000,"Account creation");
  await withTimeout(updateProfile(credential.user,{displayName:displayName.trim()}),10000,"Profile update");
  await withTimeout(setDoc(doc(db,"users",credential.user.uid),{uid:credential.user.uid,email:credential.user.email,displayName:displayName.trim(),phone:phone.trim(),role,status:"active",createdAt:serverTimestamp(),updatedAt:serverTimestamp()}),15000,"Account profile save");
  return credential.user;
}

async function syncBaseProfile(user:User,displayName:string,phone:string,role:PublicAccountRole){
  await withTimeout(setDoc(doc(db,"users",user.uid),{uid:user.uid,email:user.email,displayName:displayName.trim(),phone:phone.trim(),role,status:"active",updatedAt:serverTimestamp()},{merge:true}),15000,"Account sync");
  if(user.displayName!==displayName.trim())await withTimeout(updateProfile(user,{displayName:displayName.trim()}),10000,"Display name update");
}

export async function saveMaidProfile(user:User,profile:MaidProfileInput){
  await syncBaseProfile(user,profile.fullName,profile.phone,"maid");

  const data:any={uid:user.uid,fullName:profile.fullName.trim(),phone:profile.phone.trim(),dateOfBirth:profile.dateOfBirth,nrcNumber:profile.nrcNumber.trim(),area:profile.area.trim(),experienceYears:Number(profile.experienceYears)||0,workType:profile.workType,expectedRate:Number(profile.expectedRate)||0,services:profile.services.trim(),languages:profile.languages.trim(),workHistory:profile.workHistory.trim(),references:[{name:profile.reference1Name.trim(),phone:profile.reference1Phone.trim()},{name:profile.reference2Name.trim(),phone:profile.reference2Phone.trim()}],emergencyContact:{name:profile.emergencyName.trim(),phone:profile.emergencyPhone.trim()},verificationStatus:"pending",availability:"available",profileViews:0,rating:0,updatedAt:serverTimestamp(),createdAt:serverTimestamp()};

  await withTimeout(setDoc(doc(db,"maids",user.uid),data,{merge:true}),15000,"Maid profile save");

  const uploadResults=await Promise.allSettled([
    uploadPrivateUserFile(user.uid,"profile",profile.profilePhoto),
    uploadPrivateUserFile(user.uid,"verification",profile.nrcDocument),
  ]);

  const profilePhotoURL=uploadResults[0].status==="fulfilled"?uploadResults[0].value:null;
  const nrcDocumentURL=uploadResults[1].status==="fulfilled"?uploadResults[1].value:null;
  const uploadUpdate:any={updatedAt:serverTimestamp()};
  if(profilePhotoURL)uploadUpdate.profilePhotoURL=profilePhotoURL;
  if(nrcDocumentURL)uploadUpdate.nrcDocumentURL=nrcDocumentURL;
  if(profilePhotoURL||nrcDocumentURL)await withTimeout(setDoc(doc(db,"maids",user.uid),uploadUpdate,{merge:true}),10000,"Maid document update");
}

export async function saveEmployerProfile(user:User,profile:EmployerProfileInput){
  await syncBaseProfile(user,profile.fullName,profile.phone,"employer");
  await withTimeout(setDoc(doc(db,"employers",user.uid),{uid:user.uid,fullName:profile.fullName.trim(),phone:profile.phone.trim(),email:profile.email.trim().toLowerCase(),area:profile.area.trim(),service:profile.service,preferredStartDate:profile.startDate,schedule:profile.schedule.trim(),budget:Number(profile.budget)||0,householdSize:Number(profile.householdSize)||1,requirements:profile.requirements.trim(),verificationStatus:"pending",createdAt:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true}),15000,"Employer profile save");
}

export async function registerMaidAccount(account:Omit<RegisterAccountInput,"role">,profile:MaidProfileInput){const user=await registerFirebaseAccount({...account,role:"maid"});await saveMaidProfile(user,profile);return user}
export async function registerEmployerAccount(account:Omit<RegisterAccountInput,"role">,profile:EmployerProfileInput){const user=await registerFirebaseAccount({...account,role:"employer"});await saveEmployerProfile(user,profile);return user}
export async function signInFirebaseAccount(email:string,password:string){const credential=await withTimeout(signInWithEmailAndPassword(auth,email.trim().toLowerCase(),password),15000,"Sign in");return credential.user}
export async function sendFirebasePasswordReset(email:string){await withTimeout(sendPasswordResetEmail(auth,email.trim().toLowerCase()),15000,"Password reset request")}
export async function signOutFirebaseAccount(){await withTimeout(signOut(auth),10000,"Sign out")}
export async function getFirebaseUserProfile(uid:string):Promise<FirebaseUserProfile|null>{const snapshot=await withTimeout(getDoc(doc(db,"users",uid)),12000,"Account profile load");return snapshot.exists()?(snapshot.data() as FirebaseUserProfile):null}
export async function updateFirebaseUserPhone(uid:string,phone:string){await withTimeout(updateDoc(doc(db,"users",uid),{phone:phone.trim(),updatedAt:serverTimestamp()}),12000,"Phone update")}
export function subscribeToFirebaseAuth(callback:(user:User|null)=>void){return onAuthStateChanged(auth,callback)}
