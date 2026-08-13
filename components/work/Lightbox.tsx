"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

/** Simple full-size image overlay for "deliverable" cards, which have
 * no case study to navigate to -- clicking just shows the piece
 * larger, then closes on click/Escape. */
export default function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string | null;
  alt: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a1a1a]/90 p-6 md:p-16"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-full max-w-4xl"
          >
            <Image src={src} alt={alt} fill sizes="90vw" className="rounded-2xl object-contain" />
          </motion.div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-6 top-6 font-mono text-sm uppercase tracking-[0.48px] text-[#fdfbf5]"
          >
            Close ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
