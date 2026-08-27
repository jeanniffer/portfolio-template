"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SiteMeta } from "@/lib/content";

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "by-the-numbers", label: "By the Numbers" },
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "certifications", label: "Certifications" },
  { id: "testimonials", label: "Clients" },
  { id: "contact", label: "Let's Talk" },
];

/**
 * Fixed left-hand nav for the uxui slide layout -- mirrors the original
 * SideNav (badge + current section label up top, line-links down the
 * column) restyled for the cream/mono system. Multiple case-study slides
 * share the "work" id the same way the legacy CaseStudy sections did:
 * only the first one carries the id, and navIdFor() walks back to it.
 */
export default function UXUISideNav({ meta }: { meta: SiteMeta }) {
  const [label, setLabel] = useState(meta.role);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section-label]")
    );
    if (targets.length === 0) return;

    function navIdFor(el: HTMLElement): string | undefined {
      let current: HTMLElement | null = el;
      while (current) {
        if (current.id && NAV_ITEMS.some((n) => n.id === current!.id)) {
          return current.id;
        }
        current = current.previousElementSibling as HTMLElement | null;
      }
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const text = entry.target.getAttribute("data-section-label");
          if (entry.isIntersecting) {
            setLabel(text || meta.role);
            setActiveId(navIdFor(entry.target as HTMLElement) ?? null);
          } else if (
            entry.target === targets[0] &&
            entry.boundingClientRect.top > 0
          ) {
            setLabel(meta.role);
            setActiveId(null);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [meta.role]);

  return (
    <nav className="fixed left-3 top-0 z-40 hidden h-screen shrink-0 flex-col items-start bg-transparent pb-10 pt-4 min-[426px]:flex md:left-10 md:pb-24 md:pt-6">
      <div className="flex items-center gap-3 rounded-full border border-[#1a1a1a] bg-[#fdfbf5]/90 py-2 pl-2 pr-4 shadow-[0_8px_24px_rgba(0,0,0,0.1)] backdrop-blur-md md:gap-6 md:py-3 md:pl-3 md:pr-6">
        <div className="flex h-8 w-10 items-center justify-center overflow-hidden rounded-xl bg-[#1a1a1a] p-2 md:h-7 md:w-9 md:rounded-lg">
          <p className="font-archivo text-lg font-medium leading-none text-[#fdfbf5] md:text-base">
            JP.
          </p>
        </div>
        <div className="hidden h-5 items-center overflow-hidden sm:flex">
          <AnimatePresence mode="wait">
            <motion.p
              key={label}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="whitespace-nowrap font-mono text-sm uppercase leading-none tracking-[3px] text-[#6e6e6d]"
            >
              {label}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-start justify-center gap-3 md:gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeId;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="group flex items-center gap-2 py-1 md:gap-3 md:py-0"
            >
              <span
                className={`h-[3px] shrink-0 rounded-full transition-all duration-300 ease-out ${
                  isActive
                    ? "w-4 bg-[#1a1a1a] md:w-12"
                    : "w-4 bg-[#c9c6b8] md:w-8 md:group-hover:w-12 md:group-hover:bg-[#1a1a1a]"
                }`}
              />
              <span className="max-w-[64px] truncate font-mono text-[9px] uppercase tracking-[2px] text-[#1a1a1a] opacity-100 transition-all duration-300 ease-out md:max-w-0 md:overflow-hidden md:whitespace-nowrap md:text-sm md:tracking-[3px] md:text-[#1a1a1a] md:opacity-0 md:group-hover:max-w-[240px] md:group-hover:opacity-100">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
