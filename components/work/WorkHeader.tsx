"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { SiteMeta } from "@/lib/content";

export default function WorkHeader({
  meta,
}: {
  meta: SiteMeta & { navWork?: string; navAbout?: string; ctaLabel?: string };
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex w-full items-center justify-between border-b border-[#1a1a1a] py-6"
    >
      <Link
        href="/"
        className="font-archivo text-2xl font-medium tracking-[-0.48px] text-[#1a1a1a]"
      >
        {meta.name}
      </Link>

      {/* Full nav -- hidden below 425px in favor of the hamburger. */}
      <nav className="hidden items-center gap-6 min-[425px]:flex">
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

      {/* Hamburger toggle -- only shown below 425px. */}
      <button
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
        className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 min-[425px]:hidden"
      >
        <motion.span
          animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 5 : 0 }}
          transition={{ duration: 0.2 }}
          className="h-[1.5px] w-6 bg-[#1a1a1a]"
        />
        <motion.span
          animate={{ opacity: menuOpen ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="h-[1.5px] w-6 bg-[#1a1a1a]"
        />
        <motion.span
          animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -5 : 0 }}
          transition={{ duration: 0.2 }}
          className="h-[1.5px] w-6 bg-[#1a1a1a]"
        />
      </button>

      {/* Mobile dropdown -- only reachable below 425px since the toggle
          that opens it is hidden above that width. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-full z-40 flex w-full flex-col items-start gap-4 overflow-hidden border-b border-[#1a1a1a] bg-[#fdfbf5] px-1 pb-6 pt-4 min-[425px]:hidden"
          >
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="border-b border-[#1a1a1a] px-0.5 font-mono text-sm font-medium uppercase tracking-[-0.56px] text-[#1a1a1a]"
            >
              {meta.navWork || "Work"}
            </Link>
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="font-mono text-sm font-medium uppercase tracking-[-0.56px] text-[#818181] transition-colors duration-200 hover:text-[#1a1a1a]"
            >
              {meta.navAbout || "About"}
            </Link>
            <a
              href={meta.contactEmail ? `mailto:${meta.contactEmail}` : "#"}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg bg-[#1a1a1a] px-4 py-2 font-mono text-sm font-medium uppercase tracking-[-0.56px] text-[#fdfbf5]"
            >
              {meta.ctaLabel || "Let's Talk"}
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
