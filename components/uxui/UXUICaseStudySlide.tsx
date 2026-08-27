"use client";

import { useState } from "react";
import type { Section } from "@/lib/content";
import UXUIGallery, { type GalleryItem } from "./UXUIGallery";
import UXUILightbox from "./UXUILightbox";
import UXUIReveal from "./UXUIReveal";

type WalkthroughStep = { image: string; caption: string; stage?: string };

function MetaCol({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.48px] text-[#818181]">
        {label}
      </p>
      <p className="font-archivo text-sm font-light leading-relaxed text-[#1a1a1a]">
        {value}
      </p>
    </div>
  );
}

export default function UXUICaseStudySlide({
  section,
  anchorId,
  index,
  total,
}: {
  section: Section;
  anchorId?: string;
  index: number;
  total: number;
}) {
  const {
    client,
    role,
    deliverables,
    tools,
    pillLabel = "Feature",
    walkthrough = [],
    thumbnails = [],
    slides = [],
  } = section.frontmatter;

  // Every image the project has gets a spot in the gallery -- captioned
  // ones (from walkthrough) come first, any remaining raw
  // thumbnails/slides fill out the rest uncaptioned.
  const gallery: (GalleryItem & { stage?: string })[] = (() => {
    const seen = new Set<string>();
    const items: (GalleryItem & { stage?: string })[] = [];
    (walkthrough as WalkthroughStep[]).forEach((w) => {
      items.push(w);
      seen.add(w.image);
    });
    [...thumbnails, ...slides].forEach((img: string) => {
      if (!seen.has(img)) {
        items.push({ image: img });
        seen.add(img);
      }
    });
    return items;
  })();

  // Pills for whichever products/features this project's walkthrough
  // tags exist (e.g. "Analytics", "Customization Modal") -- order
  // follows first appearance in the data, not a fixed vocabulary, since
  // different case studies group by product name or by process stage.
  // Selecting one swaps the featured image + caption above, and filters
  // the drag gallery below to just that group's images + descriptions.
  const presentGroups = Array.from(
    new Set(gallery.map((g) => g.stage).filter((s): s is string => Boolean(s)))
  );
  const [activeGroup, setActiveGroup] = useState<string | undefined>(presentGroups[0]);

  const filteredGallery = activeGroup
    ? gallery.filter((g) => g.stage === activeGroup)
    : gallery;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const galleryImages = filteredGallery.map((g) => g.image);


  return (
    <section
      id={anchorId}
      data-section-label={`Case Study: ${client}`}
      className="relative px-6 py-14 md:px-20"
    >
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-10">
        <UXUIReveal className="flex flex-col gap-10">
          <p className="font-mono text-xs font-light uppercase tracking-[0.72px] text-[#818181]">
            [CASE STUDY {index + 1}/{total}]
          </p>

          <p className="font-archivo text-4xl font-medium tracking-[-0.9px] text-[#1a1a1a] md:text-[52px]">
            {client}
          </p>

          <div className="flex flex-col gap-6 border-b border-[#6e6e6d] pb-8 lg:flex-row lg:gap-10">
            <div className="min-w-0 lg:w-2/5">
              <MetaCol label="Description" value={section.content.trim()} />
            </div>
            <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-3 lg:w-3/5">
              <MetaCol label="Role" value={role} />
              <MetaCol label="Deliverables" value={deliverables} />
              <MetaCol label="Tools" value={tools} />
            </div>
          </div>
        </UXUIReveal>

        {/* Pills + gallery live OUTSIDE UXUIReveal on purpose: framer-motion
            leaves a `transform` on that wrapper even after the animation
            settles, and a transformed ancestor breaks position: sticky in
            most browsers. Keeping this subtree transform-free is what
            makes the pills actually stick. */}
        {presentGroups.length ? (
          <div className="sticky top-0 z-10 -mx-6 flex flex-wrap gap-2 bg-[#fdfbf5]/95 px-6 py-3 backdrop-blur-sm md:-mx-20 md:px-20">
            {presentGroups.map((group, i) => (
              <button
                key={group}
                type="button"
                onClick={() => setActiveGroup(group)}
                className={`rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.48px] transition ${
                  activeGroup === group
                    ? "border-[#1a1a1a] bg-[#1a1a1a] text-[#fdfbf5]"
                    : "border-[#e3e0d3] text-[#818181] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
                }`}
              >
                {pillLabel} {i + 1}: {group}
              </button>
            ))}
          </div>
        ) : null}

        {filteredGallery.length ? (
          <UXUIGallery items={filteredGallery} onOpen={setLightboxIndex} />
        ) : null}

      </div>

      {lightboxIndex !== null ? (
        <UXUILightbox
          images={galleryImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      ) : null}
    </section>
  );
}
