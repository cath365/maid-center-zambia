import type { Metadata } from "next";
import { FirebaseAdminDashboard } from "./firebase-admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Operations",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <FirebaseAdminDashboard />;
}
