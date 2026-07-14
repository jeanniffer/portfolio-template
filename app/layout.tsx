import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { getSiteMeta } from "@/lib/content";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "900"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["500"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600", "700"],
});

export function generateMetadata(): Metadata {
  const meta = getSiteMeta();
  return {
    title: `${meta.name} — ${meta.role}`,
    description: `${meta.heroTitleA}${meta.heroTitleB}`,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${plexMono.variable} ${manrope.variable} bg-ink font-body`}
      >
        {children}
      </body>
    </html>
  );
}
