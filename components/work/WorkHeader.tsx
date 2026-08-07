import Link from "next/link";
import type { SiteMeta } from "@/lib/content";

export default function WorkHeader({ meta }: { meta: SiteMeta & { navWork?: string; navAbout?: string; ctaLabel?: string } }) {
  return (
    <header className="flex items-center justify-between border-b border-ink/10 px-6 py-6 md:px-10">
      <Link href="/" className="text-lg font-semibold tracking-tight text-ink">
        {meta.name}
      </Link>
      <nav className="flex items-center gap-8">
        <Link
          href="/"
          className="hidden text-sm font-medium uppercase tracking-wide text-ink underline decoration-2 underline-offset-8 md:inline"
        >
          {meta.navWork || "Work"}
        </Link>
        <Link
          href="/about"
          className="hidden text-sm font-medium uppercase tracking-wide text-ink/60 hover:text-ink md:inline"
        >
          {meta.navAbout || "About"}
        </Link>
        <a
          href={meta.contactEmail ? `mailto:${meta.contactEmail}` : "#"}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition hover:opacity-90"
        >
          {meta.ctaLabel || "Let's Talk"}
        </a>
      </nav>
    </header>
  );
}
