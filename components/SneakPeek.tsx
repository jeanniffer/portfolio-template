import type { Section } from "@/lib/content";
import Reveal from "./Reveal";

type LinkItem = { label: string; url: string };
type Project = { description: string; links: LinkItem[]; logo?: string };

export default function SneakPeek({ section }: { section: Section }) {
  const {
    titleA,
    titleB,
    projects = [],
    ctaTitle,
    ctaSubtitle,
    ctaButton,
  } = section.frontmatter;

  const upworkUrl =
    process.env.NEXT_PUBLIC_UPWORK_URL || "https://www.upwork.com";

  return (
    <section
      id="sneak-peek"
      data-section-label="More Work"
      className="snap-start relative flex min-h-screen flex-col justify-center overflow-y-auto bg-ink px-6 py-20 md:px-20 md:py-28"
    >
      <Reveal>
        <div className="mx-auto flex max-w-[1400px] 2xl:max-w-[1600px] flex-col gap-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <h2 className="font-display text-3xl font-semibold text-white md:text-5xl lg:text-4xl xl:text-5xl">
              {titleA}
              <span className="text-accent">{titleB}</span>
            </h2>
          </div>

          <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
            {projects.map((project: Project, i: number) => (
              <div
                key={i}
                className="mb-4 flex break-inside-avoid flex-col gap-6 rounded-3xl border border-white/10 bg-[#151733] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-transform duration-200 ease-out hover:-translate-y-1"
              >
                {project.logo ? (
                  <div className="flex h-10 items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.logo}
                      alt=""
                      className="h-full w-auto max-w-[140px] object-contain"
                    />
                  </div>
                ) : null}
                <p className="font-body text-lg text-white">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  {project.links.map((l) => (
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
            ))}

            {/* Closing CTA card -- links out to Upwork, never a personal email */}
            <div className="mb-4 flex break-inside-avoid flex-col gap-6 rounded-3xl border border-accent/40 bg-accent p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-transform duration-200 ease-out hover:-translate-y-1">
              <div className="aspect-video w-full rounded-2xl bg-ink/10" />
              <p className="font-display text-2xl font-semibold text-ink">
                {ctaTitle}
              </p>
              <p className="font-body text-lg font-bold text-ink">
                {ctaSubtitle}
              </p>
              <a
                href={upworkUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 font-body text-lg font-semibold text-accent transition hover:opacity-90"
              >
                {ctaButton}
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
