"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SiteMeta } from "@/lib/content";

const NAV_ITEMS = [
  { id: "about", label: "About Me" },
  { id: "by-the-numbers", label: "By the Numbers" },
  { id: "work", label: "Case Studies" },
  { id: "sneak-peek", label: "More Work" },
  { id: "services", label: "Services" },
  { id: "testimonials", label: "Clients" },
  { id: "contact", label: "Let's Talk" },
];

/**
 * Fixed left-hand nav: the "JP." badge + the current section's name sit
 * together at the top (the label swaps automatically as you scroll, via
 * the `data-section-label` attribute each section declares), and a stack
 * of short line-links runs down the rest of the column so you can jump
 * straight to a section. Rendered once at the page level and fixed to the
 * viewport, so nothing here shifts as you scroll.
 */
export default function SideNav({ meta }: { meta: SiteMeta }) {
  const [label, setLabel] = useState(meta.role);
  const [badgeHover, setBadgeHover] = useState(false);

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
          } else if (
            entry.target === targets[0] &&
            entry.boundingClientRect.top > 0
          ) {
            // Only reset to the default label when scrolling back up above
            // the very first section (into the Hero) -- resetting on every
            // section's exit was racing against the next section's enter
            // event and could wipe out the correct label while scrolling up.
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
    <nav className="fixed left-3 top-0 z-40 flex h-screen shrink-0 flex-col items-start bg-transparent pb-10 pt-4 md:left-10 md:pb-24 md:pt-6">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-ink/80 py-2 pl-2 pr-4 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md md:gap-6 md:py-3 md:pl-3 md:pr-6">
        <div
          onMouseEnter={() => setBadgeHover(true)}
          onMouseLeave={() => setBadgeHover(false)}
          className="flex h-8 w-10 items-center justify-center overflow-hidden rounded-xl bg-accent-soft p-2 md:h-7 md:w-9 md:rounded-lg md:bg-transparent md:p-1"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={badgeHover ? "wink" : "jp"}
              initial={{ y: 10, opacity: 0, rotate: -8 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -10, opacity: 0, rotate: 8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="font-display text-lg font-black leading-none text-ink md:text-xl md:text-accent"
            >
              {badgeHover ? ";)" : "JP."}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="hidden h-5 items-center overflow-hidden sm:flex">
          <AnimatePresence mode="wait">
            <motion.p
              key={label}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="whitespace-nowrap font-mono text-sm uppercase leading-none tracking-[5px] text-white/70"
            >
              {label}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* On mobile the column stays narrow but labels are always visible
          (hover doesn't exist on touch); from md up it reverts to the
          hover-reveal line links. */}
      <div className="flex flex-1 flex-col items-start justify-center gap-3 md:gap-0.5">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="group flex items-center gap-2 py-1 md:gap-3 md:py-0"
          >
            <span className="h-[3px] w-4 shrink-0 rounded-full bg-accent transition-all duration-300 ease-out md:h-[3px] md:w-8 md:bg-[#2d2f50] md:group-hover:w-12 md:group-hover:bg-accent" />
            <span className="max-w-[64px] truncate font-mono text-[9px] uppercase tracking-[2px] text-accent opacity-100 transition-all duration-300 ease-out md:max-w-0 md:overflow-hidden md:whitespace-nowrap md:text-sm md:tracking-[4px] md:opacity-0 md:group-hover:max-w-[240px] md:group-hover:opacity-100">
              {item.label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}
