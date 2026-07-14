"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Generic scroll-reveal wrapper. Wrap any section in this once in the
 * component layer -- editors never need to touch animation code again,
 * they just edit the markdown content that goes inside.
 */
export default function Reveal({
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
