import Image from "next/image";
import type { SiteMeta } from "@/lib/content";
import HeroBackground from "./HeroBackground";
import Reveal from "./Reveal";

export default function ContactBand({ meta }: { meta: SiteMeta }) {
  const upworkUrl =
    process.env.NEXT_PUBLIC_UPWORK_URL ||
    "https://www.upwork.com/freelancers/jeanniffer?viewMode=1";

  // Variants with a contactEmail (e.g. social-impact) skip Upwork entirely
  // in favor of a direct email + social links.
  const primaryCta = meta.contactEmail
    ? { label: "Email Me", href: `mailto:${meta.contactEmail}`, external: false }
    : { label: "Hire me on Upwork", href: upworkUrl, external: true };

  return (
    <section
      id="contact"
      data-section-label="Let's Talk"
      className="snap-start relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6 py-20 text-center md:px-20"
    >
      <HeroBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center gap-8 2xl:max-w-[1600px]">
        <Reveal>
          <h2 className="font-display text-5xl font-semibold leading-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Thank <span className="text-accent">you!</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href={primaryCta.href}
            {...(primaryCta.external
              ? { target: "_blank", rel: "noreferrer" }
              : {})}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-body text-lg font-semibold text-ink transition hover:opacity-90"
          >
            {primaryCta.label}
            <span aria-hidden>→</span>
          </a>
        </Reveal>

        {meta.socials?.length ? (
          <Reveal delay={0.15}>
            <div className="flex items-center justify-center gap-4">
              {meta.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/30 px-5 py-2 font-body text-sm font-bold text-white/80 transition hover:border-white hover:text-white"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </Reveal>
        ) : null}

        <Reveal delay={0.2}>
          <div className="flex items-center justify-center gap-3">
            <div className="relative size-10 shrink-0 overflow-hidden rounded-full border-2 border-accent bg-[#1b1f3a]">
              <Image
                src="/images/profile-photo.png"
                alt={meta.name}
                fill
                sizes="40px"
                className="object-cover object-top"
              />
            </div>
            <p className="font-body text-lg text-white/70">{meta.name}</p>
          </div>
        </Reveal>
      </div>

      <footer className="relative z-10 mt-16 text-center font-mono text-xs uppercase tracking-widest text-white/40">
        © {new Date().getFullYear()} {meta.name}
      </footer>
    </section>
  );
}
