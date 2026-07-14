import type { Section } from "@/lib/content";
import Reveal from "./Reveal";

type ServiceItem = { title: string; price?: string; description: string };

export default function WhatICanBuild({ section }: { section: Section }) {
  const {
    titleA,
    titleB,
    services = [],
    ctaTitle,
    ctaSubtitle,
    ctaButton,
    stack = [],
  } = section.frontmatter;

  const upworkUrl =
    process.env.NEXT_PUBLIC_UPWORK_URL || "https://www.upwork.com";

  return (
    <section
      id="services"
      data-section-label="Services"
      className="snap-start relative flex min-h-screen flex-col justify-center overflow-y-auto bg-ink px-6 py-20 md:px-20 md:py-28"
    >
      <Reveal>
        <div className="mx-auto flex max-w-[1400px] 2xl:max-w-[1600px] flex-col gap-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <h2 className="font-display text-3xl font-semibold leading-relaxed text-white md:text-5xl">
              {titleA}
              <span className="text-accent">{titleB}</span>
            </h2>
          </div>

          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {services.map((service: ServiceItem) => (
              <div
                key={service.title}
                className="mb-4 flex break-inside-avoid flex-col gap-4 rounded-3xl border border-white/10 bg-[#151733] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-transform duration-200 ease-out hover:-translate-y-1"
              >
                {service.price ? (
                  <span className="w-fit rounded-full bg-accent-soft px-4 py-1 font-body text-sm font-bold text-ink">
                    {service.price}
                  </span>
                ) : null}
                <p className="font-display text-2xl font-semibold text-white">
                  {service.title}
                </p>
                <p className="font-body text-base leading-relaxed text-white/80">
                  {service.description}
                </p>
              </div>
            ))}

            {/* Closing CTA card -- links out to Upwork, never a personal email */}
            <div className="mb-4 flex break-inside-avoid flex-col gap-6 rounded-3xl border border-accent/40 bg-accent p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-transform duration-200 ease-out hover:-translate-y-1">
              <div className="aspect-video w-full rounded-2xl bg-ink/10" />
              <p className="font-display text-2xl font-semibold text-ink">
                {ctaTitle}
              </p>
              <p className="font-body text-lg font-bold text-ink">{ctaSubtitle}</p>
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

          {stack.length ? (
            <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-[#151733] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] md:flex-row md:items-center md:justify-between">
              <p className="font-mono text-sm uppercase tracking-[5px] text-white/70">
                My Stack
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {stack.map((tool: string) => (
                  <span key={tool} className="font-body text-sm text-white/60">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
