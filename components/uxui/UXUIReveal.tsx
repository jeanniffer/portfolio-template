"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Same scroll-reveal wrapper the legacy dark sections use (components/
 * Reveal.tsx) -- fade + slide-up the first time a block scrolls into
 * view. Pulled in here so the uxui slides get the same bit of life the
 * rest of the site has, instead of snapping in static.
 */
export default function UXUIReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
