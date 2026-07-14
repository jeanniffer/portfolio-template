import Image from "next/image";
import type { SiteMeta } from "@/lib/content";
import HeroBackground from "./HeroBackground";
import Reveal from "./Reveal";

export default function Hero({ meta }: { meta: SiteMeta }) {
  return (
    <section
      id="hero"
      className="snap-start relative flex h-screen min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6 py-16 md:px-20 md:py-24"
    >
      <HeroBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center gap-6 text-center">
        <Reveal>
          <h1 className="font-display text-5xl font-semibold leading-tight text-white sm:text-6xl md:text-7xl lg:text-8xl lg:leading-[1.05]">
            {meta.heroTitleA}
            <span className="text-accent">{meta.heroTitleB}</span>
          </h1>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="flex items-center justify-center gap-6">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-accent bg-[#1b1f3a]">
              <Image
                src="/images/profile-photo.png"
                alt={meta.name}
                fill
                sizes="64px"
                className="object-cover object-top"
              />
            </div>
            <p className="font-body text-lg text-white/70">By {meta.name}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
