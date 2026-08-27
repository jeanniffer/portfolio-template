"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type WalkthroughStep = { image: string; caption: string };

export default function UXUICaseStudyCarousel({
  steps,
  client,
}: {
  steps: WalkthroughStep[];
  client: string;
}) {
  const [index, setIndex] = useState(0);
  if (!steps.length) return null;

  const total = steps.length;
  const step = steps[index];

  function go(next: number) {
    setIndex(((next % total) + total) % total);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#d9d9d9] md:aspect-[16/10]">
        <AnimatePresence mode="wait">
          <motion.img
            key={step.image}
            src={step.image}
            alt={`${client}: ${step.caption}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </AnimatePresence>

        {total > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(index - 1)}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#fdfbf5]/90 font-mono text-[#1a1a1a] shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition hover:bg-[#fdfbf5]"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(index + 1)}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#fdfbf5]/90 font-mono text-[#1a1a1a] shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition hover:bg-[#fdfbf5]"
            >
              →
            </button>
          </>
        ) : null}
      </div>

      <div className="flex items-start justify-between gap-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={step.caption}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="font-archivo max-w-md text-sm font-light leading-relaxed tracking-[-0.24px] text-[#6e6e6d]"
          >
            {step.caption}
          </motion.p>
        </AnimatePresence>

        {total > 1 ? (
          <div className="flex shrink-0 items-center gap-2 pt-1">
            {steps.map((s, i) => (
              <button
                key={s.image}
                type="button"
                aria-label={`Go to image ${i + 1} of ${total}`}
                onClick={() => go(i)}
                className="flex h-4 w-4 items-center justify-center"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-5 bg-[#1a1a1a]" : "w-1.5 bg-[#c9c6b8]"
                  }`}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
