"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { WorkItem } from "@/lib/work";
import type { SortMode } from "@/lib/workTypes";

function SortToggle({
  sortMode,
  onSortModeChange,
}: {
  sortMode: SortMode;
  onSortModeChange: (mode: SortMode) => void;
}) {
  return (
    <div className="flex w-full items-center justify-end gap-2 pt-10">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.48px] text-[#818181]">
        Sort
      </p>
      <div className="flex items-center gap-1 rounded-full border border-[#1a1a1a] p-0.5">
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
            className={`rounded-full px-3 py-1 font-mono text-sm tracking-[-0.56px] transition-colors ${
              sortMode === mode
                ? "bg-[#1a1a1a] text-[#fdfbf5]"
                : "text-[#1a1a1a] hover:text-[#818181]"
            }`}
          >
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
  if (!items.length) {
    return (
      <div className="flex flex-1 flex-col">
        <SortToggle sortMode={sortMode} onSortModeChange={onSortModeChange} />
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
      <SortToggle sortMode={sortMode} onSortModeChange={onSortModeChange} />
      <div className="grid flex-1 grid-cols-1 content-start gap-x-6 gap-y-6 pb-10 sm:grid-cols-2">
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
              </div>
              <div className="mt-3 flex w-full items-center justify-between whitespace-nowrap font-mono text-xs font-light tracking-[0.72px] text-[#1a1a1a]">
                <div className="flex items-start gap-2">
                  {item.tags.map((t) => (
                    <p key={t}>[{t.toUpperCase()}]</p>
                  ))}
                </div>
                <p>[{item.year}]</p>
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
    </div>
  );
}
