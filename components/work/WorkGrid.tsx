"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { WorkItem } from "@/lib/work";
import type { SortMode } from "@/lib/workTypes";
import Lightbox from "./Lightbox";

function SortToggle({
  count,
  sortMode,
  onSortModeChange,
}: {
  count: number;
  sortMode: SortMode;
  onSortModeChange: (mode: SortMode) => void;
}) {
  return (
    <div className="flex w-full items-center justify-end gap-2 pb-10 pt-4 xl:py-10">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.48px] text-[#818181]">
        Sort {count} {count === 1 ? "Project" : "Projects"} by
      </p>
      <div className="relative flex items-center gap-1 rounded-full border border-[#1a1a1a] p-0.5">
        {(
          [
            { mode: "curated" as SortMode, label: "Curated" },
            { mode: "date" as SortMode, label: "Date" },
          ]
        ).map(({ mode, label }) => (
          <button
            key={mode}
            type="button"
            onClick={() => onSortModeChange(mode)}
            className={`relative z-10 rounded-full px-3 py-1 font-mono text-sm tracking-[-0.56px] transition-colors duration-200 ${
              sortMode === mode
                ? "text-[#fdfbf5]"
                : "text-[#1a1a1a] hover:text-[#818181]"
            }`}
          >
            {sortMode === mode && (
              <motion.span
                layoutId="sort-toggle-pill"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className="absolute inset-0 -z-10 rounded-full bg-[#1a1a1a]"
              />
            )}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function WorkGrid({
  items,
  sortMode,
  onSortModeChange,
}: {
  items: WorkItem[];
  sortMode: SortMode;
  onSortModeChange: (mode: SortMode) => void;
}) {
  const [lightboxItem, setLightboxItem] = useState<WorkItem | null>(null);

  if (!items.length) {
    return (
      <div className="flex flex-1 flex-col">
        <SortToggle count={items.length} sortMode={sortMode} onSortModeChange={onSortModeChange} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-1 items-center justify-center py-16 text-[#818181]"
        >
          No projects match this filter yet.
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <SortToggle count={items.length} sortMode={sortMode} onSortModeChange={onSortModeChange} />
      <div className="grid flex-1 grid-cols-1 content-start gap-x-6 gap-y-6 lg:grid-cols-2">
      <AnimatePresence mode="popLayout">
        {items.map((item, i) => {
          const card = (
            <>
              <div className="relative h-[340px] w-full shrink-0 overflow-hidden rounded-2xl bg-[#d9d9d9]">
                <Image
                  src={item.cover}
                  alt={item.client}
                  fill
                  sizes="(min-width: 640px) 40vw, 90vw"
                  className="object-cover object-bottom transition duration-500 ease-out group-hover:scale-[1.03]"
                />
                {/* External projects (net art, etc.) link off-site --
                    flag that before the click, not after. */}
                {item.kind === "external" && (
                  <div className="pointer-events-none absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#1a1a1a]/80 font-mono text-sm text-[#fdfbf5]">
                    ↗
                  </div>
                )}
              </div>
              <div className="mt-3 flex w-full flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs font-light tracking-[0.72px] text-[#1a1a1a]">
                {item.tags.map((t) => (
                  <p key={t} className="whitespace-nowrap">[{t.toUpperCase()}]</p>
                ))}
                <p className="whitespace-nowrap">[{item.year}]</p>
              </div>
              <p className="font-archivo mt-0 w-full text-[32px] font-medium tracking-[-1.28px] text-[#1a1a1a] transition-opacity duration-300 group-hover:opacity-70">
                {item.client}
              </p>
            </>
          );

          const motionProps = {
            layout: true,
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -12 },
            transition: {
              duration: 0.45,
              delay: i * 0.06,
              ease: [0.22, 1, 0.36, 1] as const,
            },
          };

          // "deliverable" -- no page to go to, opens the cover in a
          // lightbox instead of navigating.
          if (item.kind === "deliverable") {
            return (
              <motion.div key={item.slug} {...motionProps}>
                <button
                  type="button"
                  onClick={() => setLightboxItem(item)}
                  className="group flex w-full flex-col items-start pb-4 text-left"
                >
                  {card}
                </button>
              </motion.div>
            );
          }

          // "external" -- leaves the site entirely, opens in a new tab.
          if (item.kind === "external" && item.href) {
            return (
              <motion.div key={item.slug} {...motionProps}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col items-start pb-4"
                >
                  {card}
                </a>
              </motion.div>
            );
          }

          // "case-study" (default) -- internal /case-studies/[slug] page.
          return item.href ? (
            <motion.div key={item.slug} {...motionProps}>
              <Link href={item.href} className="group flex flex-col items-start pb-4">
                {card}
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key={item.slug}
              {...motionProps}
              className="group flex flex-col items-start pb-4"
            >
              {card}
            </motion.div>
          );
        })}
      </AnimatePresence>
      </div>

      <Lightbox
        src={lightboxItem?.cover ?? null}
        alt={lightboxItem?.client ?? ""}
        onClose={() => setLightboxItem(null)}
      />
    </div>
  );
}
