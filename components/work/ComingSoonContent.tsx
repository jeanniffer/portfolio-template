"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ComingSoonContent({ client }: { client: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-1 flex-col items-center justify-center gap-6 text-center"
    >
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.48px] text-[#818181]">
        {client}
      </p>
      <h1 className="font-archivo text-5xl font-medium tracking-[-1.44px] text-[#1a1a1a] md:text-[56px] lg:text-[64px] xl:text-[72px]">
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
  );
}
