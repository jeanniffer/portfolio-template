"use client";

import { motion } from "framer-motion";
import type { SiteMeta } from "@/lib/content";

export default function WorkFooter({ meta }: { meta: SiteMeta }) {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex w-full items-center justify-between whitespace-nowrap py-6 font-mono text-sm tracking-[-0.56px] text-[#474746]"
    >
      {meta.contactEmail ? (
        <a
          href={`mailto:${meta.contactEmail}`}
          className="transition-colors duration-200 hover:text-[#1a1a1a]"
        >
          {meta.contactEmail}
        </a>
      ) : (
        <span />
      )}
      {meta.socials?.length ? (
        <div className="flex items-center gap-6">
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
