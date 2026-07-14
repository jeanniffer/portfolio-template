import type { SiteMeta } from "@/lib/content";

export default function ContactBand({ meta }: { meta: SiteMeta }) {
  const upworkUrl =
    process.env.NEXT_PUBLIC_UPWORK_URL || "https://www.upwork.com";

  return (
    <section
      id="contact"
      data-section-label="Let's Talk"
      className="snap-start flex min-h-screen flex-col justify-center bg-accent px-6 py-20 text-center md:px-20"
    >
      <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px]">
        <p className="font-display text-2xl font-semibold text-ink md:text-4xl">
          Like what you see, {meta.name.split(" ")[0]}?
        </p>
        <a
          href={upworkUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-full bg-ink px-8 py-4 font-mono text-sm uppercase tracking-widest text-accent transition hover:opacity-90"
        >
          Hire me on Upwork
        </a>
      </div>
      <footer className="mt-16 text-center font-mono text-xs uppercase tracking-widest text-ink/50">
        © {new Date().getFullYear()} {meta.name}
      </footer>
    </section>
  );
}
