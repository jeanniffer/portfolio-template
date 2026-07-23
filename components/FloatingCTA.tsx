"use client";

import type { SiteMeta } from "@/lib/content";

/**
 * Persistent "Hire me" button -- stays fixed on screen the whole time you
 * scroll, so the main conversion action is always one click away instead
 * of only living at the very bottom of the page. Points to the Upwork
 * profile by default; if the active variant sets `contactEmail` (e.g. the
 * social-impact variant, aimed at foundations that hire directly rather
 * than through Upwork), it becomes a mailto: link instead.
 */
export default function FloatingCTA({ meta }: { meta: SiteMeta }) {
  if (meta.contactEmail) {
    return (
      <a
        href={`mailto:${meta.contactEmail}`}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 font-body text-sm font-semibold text-ink shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:opacity-90 md:bottom-8 md:right-8 md:px-6 md:py-3 md:text-base"
      >
        Email Me
        <span aria-hidden>→</span>
      </a>
    );
  }

  const upworkUrl =
    process.env.NEXT_PUBLIC_UPWORK_URL ||
    "https://www.upwork.com/freelancers/jeanniffer?viewMode=1";

  return (
    <a
      href={upworkUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 font-body text-sm font-semibold text-ink shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:opacity-90 md:bottom-8 md:right-8 md:px-6 md:py-3 md:text-base"
    >
      Hire me on Upwork
      <span aria-hidden>→</span>
    </a>
  );
}
