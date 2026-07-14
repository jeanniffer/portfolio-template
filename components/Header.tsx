"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SiteMeta } from "@/lib/content";

/**
 * The "JP. / <label>" badge that opens the hero. It's a normal part of the
 * page layout (not a floating nav bar) -- it just happens to stay pinned
 * near the top via `sticky` positioning, and its label swaps to match
 * whichever section is currently in view. Any section can opt in with a
 * `data-section-label="..."` attribute.
 */
export default function Header({ meta }: { meta: SiteMeta }) {
  const [label, setLabel] = useState(meta.role);

  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section-label]")
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const text = entry.target.getAttribute("data-section-label");
          if (entry.isIntersecting) {
            setLabel(text || meta.role);
          } else if (entry.boundingClientRect.top > 0) {
            // scrolled back above this section -- fall back to the default label
            setLabel(meta.role);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [meta.role]);

  return (
    <div className="sticky top-6 z-30 flex w-fit items-center gap-6 md:top-10">
      <div className="flex items-center justify-center rounded-2xl bg-accent-soft p-4">
        <p className="font-display text-3xl font-black text-ink">JP.</p>
      </div>
      <div className="relative h-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={label}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="whitespace-nowrap font-mono text-sm uppercase tracking-[5px] text-white/70 md:text-base"
          >
            {label}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
