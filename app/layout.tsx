import type { Metadata } from "next";
import "./globals.css";
import "./home.css";
import "./register/register.css";
import "./content-pages.css";
import "./dashboard/dashboard-enhancements.css";
import "./admin/admin-v2.css";
import { FirebaseAnalytics } from "./firebase-analytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://maid-center-zambia.vercel.app"),
  title: {
    default: "Maid Center Zambia — Trusted household professionals",
    template: "%s | Maid Center Zambia",
  },
  description: "Find or register as a maid, nanny or cleaner in Zambia through a structured household staffing, verification and placement platform.",
  keywords: ["maid Zambia", "maids Lusaka", "nanny Zambia", "home cleaning Lusaka", "household staffing Zambia", "Maid Center Zambia"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_ZM",
    url: "/",
    siteName: "Maid Center Zambia",
    title: "Maid Center Zambia — Trusted household professionals",
    description: "Structured registration, verification and placement for households, businesses and household professionals in Zambia.",
    images: [{ url: "/maid-center-hero.webp", alt: "Maid Center Zambia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maid Center Zambia",
    description: "Household staffing, verification and placement in Zambia.",
    images: ["/maid-center-hero.webp"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <FirebaseAnalytics />
        {children}
      </body>
    </html>
  );
}
