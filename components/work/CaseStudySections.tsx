"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

type Section = { title: string; description: string; image: string };

function SectionLayer({
  section,
  index,
  total,
  scrollYProgress,
}: {
  section: Section;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const step = 1 / total;
  const start = index * step;
  const end = start + step;
  // Narrow overlap window (was 0.35/0.25) -- the previous version kept
  // two sections simultaneously ~50% visible for a long stretch, which
  // showed both texts/images ghosted on top of each other. This crosses
  // over quickly instead of lingering half-and-half.
  const fadeIn = start + step * 0.08;
  const fadeOut = end - step * 0.08;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  // First section is fully visible from the very start (no fade-in from
  // white) and the last one stays visible through the very end (no
  // fade-out) -- only the sections *between* two others crossfade on
  // both edges.
  const inputRange = isFirst
    ? [start, fadeOut, Math.min(1, end + step * 0.06)]
    : isLast
      ? [Math.max(0, start - step * 0.06), fadeIn, end]
      : [Math.max(0, start - step * 0.06), fadeIn, fadeOut, Math.min(1, end + step * 0.06)];

  const outputRange = isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0];

  const opacity = useTransform(scrollYProgress, inputRange, outputRange);
  const textY = useTransform(
    scrollYProgress,
    inputRange,
    isFirst ? [0, 0, -18] : isLast ? [18, 0, 0] : [18, 0, 0, -18]
  );
  const imageScale = useTransform(
    scrollYProgress,
    inputRange,
    isFirst ? [1, 1, 0.96] : isLast ? [0.96, 1, 1] : [0.96, 1, 1, 0.96]
  );

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-10 bg-[#fdfbf5] md:flex-row"
    >
      <motion.div
        style={{ y: textY }}
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
          style={{ scale: imageScale }}
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
  );
}

/**
 * Full-height stage (fills the rest of the viewport below the pinned
 * title block) that's pinned in place for a *short* scroll range while
 * its content crossfades from one section to the next. Driven by
 * scroll, but the scroll distance dedicated to it is kept small so it
 * doesn't feel like a separate scroll-jacked zone -- just a normal
 * block that happens to animate as you pass through it. Each layer has
 * an opaque background so the crossfade never shows two sections'
 * text/image ghosted on top of each other.
 */
export default function CaseStudySections({ sections }: { sections: Section[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={ref}
      className="relative w-full"
      style={{ height: `${Math.max(sections.length, 1) * 45 + 55}vh` }}
    >
      <div
        className="sticky w-full overflow-hidden"
        style={{
          top: "var(--case-study-intro-h, 220px)",
          height: "calc(100vh - var(--case-study-intro-h, 220px))",
        }}
      >
        {sections.map((section, i) => (
          <SectionLayer
            key={i}
            section={section}
            index={i}
            total={sections.length}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
}
