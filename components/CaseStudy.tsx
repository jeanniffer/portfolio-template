"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import type { Section } from "@/lib/content";
import Lightbox from "./Lightbox";
import InfiniteGallery from "./InfiniteGallery";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

type LinkItem = { label: string; url: string };

export default function CaseStudy({
  section,
  anchorId,
}: {
  section: Section;
  anchorId?: string;
}) {
  const {
    number,
    label = "Project Spotlight",
    client,
    role,
    deliverables,
    tools,
    links = [],
    thumbnails = [],
    slides = [],
  } = section.frontmatter;

  // Combined set (thumbnails first, then slides) is what the lightbox
  // pages through, in the same order the gallery cells are shown.
  const galleryImages: string[] = [...thumbnails, ...slides];

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section
      id={anchorId}
      data-section-label="Case Study"
      className="snap-start relative flex min-h-screen flex-col justify-center overflow-y-auto bg-ink px-6 py-20 md:px-20 md:py-32"
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        transition={{ staggerChildren: 0.12 }}
        className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 2xl:max-w-[1600px]"
      >
        {/* Header: client name full-width on its own line, then
            Description/Role/Deliverables/Tools share a single row from
            xl (~1440px) up. */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-8 border-b-2 border-accent-soft pb-8"
        >
          <p className="font-display text-3xl font-semibold text-white md:text-5xl lg:text-4xl xl:text-5xl">
            {client}
          </p>

          <div className="flex min-w-0 flex-col gap-6 xl:flex-row xl:gap-10">
            <div className="flex min-w-0 flex-col gap-2 xl:w-1/2">
              <p className="font-mono text-xs uppercase tracking-[5px] text-white/50">
                Description
              </p>
              <div className="prose prose-invert max-w-none font-body text-base font-bold leading-relaxed text-white">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-6 xl:w-1/2 xl:flex-row xl:gap-10">
              {role ? (
                <div className="flex min-w-0 flex-col gap-2 xl:flex-1">
                  <p className="font-mono text-xs uppercase tracking-[5px] text-white/50">
                    Role
                  </p>
                  <p className="break-words font-body text-base font-bold text-white">
                    {role}
                  </p>
                </div>
              ) : null}
              {deliverables ? (
                <div className="flex min-w-0 flex-col gap-2 xl:flex-1">
                  <p className="font-mono text-xs uppercase tracking-[5px] text-white/50">
                    Deliverables
                  </p>
                  <p className="break-words font-body text-base font-bold text-white">
                    {deliverables}
                  </p>
                </div>
              ) : null}
              {tools ? (
                <div className="flex min-w-0 flex-col gap-2 xl:flex-1">
                  <p className="font-mono text-xs uppercase tracking-[5px] text-white/50">
                    Tools
                  </p>
                  <p className="break-words font-body text-base font-bold text-white">
                    {tools}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>

        {/* Gallery: a simple 2-column grid on mobile (no horizontal
            scroll -- easier to browse with a thumb), the infinite
            horizontal scroll carousel from md up. */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full border-b-2 border-accent-soft pb-8"
        >
          <div className="grid grid-cols-2 gap-4 md:hidden">
            {galleryImages.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="group relative aspect-square overflow-hidden rounded-xl bg-white/5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="hidden md:block">
            <InfiniteGallery
              thumbnails={thumbnails}
              slides={slides}
              onOpen={setLightboxIndex}
            />
          </div>
        </motion.div>

        {lightboxIndex !== null ? (
          <Lightbox
            images={galleryImages}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        ) : null}

        {/* Footer: links */}
        {links.length ? (
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-6 lg:flex-row lg:items-start"
          >
            <p className="font-body text-base font-bold text-white md:w-[380px] md:shrink-0">
              Click any link to explore the full work.
            </p>
            <div className="flex flex-col gap-2">
              <p className="font-mono text-xs uppercase tracking-[5px] text-white/50">
                Links
              </p>
              <div className="flex flex-wrap gap-3">
                {links.map((l: LinkItem) => (
                  <a
                    key={l.label}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 font-body text-sm font-bold text-white/80 transition hover:border-white hover:text-white"
                  >
                    {l.label}
                    <span aria-hidden>→</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </motion.div>
    </section>
  );
}
