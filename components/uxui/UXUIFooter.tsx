"use client";

import { motion } from "framer-motion";
import type { SiteMeta } from "@/lib/content";

export default function UXUIFooter({ meta }: { meta: SiteMeta }) {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex w-full flex-col items-start gap-4 whitespace-nowrap border-t border-[#1a1a1a] py-6 font-mono text-sm tracking-[-0.56px] text-[#6e6e6d] sm:flex-row sm:items-center sm:justify-between sm:gap-0"
    >
      <span>© {new Date().getFullYear()} {meta.name}</span>
      {meta.socials?.length ? (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {meta.socials
            .filter((s) => s.url && s.url !== "#")
            .map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="transition-colors duration-200 hover:text-[#1a1a1a]"
              >
                {s.label}
              </a>
            ))}
        </div>
      ) : null}
    </motion.footer>
  );
}
