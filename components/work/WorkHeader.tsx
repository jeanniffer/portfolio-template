import Link from "next/link";
import type { SiteMeta } from "@/lib/content";

export default function WorkHeader({
  meta,
}: {
  meta: SiteMeta & { navWork?: string; navAbout?: string; ctaLabel?: string };
}) {
  return (
    <header className="flex w-full items-center justify-between border-b border-[#1a1a1a] py-6">
      <Link
        href="/"
        className="font-archivo text-2xl font-medium tracking-[-0.48px] text-[#1a1a1a]"
      >
        {meta.name}
      </Link>
      <nav className="flex items-center gap-6">
        <Link
          href="/"
          className="border-b border-[#1a1a1a] px-0.5 font-mono text-sm font-medium uppercase tracking-[-0.56px] text-[#1a1a1a]"
        >
          {meta.navWork || "Work"}
        </Link>
        <Link
          href="/about"
          className="font-mono text-sm font-medium uppercase tracking-[-0.56px] text-[#818181] hover:text-[#1a1a1a]"
        >
          {meta.navAbout || "About"}
        </Link>
        <a
          href={meta.contactEmail ? `mailto:${meta.contactEmail}` : "#"}
          className="rounded-lg bg-[#1a1a1a] px-4 py-2 font-mono text-sm font-medium uppercase tracking-[-0.56px] text-[#fdfbf5] transition hover:opacity-90"
        >
          {meta.ctaLabel || "Let's Talk"}
        </a>
      </nav>
    </header>
  );
}
