"use client";

/**
 * Persistent "Hire me on Upwork" button -- stays fixed on screen the whole
 * time you scroll, so the main conversion action is always one click away
 * instead of only living at the very bottom of the page.
 */
export default function FloatingCTA() {
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
