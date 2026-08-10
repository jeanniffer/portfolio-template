"use client";

import { useEffect, useRef } from "react";

/**
 * Wraps the pinned title/description/meta block and measures its real
 * rendered height (varies with content length + breakpoint), exposing
 * it as a CSS var (--case-study-intro-h) on <html>. CaseStudySections
 * reads that same var to size itself to exactly fill the rest of the
 * viewport below this block -- no more guessing a fixed offset.
 */
export default function StickyIntro({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      document.documentElement.style.setProperty(
        "--case-study-intro-h",
        `${el.offsetHeight}px`
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="sticky top-0 z-20 flex w-full flex-col items-start gap-6 border-b border-[#474746] bg-[#fdfbf5] py-5 md:flex-row"
    >
      {children}
    </div>
  );
}
