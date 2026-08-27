"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SiteMeta } from "@/lib/content";

type NavMeta = SiteMeta & {
  navWork?: string;
  navServices?: string;
  ctaLabel?: string;
};

const LINKS = [
  { href: "#work", key: "navWork" as const, fallback: "Work" },
  { href: "#services", key: "navServices" as const, fallback: "Services" },
];

export default function UXUINav({ meta }: { meta: NavMeta }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex w-full items-center justify-between border-b border-[#1a1a1a] py-6"
    >
      <a
        href="#hero"
        className="font-archivo text-2xl font-medium tracking-[-0.48px] text-[#1a1a1a]"
      >
        {meta.name}
      </a>

      <nav className="hidden items-center gap-6 min-[425px]:flex">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="font-mono text-sm font-medium uppercase tracking-[-0.56px] text-[#818181] transition-colors duration-200 hover:text-[#1a1a1a]"
          >
            {meta[l.key] || l.fallback}
          </a>
        ))}
        <motion.a
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          href="#contact"
          className="rounded-lg bg-[#1a1a1a] px-4 py-2 font-mono text-sm font-medium uppercase tracking-[-0.56px] text-[#fdfbf5]"
        >
          {meta.ctaLabel || "Let's Talk"}
        </motion.a>
      </nav>

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

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-full z-40 flex w-full flex-col items-start gap-4 overflow-hidden border-b border-[#1a1a1a] bg-[#fdfbf5] px-1 pb-6 pt-4 min-[425px]:hidden"
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="font-mono text-sm font-medium uppercase tracking-[-0.56px] text-[#818181]"
              >
                {meta[l.key] || l.fallback}
              </a>
            ))}
            <a
              href="#contact"
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
