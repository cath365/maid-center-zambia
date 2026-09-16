import type { Metadata } from "next";
import "./globals.css";
import { FirebaseAnalytics } from "./firebase-analytics";

export const metadata: Metadata = {
  title: "Maid Center Zambia — Trusted household professionals",
  description: "Register for household work or request a verified maid, nanny or cleaner in Lusaka, Zambia.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <FirebaseAnalytics />
        {children}
      </body>
    </html>
  );
}
