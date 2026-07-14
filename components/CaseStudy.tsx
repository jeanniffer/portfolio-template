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
        className="mx-auto flex max-w-[1100px] flex-col gap-8"
      >
        {/* Header: number, label, client, description/role/deliverables/tools */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-8 border-b-2 border-accent-soft pb-8 md:flex-row md:gap-10"
        >
          <div className="flex flex-col gap-4 md:w-[380px] md:shrink-0">
            <p className="font-display text-3xl font-semibold text-white md:text-5xl">
              {client}
            </p>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-xs uppercase tracking-[5px] text-white/50">
                Description
              </p>
              <div className="prose prose-invert max-w-none font-body text-base font-bold leading-relaxed text-white">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
            </div>

            <div className="grid min-w-0 gap-6 sm:grid-cols-3">
              {role ? (
                <div className="flex min-w-0 flex-col gap-2">
                  <p className="font-mono text-xs uppercase tracking-[5px] text-white/50">
                    Role
                  </p>
                  <p className="font-body text-base font-bold text-white">{role}</p>
                </div>
              ) : null}
              {deliverables ? (
                <div className="flex min-w-0 flex-col gap-2">
                  <p className="font-mono text-xs uppercase tracking-[5px] text-white/50">
                    Deliverables
                  </p>
                  <p className="font-body text-base font-bold text-white">
                    {deliverables}
                  </p>
                </div>
              ) : null}
              {tools ? (
                <div className="flex min-w-0 flex-col gap-2">
                  <p className="font-mono text-xs uppercase tracking-[5px] text-white/50">
                    Tools
                  </p>
                  <p className="font-body text-base font-bold text-white">{tools}</p>
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>

        {/* Gallery: infinite horizontal scroll, each image at full natural
            size/aspect ratio -- a web page can do this, a PDF can't. */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full border-b-2 border-accent-soft pb-8"
        >
          <InfiniteGallery
            thumbnails={thumbnails}
            slides={slides}
            onOpen={setLightboxIndex}
          />
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
            className="flex flex-col gap-6 md:flex-row md:items-start"
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
                    className="flex items-center gap-2 rounded-full border border-white px-4 py-2 font-body text-sm font-bold text-white transition hover:bg-white hover:text-ink"
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
