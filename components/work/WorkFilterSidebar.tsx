"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WORK_TYPES, typesToSlug, type WorkType } from "@/lib/workTypes";

export default function WorkFilterSidebar({
  activeTypes,
  titleA,
  titleB,
}: {
  activeTypes: WorkType[];
  titleA: string;
  titleB: string;
}) {
  function hrefFor(type: WorkType) {
    const isActive = activeTypes.includes(type);
    const next = isActive
      ? activeTypes.filter((t) => t !== type)
      : [...activeTypes, type];
    const slug = typesToSlug(next);
    return slug.length ? `/work/${slug.join("/")}` : "/";
  }

  return (
    <aside className="sticky top-0 flex h-fit shrink-0 flex-col items-start gap-6 self-start py-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-[300px] flex-col items-start"
      >
        <p className="font-archivo w-full text-[72px] font-medium leading-none tracking-[-1.44px] text-[#1a1a1a]">
          {titleA}
          <br />
          {titleB}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full flex-col items-start gap-3"
      >
        <div className="flex items-center gap-1">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.48px] text-[#818181]">
            Type
          </p>
          <span aria-hidden className="text-[9px] text-[#818181]">
            ▾
          </span>
        </div>
        <div className="flex w-full flex-wrap items-start gap-3">
          {WORK_TYPES.map(({ slug, label }) => {
            const active = activeTypes.includes(slug);
            return (
              <Link key={slug} href={hrefFor(slug)}>
                <motion.span
                  layout
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`flex items-center justify-center gap-1 rounded-full border px-3 py-1 font-mono text-sm tracking-[-0.56px] ${
                    active
                      ? "border-[#1a1a1a] bg-[#1a1a1a] text-[#fdfbf5]"
                      : "border-[#1a1a1a] text-[#1a1a1a]"
                  }`}
                >
                  {label}
                  {active && (
                    <motion.span
                      aria-hidden
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.span>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </aside>
  );
}
