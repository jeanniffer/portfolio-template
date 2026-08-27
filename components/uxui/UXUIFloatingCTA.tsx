"use client";

const UPWORK_URL =
  process.env.NEXT_PUBLIC_UPWORK_URL ||
  "https://www.upwork.com/freelancers/jeanniffer?viewMode=1";

export default function UXUIFloatingCTA() {
  return (
    <a
      href={UPWORK_URL}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-5 py-3 font-mono text-sm uppercase tracking-[-0.4px] text-[#fdfbf5] shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 hover:opacity-90 md:bottom-8 md:right-8 md:px-6 md:py-3"
    >
      Hire me on Upwork
      <span aria-hidden>→</span>
    </a>
  );
}
