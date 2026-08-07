"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { SiteMeta } from "@/lib/content";

export default function WorkHeader({
  meta,
}: {
  meta: SiteMeta & { navWork?: string; navAbout?: string; ctaLabel?: string };
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-full items-center justify-between border-b border-[#1a1a1a] py-6"
    >
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
          className="font-mono text-sm font-medium uppercase tracking-[-0.56px] text-[#818181] transition-colors duration-200 hover:text-[#1a1a1a]"
        >
          {meta.navAbout || "About"}
        </Link>
        <motion.a
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          href={meta.contactEmail ? `mailto:${meta.contactEmail}` : "#"}
          className="rounded-lg bg-[#1a1a1a] px-4 py-2 font-mono text-sm font-medium uppercase tracking-[-0.56px] text-[#fdfbf5]"
        >
          {meta.ctaLabel || "Let's Talk"}
        </motion.a>
      </nav>
    </motion.header>
  );
}
