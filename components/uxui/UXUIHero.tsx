import Image from "next/image";
import type { SiteMeta } from "@/lib/content";
import UXUIReveal from "./UXUIReveal";

export default function UXUIHero({ meta }: { meta: SiteMeta }) {
  return (
    <section
      id="hero"
      className="relative flex flex-col justify-center px-6 py-14 md:px-20"
    >
      <UXUIReveal>
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-10">
        <p className="font-mono text-xs font-light uppercase tracking-[0.72px] text-[#818181]">
          [PORTFOLIO] &nbsp; [CMS] &nbsp; [EXPERIMENTATION] &nbsp; [REBRAND] &nbsp; [{meta.dateLabel}]
        </p>

        <h1 className="font-archivo max-w-4xl text-[40px] font-medium leading-[1.05] tracking-[-1.6px] text-[#1a1a1a] sm:text-[56px] md:text-[72px] xl:text-[84px]">
          {meta.heroTitleA}
          <span className="italic">{meta.heroTitleB}</span>
        </h1>

        <div className="flex items-center gap-4">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-[#1a1a1a]">
            <Image
              src="/images/profile-photo.png"
              alt={meta.name}
              fill
              sizes="56px"
              className="object-cover object-top"
            />
          </div>
          <p className="font-archivo text-lg font-light tracking-[-0.24px] text-[#6e6e6d]">
            By {meta.name}, {meta.role}
          </p>
        </div>
      </div>
      </UXUIReveal>
    </section>
  );
}
