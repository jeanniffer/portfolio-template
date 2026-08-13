"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue } from "framer-motion";

/**
 * Classic draggable before/after image comparison. The "after" image
 * sits on top, clipped by a vertical line the user can drag (mouse or
 * touch) left/right to reveal more of the "before" image underneath.
 */
export default function BeforeAfterSlider({
  before,
  after,
  alt,
}: {
  before: string;
  after: string;
  alt: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(50);
  const dragging = useRef(false);
  const handleX = useMotionValue(50);

  function updateFromClientX(clientX: number) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.min(100, Math.max(0, raw));
    setPercent(clamped);
    handleX.set(clamped);
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full max-w-[960px] cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        updateFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) updateFromClientX(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
    >
      {/* Before -- full image underneath */}
      <Image src={before} alt={`${alt} (before)`} fill sizes="(min-width: 768px) 60vw, 90vw" className="rounded-2xl object-contain" />

      {/* After -- clipped to the left of the handle, on top */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}>
        <Image src={after} alt={`${alt} (after)`} fill sizes="(min-width: 768px) 60vw, 90vw" className="rounded-2xl object-contain" />
      </div>

      {/* Drag handle */}
      <motion.div
        aria-hidden
        className="absolute inset-y-0 z-10 w-px bg-[#fdfbf5]"
        style={{ left: `${percent}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#fdfbf5] shadow-md">
          <span className="font-mono text-xs text-[#1a1a1a]">↔</span>
        </div>
      </motion.div>

      {/* Labels */}
      <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-[#1a1a1a]/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.48px] text-[#fdfbf5]">
        Before
      </div>
      <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-[#1a1a1a]/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.48px] text-[#fdfbf5]">
        After
      </div>
    </div>
  );
}
