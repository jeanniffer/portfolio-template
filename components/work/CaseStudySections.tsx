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
  // Every section gets an evenly-spaced "peak" point across the full
  // 0..1 scroll range -- section 0 peaks at progress 0, the last one
  // peaks at progress 1, everything else in between. Each segment
  // between two peaks is split hold:transition = 3:1 -- once a
  // section's text/image reaches full opacity it *holds* there for 3x
  // longer than the crossfade into the next one takes, instead of
  // starting to fade immediately.
  const gap = total > 1 ? 1 / (total - 1) : 1;
  const point = index * gap;
  const transitionWidth = gap / 4; // hold = gap - transitionWidth = 3x this
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const fadeInStart = point - transitionWidth;
  const holdEnd = point + transitionWidth * 3;
  const fadeOutEnd = point + gap;

  const inputRange = isFirst
    ? [point, holdEnd, fadeOutEnd]
    : isLast
      ? [fadeInStart, point, 1]
      : [fadeInStart, point, holdEnd, fadeOutEnd];
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
 * text/image ghosted on top of each other, and every point along the
 * scroll range is actively transitioning (no held/dead stretches).
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
      style={{ height: `${Math.max(sections.length - 1, 1) * 40 + 45}vh` }}
    >
      <div
        className="sticky w-full overflow-hidden"
        style={{
          // StickyIntro sticks at top-10 (40px) + its own height, then
          // gap-10 (40px) before this stage starts -- top offset is
          // intro-h + 80px. The *symmetric* gap we actually want to
          // mirror at the bottom is just that last 40px (border line ->
          // image), not the intro's own 40px top offset too -- so only
          // subtract 40px extra at the bottom, not 80.
          top: "calc(var(--case-study-intro-h, 220px) + 80px)",
          height: "calc(100vh - var(--case-study-intro-h, 220px) - 120px)",
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
