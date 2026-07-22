import type { Section } from "@/lib/content";
import Reveal from "./Reveal";
import WorldMap, { type MapCountry } from "./WorldMap";

type Stat = { value: string; label: string; highlight?: boolean };

export default function ByTheNumbers({ section }: { section: Section }) {
  const { titleA, titleB } = section.frontmatter;
  const stats: Stat[] = section.frontmatter.stats || [];
  const countries: MapCountry[] = section.frontmatter.countries || [];

  return (
    <section
      id="by-the-numbers"
      data-section-label="By the Numbers"
      className="snap-start relative flex min-h-screen flex-col justify-center overflow-y-auto bg-ink px-6 py-20 md:px-20 md:py-28"
    >
      <Reveal>
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 text-center lg:flex-row lg:items-center lg:gap-10 lg:text-left 2xl:max-w-[1600px]">
          {/* Left: heading + stats */}
          <div className="flex flex-1 flex-col gap-8">
            {titleA ? (
              <h2 className="font-display text-3xl font-semibold text-white md:text-5xl lg:whitespace-nowrap lg:text-4xl xl:text-5xl">
                {titleA}
                <span className="text-accent">{titleB}</span>
              </h2>
            ) : null}

            <p className="font-mono text-xs uppercase tracking-[5px] text-white/50 lg:hidden">
              Stats
            </p>

            <div className="grid gap-4 text-left lg:grid-cols-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`flex flex-col justify-center gap-2 rounded-3xl border p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-transform duration-200 ease-out hover:-translate-y-1 ${
                    stat.highlight
                      ? "border-accent/40 bg-accent text-ink"
                      : "border-white/10 bg-[#151733] text-white"
                  }`}
                >
                  <p
                    className={`font-display text-4xl font-semibold md:text-5xl lg:text-[38px] xl:text-5xl ${
                      stat.highlight ? "text-ink" : "text-accent"
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p className="font-body text-lg leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: map */}
          {countries.length ? (
            <div className="flex w-full flex-1 flex-col">
              <WorldMap countries={countries} />
            </div>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
