import type { SiteMeta } from "@/lib/content";
import UXUIReveal from "./UXUIReveal";

const UPWORK_URL =
  process.env.NEXT_PUBLIC_UPWORK_URL ||
  "https://www.upwork.com/freelancers/jeanniffer?viewMode=1";

export default function UXUIContact({ meta }: { meta: SiteMeta }) {
  return (
    <section
      id="contact"
      data-section-label="Let's Talk"
      className="relative flex flex-col items-center justify-center px-6 py-14 text-center md:px-20"
    >
      <UXUIReveal>
      <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center gap-10 lg:flex-row lg:text-left">
        <h2 className="font-archivo w-full text-4xl font-medium leading-tight tracking-[-1.2px] text-[#1a1a1a] sm:text-5xl lg:w-auto lg:shrink-0 lg:text-[48px]">
          Let&apos;s build something together.
        </h2>
        <div className="hidden w-px shrink-0 self-stretch bg-[#6e6e6d] lg:block" />
        <div className="flex w-full flex-1 flex-col items-center gap-8 lg:items-start">
          <p className="font-archivo max-w-md text-lg font-light leading-relaxed tracking-[-0.36px] text-[#6e6e6d]">
            A full rebrand, a CMS-driven redesign, or an ongoing partnership: if it&apos;s worth building well, let&apos;s talk it through.
          </p>
          <a
            href={UPWORK_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-[#1a1a1a] px-6 py-3 font-mono text-sm uppercase tracking-[-0.56px] text-[#fdfbf5] transition hover:opacity-90"
          >
            Hire me on Upwork →
          </a>
          {meta.socials?.length ? (
            <div className="flex flex-wrap items-center gap-4">
              {meta.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-[#1a1a1a] px-5 py-2 font-mono text-xs uppercase tracking-[-0.4px] text-[#1a1a1a] transition hover:bg-[#1a1a1a] hover:text-[#fdfbf5]"
                >
                  {s.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      </UXUIReveal>
    </section>
  );
}
