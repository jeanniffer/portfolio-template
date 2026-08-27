import type { Section } from "@/lib/content";
import UXUIReveal from "./UXUIReveal";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  location: string;
};

export default function UXUITestimonials({ section }: { section: Section }) {
  const { titleA, titleB } = section.frontmatter;
  const testimonials: Testimonial[] = section.frontmatter.testimonials || [];

  return (
    <section
      id="testimonials"
      data-section-label="What Clients Say"
      className="relative flex flex-col justify-center px-6 py-14 md:px-20"
    >
      <UXUIReveal>
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-10">
        {titleA ? (
          <h2 className="font-archivo max-w-2xl text-3xl font-medium leading-[1.15] tracking-[-0.8px] text-[#1a1a1a] md:text-[42px]">
            {titleA}
            <span className="italic">{titleB}</span>
          </h2>
        ) : null}

        <div className="columns-1 gap-8 sm:columns-2 xl:columns-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="mb-8 flex break-inside-avoid flex-col gap-4 border-t border-[#e3e0d3] pt-5"
            >
              <p className="font-archivo text-base font-light leading-relaxed tracking-[-0.24px] text-[#1a1a1a]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex flex-col gap-0.5">
                <p className="font-archivo text-sm font-medium text-[#1a1a1a]">{t.name}</p>
                <p className="font-mono text-xs font-light uppercase tracking-[0.48px] text-[#818181]">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </UXUIReveal>
    </section>
  );
}
