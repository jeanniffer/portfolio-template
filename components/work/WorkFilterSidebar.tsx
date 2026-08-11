"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WORK_TYPES, type WorkType } from "@/lib/workTypes";

export default function WorkFilterSidebar({
  activeTypes,
  onToggleType,
  allTags,
  activeTags,
  onToggleTag,
  titleA,
  titleB,
}: {
  activeTypes: WorkType[];
  onToggleType: (type: WorkType) => void;
  allTags: string[];
  activeTags: string[];
  onToggleTag: (tag: string) => void;
  titleA: string;
  titleB: string;
}) {
  const [tagsOpen, setTagsOpen] = useState(false);

  return (
    <aside className="sticky top-10 flex h-fit shrink-0 flex-col items-start gap-6 self-start py-10">
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
        className="flex w-[300px] flex-col items-start gap-3"
      >
        <div className="flex items-center gap-1">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.48px] text-[#818181]">
            Type
          </p>
          <span aria-hidden className="text-[9px] text-[#818181]">
            ▾
          </span>
        </div>
        <div className="flex w-[300px] flex-wrap items-start gap-3">
          {WORK_TYPES.map(({ slug, label }) => {
            const active = activeTypes.includes(slug);
            return (
              <motion.button
                key={slug}
                type="button"
                onClick={() => onToggleType(slug)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`flex shrink-0 items-center justify-center gap-1 rounded-full border px-3 py-1 font-mono text-sm tracking-[-0.56px] ${
                  active
                    ? "border-[#1a1a1a] bg-[#1a1a1a] text-[#fdfbf5]"
                    : "border-[#1a1a1a] text-[#1a1a1a]"
                }`}
              >
                {label}
                {/* Checkmark space is always reserved (not conditionally
                    mounted) so the pill's width never changes on toggle --
                    only its opacity/scale animate. */}
                <motion.span
                  aria-hidden
                  animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.6 }}
                  transition={{ duration: 0.15 }}
                >
                  ✓
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {allTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex w-[300px] flex-col items-start gap-3"
        >
          <button
            type="button"
            onClick={() => setTagsOpen((v) => !v)}
            className="flex items-center gap-1"
          >
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.48px] text-[#818181]">
              Tags
            </p>
            <motion.span
              aria-hidden
              animate={{ rotate: tagsOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-[9px] text-[#818181]"
            >
              ▾
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {tagsOpen && (
              <motion.div
                key="tags-list"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="w-[300px] overflow-hidden"
              >
                <div className="flex w-[300px] flex-wrap items-start gap-3">
                  {allTags.map((tag) => {
                    const active = activeTags.includes(tag);
                    return (
                      <motion.button
                        key={tag}
                        type="button"
                        onClick={() => onToggleTag(tag)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`flex shrink-0 items-center justify-center gap-1 rounded-full border px-3 py-1 font-mono text-sm tracking-[-0.56px] ${
                          active
                            ? "border-[#1a1a1a] bg-[#1a1a1a] text-[#fdfbf5]"
                            : "border-[#1a1a1a] text-[#1a1a1a]"
                        }`}
                      >
                        {tag}
                        <motion.span
                          aria-hidden
                          animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.6 }}
                          transition={{ duration: 0.15 }}
                        >
                          ✓
                        </motion.span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </aside>
  );
}
