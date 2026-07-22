import type { Section } from "@/lib/content";
import Reveal from "./Reveal";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  location: string;
};

function Stars() {
  return (
    <div className="flex gap-1 text-accent">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Testimonials({ section }: { section: Section }) {
  const { titleA, titleB } = section.frontmatter;
  const testimonials: Testimonial[] = section.frontmatter.testimonials || [];

  return (
    <section
      id="testimonials"
      data-section-label="What Clients Say"
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
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="mb-4 flex break-inside-avoid flex-col gap-4 rounded-3xl border border-white/10 bg-[#151733] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-transform duration-200 ease-out hover:-translate-y-1"
              >
                <p className="font-body text-lg leading-relaxed text-white/90">
                  {t.quote}
                </p>
                <div className="flex flex-col gap-2">
                  <Stars />
                  <p className="font-display text-xl font-semibold text-white">
                    {t.name}
                  </p>
                  <p className="font-body text-base text-white/70">{t.role}</p>
                  <p className="font-body text-sm text-white/50">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
