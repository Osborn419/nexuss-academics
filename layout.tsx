import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/config/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCurrentProfile } from "@/lib/auth";
import { getUnreadCount } from "@/lib/queries";

export const metadata: Metadata = {
  title: {
    default: `${site.projectName} · ${site.university} IT study group — by ${site.creatorName}`,
    template: `%s · ${site.projectName}`,
  },
  description: site.description,
  applicationName: site.projectName,
  authors: [{ name: site.creatorName, url: `mailto:${site.contact.email}` }],
  creator: site.creatorName,
  publisher: site.creatorName,
  keywords: [
    "Nexus Academics",
    "University of Ghana",
    "UG Legon",
    "study group",
    "DCIT 101",
    "DCIT 103",
    "DCIT 105",
    "ECON 101",
    "STAT 111",
    "UGRC 110",
    "UGRC 150",
    "past questions",
    "examination practice",
  ],
  openGraph: {
    title: `${site.projectName} · created by ${site.creatorName}`,
    description: site.description,
    siteName: site.projectName,
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const profile = await getCurrentProfile();
  const unread = profile ? await getUnreadCount(profile.id) : 0;

  return (
    <html lang="en">
      <body className="min-h-screen font-sans text-slate-200 antialiased">
        <div className="pointer-events-none fixed inset-0 -z-10 grid-lines opacity-[0.35] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
        <SiteHeader
          user={profile ? { displayName: profile.displayName, role: profile.role } : null}
          unread={unread}
        />
        <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
