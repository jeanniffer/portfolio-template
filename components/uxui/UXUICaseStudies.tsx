import type { Section } from "@/lib/content";

type LinkItem = { label: string; url: string };

export default function UXUICaseStudies({ items }: { items: Section[] }) {
  if (!items.length) return null;

  return (
    <section
      id="work"
      className="flex w-full flex-col gap-10 border-t border-[#6e6e6d] py-16"
    >
      <div className="flex items-baseline justify-between gap-6">
        <h2 className="font-archivo text-3xl font-medium leading-[1.15] tracking-[-0.8px] text-[#1a1a1a] md:text-[40px]">
          Design that <span className="italic">moves the needle</span>
        </h2>
        <p className="font-mono hidden text-xs font-light uppercase tracking-[0.72px] text-[#818181] sm:block">
          [{items.length} {items.length === 1 ? "PROJECT" : "PROJECTS"}]
        </p>
      </div>

      <div className="flex flex-col gap-16">
        {items.map((cs) => {
          const {
            client,
            role,
            deliverables,
            tools,
            links = [],
            thumbnails = [],
            slides = [],
          } = cs.frontmatter;
          const cover = thumbnails[0] || slides[0];
          const visibleLinks = (links as LinkItem[]).filter((l) => l.url !== "#");

          return (
            <div
              key={cs.slug}
              className="flex flex-col gap-8 lg:flex-row lg:gap-12"
            >
              {cover ? (
                <div className="relative h-[260px] w-full shrink-0 overflow-hidden rounded-2xl bg-[#d9d9d9] lg:h-[300px] lg:w-[420px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover}
                    alt={`${client} cover`}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              ) : null}

              <div className="flex flex-1 flex-col gap-4">
                <p className="font-archivo text-2xl font-medium tracking-[-0.64px] text-[#1a1a1a] md:text-[32px]">
                  {client}
                </p>
                <p className="font-archivo max-w-xl text-base font-light leading-relaxed tracking-[-0.24px] text-[#6e6e6d]">
                  {cs.content.trim()}
                </p>

                <div className="mt-2 flex flex-wrap gap-x-10 gap-y-4">
                  {role ? (
                    <div className="flex flex-col gap-1">
                      <p className="font-mono text-xs font-semibold uppercase tracking-[0.48px] text-[#818181]">
                        Role
                      </p>
                      <p className="font-archivo text-sm font-light text-[#1a1a1a]">{role}</p>
                    </div>
                  ) : null}
                  {deliverables ? (
                    <div className="flex flex-col gap-1">
                      <p className="font-mono text-xs font-semibold uppercase tracking-[0.48px] text-[#818181]">
                        Deliverables
                      </p>
                      <p className="max-w-xs font-archivo text-sm font-light text-[#1a1a1a]">
                        {deliverables}
                      </p>
                    </div>
                  ) : null}
                  {tools ? (
                    <div className="flex flex-col gap-1">
                      <p className="font-mono text-xs font-semibold uppercase tracking-[0.48px] text-[#818181]">
                        Tools
                      </p>
                      <p className="max-w-xs font-archivo text-sm font-light text-[#1a1a1a]">{tools}</p>
                    </div>
                  ) : null}
                </div>

                {visibleLinks.length ? (
                  <div className="mt-2 flex flex-wrap gap-3">
                    {visibleLinks.map((l) => (
                      <a
                        key={l.label}
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-full border border-[#1a1a1a] px-4 py-2 font-mono text-xs uppercase tracking-[-0.4px] text-[#1a1a1a] transition hover:bg-[#1a1a1a] hover:text-[#fdfbf5]"
                      >
                        {l.label}
                        <span aria-hidden>→</span>
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
