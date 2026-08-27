"use client";

import { useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function UXUILightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const total = images.length;

  const goPrev = useCallback(
    () => onNavigate((index - 1 + total) % total),
    [index, total, onNavigate]
  );
  const goNext = useCallback(
    () => onNavigate((index + 1) % total),
    [index, total, onNavigate]
  );

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goPrev, goNext, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a1a1a]/95 px-6 py-10"
        onClick={onClose}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-[#fdfbf5]/40 font-archivo text-xl text-[#fdfbf5] transition hover:bg-[#fdfbf5] hover:text-[#1a1a1a]"
        >
          ×
        </button>

        {total > 1 ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#fdfbf5]/40 font-archivo text-xl text-[#fdfbf5] transition hover:bg-[#fdfbf5] hover:text-[#1a1a1a] md:left-8"
          >
            ‹
          </button>
        ) : null}

        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="relative flex max-h-[85vh] max-w-[85vw] items-center justify-center overflow-hidden rounded-xl bg-[#fdfbf5]/5"
          onClick={(e) => e.stopPropagation()}
        >
          {images[index] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[index]}
              alt=""
              className="max-h-[85vh] max-w-[85vw] object-contain"
            />
          ) : (
            <div className="flex h-[60vh] w-[60vw] items-center justify-center font-archivo text-sm text-[#fdfbf5]/40">
              Image coming soon
            </div>
          )}
        </motion.div>

        {total > 1 ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next image"
            className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#fdfbf5]/40 font-archivo text-xl text-[#fdfbf5] transition hover:bg-[#fdfbf5] hover:text-[#1a1a1a] md:right-8"
          >
            ›
          </button>
        ) : null}

        {total > 1 ? (
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-[3px] text-[#fdfbf5]/60">
            {index + 1} / {total}
          </p>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}
