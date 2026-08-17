"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import BeforeAfterSlider from "./BeforeAfterSlider";

type Section = { title: string; description: string; image: string; beforeImage?: string };

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
  // between two peaks is split hold:transition = 5:1 -- once a
  // section's text/image reaches full opacity it *holds* there for 5x
  // longer than the crossfade into the next one takes, instead of
  // starting to fade immediately.
  const gap = total > 1 ? 1 / (total - 1) : 1;
  const point = index * gap;
  const transitionWidth = gap / 6; // hold = gap - transitionWidth = 5x this
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const fadeInStart = point - transitionWidth;
  const holdEnd = point + transitionWidth * 5;
  const fadeOutEnd = point + gap;

  const inputRange = isFirst
    ? [point, holdEnd, fadeOutEnd]
    : isLast
      ? [fadeInStart, point, 1]
      : [fadeInStart, point, holdEnd, fadeOutEnd];
  const outputRange = isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0];

  const opacity = useTransform(scrollYProgress, inputRange, outputRange);
  // Whole layer (text + image together) rides up out of view and the
  // next one rides up into place from below -- a real "scroll" of 20%
  // of the stage's own height, not just a small nudge, so it reads as
  // content passing through rather than a plain crossfade.
  const layerY = useTransform(
    scrollYProgress,
    inputRange,
    isFirst ? ["0%", "0%", "-20%"] : isLast ? ["20%", "0%", "0%"] : ["20%", "0%", "0%", "-20%"]
  );
  const imageScale = useTransform(
    scrollYProgress,
    inputRange,
    isFirst ? [1, 1, 0.96] : isLast ? [0.96, 1, 1] : [0.96, 1, 1, 0.96]
  );

  return (
    <motion.div
      style={{ opacity, y: layerY }}
      className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-10 bg-[#fdfbf5] md:flex-row"
    >
      <div className="flex w-full flex-col items-center justify-center gap-4 self-stretch md:flex-[3] md:items-start">
        <p className="font-archivo text-5xl font-medium tracking-[-0.72px] text-[#1a1a1a] md:text-[42px] lg:text-5xl xl:text-6xl">
          {section.title}
        </p>
        <p className="font-archivo max-w-sm text-base font-light leading-relaxed tracking-[-0.24px] text-[#6e6e6d] md:text-lg">
          {section.description}
        </p>
      </div>
      <div className="hidden w-px shrink-0 self-stretch bg-[#6e6e6d] md:block" />
      <div className="flex h-full w-full items-center justify-center self-stretch md:flex-[7]">
        <motion.div
          style={{ scale: imageScale }}
          className="relative h-full w-full max-w-[960px] overflow-hidden rounded-2xl"
        >
          {section.beforeImage ? (
            <BeforeAfterSlider before={section.beforeImage} after={section.image} alt={section.title} />
          ) : (
            <Image
              src={section.image}
              alt={section.title}
              fill
              sizes="(min-width: 768px) 60vw, 90vw"
              className="rounded-2xl object-contain"
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * Right-side, vertically-centered dots -- one per section -- so the
 * pinned crossfade reads as "you're in a sequence, N of total" instead
 * of an ambiguous scroll state. The active dot fills in as its section
 * peaks, and every dot is clickable to jump straight to that section.
 */
function NavDots({
  total,
  active,
  onJump,
}: {
  total: number;
  active: number;
  onJump: (index: number) => void;
}) {
  if (total <= 1) return null;

  return (
    <div className="pointer-events-auto absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-2 md:flex">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to section ${i + 1} of ${total}`}
          onClick={() => onJump(i)}
          className="flex h-4 w-4 items-center justify-center"
        >
          <motion.span
            animate={{
              scale: active === i ? 1 : 0.6,
              backgroundColor: active === i ? "#1a1a1a" : "#6e6e6d",
            }}
            transition={{ duration: 0.2 }}
            className="h-2 w-2 rounded-full"
          />
        </button>
      ))}
    </div>
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
  // Smooths the raw scroll progress with a spring so the crossfade
  // eases rather than tracking the scroll wheel 1:1 -- makes fast
  // scrolls feel gentler instead of snapping between sections.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.6,
  });

  const total = sections.length;
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useMotionValueEvent(smoothProgress, "change", (v) => {
    const gap = total > 1 ? 1 / (total - 1) : 1;
    const next = Math.min(total - 1, Math.max(0, Math.round(v / gap)));
    activeRef.current = next;
    setActive(next);
  });

  /** Scrolls the window so the container's scroll-linked progress lands
   * exactly at section `index`'s peak point, using the same fraction
   * math the crossfade itself uses. */
  function jumpToSection(index: number) {
    const el = ref.current;
    if (!el) return;
    const clamped = Math.min(total - 1, Math.max(0, index));
    const gap = total > 1 ? 1 / (total - 1) : 1;
    const point = clamped * gap;
    const rect = el.getBoundingClientRect();
    const scrollableDistance = rect.height - window.innerHeight;
    const containerTop = window.scrollY + rect.top;
    const targetY = containerTop + point * scrollableDistance;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }

  // Arrow-key navigation -- only active while the stage is roughly in
  // view, so it doesn't hijack arrow keys used elsewhere on the page
  // (e.g. scrolling before the case study sections are reached).
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      e.preventDefault();
      jumpToSection(activeRef.current + (e.key === "ArrowDown" ? 1 : -1));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  return (
    <>
      {/* Below md: plain, normally-scrolling stack -- title/description
          above each image, no pinning or scroll-jacked crossfade. */}
      <div className="flex w-full flex-col gap-16 lg:hidden">
        {sections.map((section, i) => (
          <div key={i} className="flex w-full flex-col items-start gap-4">
            <div className="flex w-full flex-col items-start gap-3">
              <p className="font-archivo text-4xl font-medium tracking-[-0.72px] text-[#1a1a1a]">
                {section.title}
              </p>
              <p className="font-archivo w-full text-base font-light leading-relaxed tracking-[-0.24px] text-[#6e6e6d]">
                {section.description}
              </p>
            </div>
            <div className="relative h-[380px] w-full overflow-hidden rounded-2xl sm:h-[440px] md:h-[520px]">
              {section.beforeImage ? (
                <BeforeAfterSlider before={section.beforeImage} after={section.image} alt={section.title} />
              ) : (
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  sizes="90vw"
                  className="rounded-2xl object-contain"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* md and up: pinned scroll-driven crossfade. */}
      <div
        ref={ref}
        className="relative hidden w-full lg:block"
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
              scrollYProgress={smoothProgress}
            />
          ))}
          <NavDots total={total} active={active} onJump={jumpToSection} />
        </div>
      </div>
    </>
  );
}
