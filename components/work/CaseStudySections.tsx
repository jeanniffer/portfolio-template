"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type Section = { title: string; description: string; image: string };

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Auto-playing highlight carousel -- a normal, fixed-height content
 * block (no sticky/scroll-jacking, no dedicated extra scroll distance).
 * Text + image crossfade to the next section on a timer; the container
 * itself never moves or grows the page's scroll length.
 */
export default function CaseStudySections({
  sections,
  intervalMs = 4500,
}: {
  sections: Section[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (sections.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % sections.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [sections.length, intervalMs]);

  const section = sections[index];

  return (
    <div className="relative h-[560px] w-full md:h-[680px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-10 md:flex-row"
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex w-full flex-col items-center justify-center gap-4 self-stretch md:w-[420px] md:shrink-0 md:items-start"
          >
            <div className="size-16 rounded-full border border-[#1a1a1a]" />
            <p className="font-archivo text-5xl font-medium tracking-[-0.72px] text-[#1a1a1a] md:text-6xl">
              {section.title}
            </p>
            <p className="font-archivo max-w-sm text-base font-light leading-relaxed tracking-[-0.24px] text-[#474746] md:text-lg">
              {section.description}
            </p>
          </motion.div>

          <div className="hidden w-px shrink-0 self-stretch bg-[#474746] md:block" />

          <div className="flex h-full w-full flex-1 items-center justify-center self-stretch">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="relative h-full w-full max-w-[960px] overflow-hidden rounded-2xl bg-[#1a1a1a]"
            >
              <Image
                src={section.image}
                alt={section.title}
                fill
                sizes="(min-width: 768px) 60vw, 90vw"
                className="object-contain"
              />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {sections.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {sections.map((s, i) => (
            <button
              key={s.title}
              type="button"
              aria-label={`Go to ${s.title}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-[#1a1a1a]" : "w-1.5 bg-[#1a1a1a]/25"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
