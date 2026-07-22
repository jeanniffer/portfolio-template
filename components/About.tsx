import ReactMarkdown from "react-markdown";
import type { Section, SiteMeta } from "@/lib/content";
import { yearsOfExperience } from "@/lib/careerYears";
import Reveal from "./Reveal";

export default function About({
  section,
  meta,
}: {
  section: Section;
  meta: SiteMeta;
}) {
  const { titleA, titleB, photo } = section.frontmatter;
  const content = section.content.replace(
    /\{\{AUTO_YEARS\}\}/g,
    String(yearsOfExperience())
  );

  return (
    <section
      id="about"
      data-section-label="About Me"
      className="snap-start relative flex min-h-screen flex-col overflow-y-auto lg:overflow-hidden bg-ink"
    >
      {/* On mobile this is a normal stacked flow (photo, then text) --
          the desktop version's absolute overlay (text pinned over the
          bottom-left photo) doesn't translate to a narrow screen, the
          text would just sit unreadably on top of the photo. Hidden in
          the 768-1023px tablet range, where a dedicated layout (small
          circular avatar + left-aligned copy) takes over instead. */}
      <div className="relative flex flex-1 flex-col md:hidden lg:block">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt="Portrait"
            className="relative z-0 mx-auto max-h-[38vh] w-auto object-contain md:absolute md:bottom-0 md:left-0 md:mx-0 md:max-h-[90vh] lg:max-h-[70vh] xl:max-h-[90vh]"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, black 80%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, black 80%, transparent 100%)",
            }}
          />
        ) : null}

        {/* Copy -- centered under the photo on mobile; pinned to the
            right and vertically centered over the photo on desktop. */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-start justify-center px-6 py-10 text-left md:absolute md:inset-0 md:items-end md:px-16 md:py-0 2xl:max-w-[1600px]">
          <Reveal className="w-full md:w-1/2">
            <h2 className="font-display text-3xl font-semibold leading-normal text-white md:text-5xl md:leading-[1.3] lg:text-4xl lg:leading-normal xl:text-5xl">
              {titleA}
              <span className="text-accent">{titleB}</span>
            </h2>
            <div className="prose prose-invert mt-6 max-w-none font-body text-base leading-relaxed text-white/90 prose-strong:text-accent md:mx-0 md:text-lg">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Tablet-only (768-1023px): small circular avatar next to the
          title, everything left-aligned -- distinct from both the
          mobile stacked layout and the desktop absolute overlay. */}
      <div className="relative z-10 hidden flex-1 flex-col justify-center gap-6 px-16 py-16 md:flex lg:hidden">
        <Reveal>
          <div className="flex flex-col gap-6">
            {photo ? (
              <div className="relative size-24 shrink-0 overflow-hidden rounded-full border-2 border-accent bg-[#1b1f3a]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt="Portrait"
                  className="h-full w-full object-cover object-top"
                />
              </div>
            ) : null}

            <h2 className="font-display text-4xl font-semibold leading-snug text-white">
              {titleA}
              <span className="text-accent">{titleB}</span>
            </h2>

            <div className="prose prose-invert max-w-none font-body text-lg leading-relaxed text-white/90 prose-strong:text-accent">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Skills bar */}
      {meta.skills ? (
        <div className="relative z-10 bg-accent px-6 py-4 text-center md:px-20">
          <p className="font-body text-sm font-bold text-ink md:text-base">
            {meta.skills}
          </p>
        </div>
      ) : null}
    </section>
  );
}
