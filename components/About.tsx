import ReactMarkdown from "react-markdown";
import type { Section, SiteMeta } from "@/lib/content";
import Reveal from "./Reveal";

export default function About({
  section,
  meta,
}: {
  section: Section;
  meta: SiteMeta;
}) {
  const { titleA, titleB, photo } = section.frontmatter;

  return (
    <section
      id="about"
      data-section-label="About Me"
      className="snap-start relative flex min-h-screen flex-col overflow-hidden bg-ink"
    >
      <div className="relative flex-1">
        {/* Photo: purely a background layer now -- absolutely positioned,
            independent of the text, capped at 80vh, never cropped. */}
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt="Portrait"
            className="absolute bottom-0 left-0 z-0 max-h-[50vh] w-auto object-contain md:max-h-[90vh]"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, black 80%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, black 80%, transparent 100%)",
            }}
          />
        ) : null}

        {/* Copy -- pinned to the right, vertically centered, capped at 840px.
            Absolutely positioned + inset-0 so it always spans this section's
            full box for centering, regardless of flex height quirks. */}
        <div className="absolute inset-0 z-10 mx-auto flex w-full max-w-[1400px] 2xl:max-w-[1600px] flex-col items-end justify-center px-6 py-10 md:px-16">
          <Reveal className="w-full md:w-1/2">
            <h2 className="font-display text-3xl font-semibold leading-[2] text-white md:text-5xl">
              {titleA}
              <span className="text-accent">{titleB}</span>
            </h2>
            <div className="prose prose-invert mt-6 max-w-none font-body text-base leading-relaxed text-white/90 prose-strong:text-accent md:text-lg">
              <ReactMarkdown>{section.content}</ReactMarkdown>
            </div>
          </Reveal>
        </div>
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
