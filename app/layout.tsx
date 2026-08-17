import type { Metadata } from "next";
import { Archivo, Fraunces, IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { getSiteMeta, getVariant } from "@/lib/content";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "900"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500", "600"],
});

// Used only by the new "jeanniffer" homepage template (Figma: Personal
// Brand 2026, node 266:359) -- headline/body sans there.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["300", "500"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600", "700"],
});

export function generateMetadata(): Metadata {
  const meta = getSiteMeta();
  const title = `${meta.name} — ${meta.role}`;
  const description = `${meta.heroTitleA}${meta.heroTitleB}`;

  return {
    metadataBase: new URL("https://www.jeanniffer.com"),
    title,
    description,
    // Site-wide fallback -- individual pages (case studies, About) set
    // their own openGraph/twitter images and override this.
    openGraph: {
      title,
      description,
      images: [{ url: "/images/profile-photo.png" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/profile-photo.png"],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLegacyLongScroll = getVariant() !== "jeanniffer";

  return (
    <html lang="en" className={isLegacyLongScroll ? "snap-page" : undefined}>
      <body
        className={`${fraunces.variable} ${plexMono.variable} ${manrope.variable} ${archivo.variable} bg-ink font-body`}
      >
        {children}
      </body>
    </html>
  );
}
