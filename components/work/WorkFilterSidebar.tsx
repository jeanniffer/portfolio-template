"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WorkType } from "@/lib/workTypes";

function PillGroup<T extends string>({
  options,
  active,
  onToggle,
}: {
  options: { value: T; label: string }[];
  active: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <div className="flex w-max max-w-[300px] flex-wrap items-start gap-3">
      {options.map(({ value, label }) => {
        const isActive = active.includes(value);
        return (
          <motion.button
            key={value}
            type="button"
            onClick={() => onToggle(value)}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`flex shrink-0 items-center justify-center gap-1 rounded-full border px-3 py-1 font-mono text-sm tracking-[-0.56px] transition-colors duration-200 ${
              isActive
                ? "border-[#1a1a1a] bg-[#1a1a1a] text-[#fdfbf5] hover:bg-[#333333]"
                : "border-[#1a1a1a] text-[#1a1a1a] hover:border-[#6e6e6d] hover:text-[#6e6e6d]"
            }`}
          >
            {label}
            {/* Icon slot is always mounted (not conditionally rendered)
                so the pill's width never changes when toggled -- only
                which glyph shows animates. "+" invites adding this
                filter, "✓" confirms it's applied. */}
            <span className="relative inline-block h-[1em] w-[1em]">
              <motion.span
                aria-hidden
                animate={{ opacity: isActive ? 0 : 1, scale: isActive ? 0.6 : 1 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                +
              </motion.span>
              <motion.span
                aria-hidden
                animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.6 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                ✓
              </motion.span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

function DropdownHeader({
  label,
  open,
  onToggle,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" onClick={onToggle} className="flex items-center gap-1">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.48px] text-[#818181]">
        {label}
      </p>
      <motion.span
        aria-hidden
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="text-[9px] text-[#818181]"
      >
        ▾
      </motion.span>
    </button>
  );
}

export default function WorkFilterSidebar({
  allNiches,
  activeTypes,
  onToggleType,
  allTags,
  activeTags,
  onToggleTag,
  titleA,
  titleB,
}: {
  allNiches: WorkType[];
  activeTypes: WorkType[];
  onToggleType: (type: WorkType) => void;
  allTags: string[];
  activeTags: string[];
  onToggleTag: (tag: string) => void;
  titleA: string;
  titleB: string;
}) {
  const [nicheOpen, setNicheOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(false);

  return (
    <aside className="flex w-full shrink-0 flex-col items-start gap-6 self-start py-10 xl:sticky xl:top-10 xl:h-fit xl:w-[300px]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full flex-col items-start xl:max-w-[300px]"
      >
        <p className="font-archivo w-full whitespace-normal text-[44px] font-medium leading-none tracking-[-1.44px] text-[#1a1a1a] sm:text-[56px] md:text-[60px] lg:whitespace-nowrap lg:text-[64px] xl:whitespace-normal xl:text-[72px]">
          {titleA}{" "}
          <br className="lg:hidden xl:block" />
          {titleB}
        </p>
      </motion.div>

      <div className="flex w-full flex-row flex-wrap items-start gap-x-10 gap-y-6 lg:w-1/2 xl:w-auto xl:max-w-[300px] xl:flex-col xl:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex w-auto flex-col items-start gap-3"
        >
          <DropdownHeader label="Niche" open={nicheOpen} onToggle={() => setNicheOpen((v) => !v)} />
          <AnimatePresence initial={false}>
            {nicheOpen && (
              <motion.div
                key="niche-list"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="w-max overflow-hidden"
              >
                <PillGroup
                  options={allNiches.map((n) => ({ value: n, label: n }))}
                  active={activeTypes}
                  onToggle={onToggleType}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {allTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex w-auto flex-col items-start gap-3"
          >
            <DropdownHeader label="Tags" open={tagsOpen} onToggle={() => setTagsOpen((v) => !v)} />
            <AnimatePresence initial={false}>
              {tagsOpen && (
                <motion.div
                  key="tags-list"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="w-max overflow-hidden"
                >
                  <PillGroup
                    options={allTags.map((t) => ({ value: t, label: t }))}
                    active={activeTags}
                    onToggle={onToggleTag}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Only needed in the stacked layout (<xl) -- separates the
          filters from the sort/grid area below, since the vertical
          divider between sidebar and grid only exists at xl+. */}
      <div className="w-full border-t border-[#6e6e6d] xl:hidden" />
    </aside>
  );
}
