"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getSiteMeta } from "@/lib/content";
import type { WorkItem } from "@/lib/work";
import WorkHeader from "./WorkHeader";
import WorkFooter from "./WorkFooter";

/**
 * Shown instead of the full case study when a project's `comingSoon`
 * flag is on -- lets a project's grid card go live right away while the
 * write-up itself is still being put together, instead of either
 * hiding the project entirely or shipping a half-empty detail page.
 */
export default function ComingSoonPage({ item }: { item: WorkItem }) {
  const meta = getSiteMeta() as ReturnType<typeof getSiteMeta> & {
    navWork?: string;
    navAbout?: string;
    ctaLabel?: string;
  };

  return (
    <div className="relative min-h-screen bg-[#fdfbf5] font-archivo">
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 z-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[10px] z-50 border border-[#6e6e6d]"
      />
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-30 h-10 bg-[#fdfbf5]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1800px] flex-col gap-10 px-6 py-6 md:px-[90px]">
        <WorkHeader meta={meta} />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-1 flex-col items-center justify-center gap-6 text-center"
        >
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.48px] text-[#818181]">
            {item.client}
          </p>
          <h1 className="font-archivo text-5xl font-medium tracking-[-1.44px] text-[#1a1a1a] md:text-[72px]">
            Case study
            <br />
            coming soon.
          </h1>
          <p className="font-archivo max-w-md text-base font-light leading-relaxed tracking-[-0.24px] text-[#6e6e6d] md:text-lg">
            This project is in the portfolio, but the full write-up is still
            being put together. Check back soon.
          </p>
          <Link
            href="/"
            className="mt-4 rounded-lg bg-[#1a1a1a] px-4 py-2 font-mono text-sm uppercase tracking-[-0.56px] text-[#fdfbf5] transition hover:opacity-90"
          >
            ← Back to work
          </Link>
        </motion.div>

        <WorkFooter meta={meta} />
      </div>
    </div>
  );
}
