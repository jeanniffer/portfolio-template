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
  const fadeIn = start + step * 0.35;
  const fadeOut = end - step * 0.35;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  // First section is fully visible from the very start (no fade-in from
  // white) and the last one stays visible through the very end (no
  // fade-out) -- only the sections *between* two others crossfade on
  // both edges.
  const inputRange = isFirst
    ? [start, fadeOut, Math.min(1, end + step * 0.25)]
    : isLast
      ? [Math.max(0, start - step * 0.25), fadeIn, end]
      : [Math.max(0, start - step * 0.25), fadeIn, fadeOut, Math.min(1, end + step * 0.25)];

  const outputRange = isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0];

  const opacity = useTransform(scrollYProgress, inputRange, outputRange);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-10 md:flex-row"
    >
      <div className="flex w-full flex-col items-center justify-center gap-4 self-stretch md:w-[420px] md:shrink-0 md:items-start">
        <div className="size-16 rounded-full border border-[#1a1a1a]" />
        <p className="font-archivo text-5xl font-medium tracking-[-0.72px] text-[#1a1a1a] md:text-6xl">
          {section.title}
        </p>
        <p className="font-archivo max-w-sm text-base font-light leading-relaxed tracking-[-0.24px] text-[#474746] md:text-lg">
          {section.description}
        </p>
      </div>
      <div className="hidden w-px shrink-0 self-stretch bg-[#474746] md:block" />
      {/* Centered vertically within the available column height/width,
          not stretched to fill the full stage. */}
      <div className="flex h-full w-full flex-1 items-center justify-center self-stretch">
        <div className="relative h-[420px] w-full max-w-[960px] overflow-hidden rounded-2xl bg-[#1a1a1a] md:h-[640px]">
          <Image
            src={section.image}
            alt={section.title}
            fill
            sizes="(min-width: 768px) 60vw, 90vw"
            className="object-contain"
          />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * A single pinned "stage" -- compact, not full-screen -- that spans the
 * whole scroll range of all sections combined. The stage itself stays
 * fixed in place (like a normal content block, not a full-viewport
 * takeover); only each section's text + image crossfade in/out as you
 * scroll through it.
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
      style={{ height: `${sections.length * 130}vh` }}
    >
      {/* top offset clears the pinned title/description/meta block above
          it (see CaseStudyPage) so the two sticky elements don't overlap. */}
      <div className="sticky top-[180px] h-[520px] w-full overflow-hidden md:top-[200px] md:h-[720px]">
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
