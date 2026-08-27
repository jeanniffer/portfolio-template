import type { Section } from "@/lib/content";
import { yearsOfExperience } from "@/lib/careerYears";
import UXUIReveal from "./UXUIReveal";
import UXUIWorldMap, { type MapCountry } from "./UXUIWorldMap";

type Stat = { value: string; label: string; highlight?: boolean };

export default function UXUIStats({ section }: { section: Section }) {
  const { titleA, titleB } = section.frontmatter;
  const rawStats: Stat[] = section.frontmatter.stats || [];
  const countries: MapCountry[] = section.frontmatter.countries || [];

  const stats: Stat[] = rawStats.map((stat) =>
    stat.value === "AUTO_YEARS+"
      ? { ...stat, value: `${yearsOfExperience()}+` }
      : stat
  );

  return (
    <section
      id="by-the-numbers"
      data-section-label="By the Numbers"
      className="relative flex flex-col justify-center px-6 py-14 md:px-20"
    >
      <UXUIReveal>
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex flex-1 flex-col gap-10">
          {titleA ? (
            <h2 className="font-archivo max-w-2xl text-3xl font-medium leading-[1.15] tracking-[-0.8px] text-[#1a1a1a] md:text-[42px]">
              {titleA}
              <span className="italic">{titleB}</span>
            </h2>
          ) : null}

          <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col gap-2 py-2 ${
                  i % 2 !== 0 ? "sm:border-l sm:border-[#e3e0d3] sm:pl-8" : ""
                }`}
              >
                <p className="font-archivo text-[40px] font-medium leading-none tracking-[-1.2px] text-[#1a1a1a] md:text-[48px]">
                  {stat.value}
                </p>
                <p className="font-archivo text-sm font-light leading-snug tracking-[-0.24px] text-[#6e6e6d] md:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {countries.length ? (
          <div className="w-full lg:w-[420px] lg:shrink-0">
            <UXUIWorldMap countries={countries} />
          </div>
        ) : null}
      </div>
      </UXUIReveal>
    </section>
  );
}
