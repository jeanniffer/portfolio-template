import Image from "next/image";
import Link from "next/link";
import { getSiteMeta } from "@/lib/content";
import { getOtherWorkItems, type WorkItem } from "@/lib/work";
import WorkHeader from "./WorkHeader";
import WorkFooter from "./WorkFooter";
import CaseStudySections from "./CaseStudySections";
import StickyIntro from "./StickyIntro";

const HR = <div className="w-full border-t border-[#6e6e6d]" />;

function VDivider() {
  return <div className="hidden w-px shrink-0 self-stretch bg-[#6e6e6d] lg:block" />;
}

function MetaRow({ label, value, href }: { label: string; value?: string; href?: string }) {
  if (!value) return null;
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.48px] text-[#818181]">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="font-archivo w-full text-base font-light leading-[20px] tracking-[-0.24px] text-[#1a1a1a] underline decoration-[#6e6e6d] underline-offset-4 transition-colors hover:text-[#6e6e6d]"
        >
          {value} ↗
        </a>
      ) : (
        <p className="font-archivo w-full text-base font-light leading-[20px] tracking-[-0.24px] text-[#1a1a1a]">
          {value}
        </p>
      )}
    </div>
  );
}

function OtherProjectCard({ item }: { item: WorkItem }) {
  return (
    <Link
      href={item.href || "#"}
      className="group flex flex-col items-start gap-3 pb-6"
    >
      <div className="relative h-[340px] w-full overflow-hidden rounded-2xl bg-[#d9d9d9]">
        <Image
          src={item.cover}
          alt={item.client}
          fill
          sizes="(min-width: 768px) 30vw, 90vw"
          className="object-cover object-bottom transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs font-light tracking-[0.72px] text-[#1a1a1a]">
        {item.tags.map((t) => (
          <p key={t} className="whitespace-nowrap">[{t.toUpperCase()}]</p>
        ))}
        <p className="whitespace-nowrap">[{item.year}]</p>
      </div>
      <p className="font-archivo w-full text-[32px] font-medium tracking-[-1.28px] text-[#1a1a1a] md:text-[40px] lg:text-[44px] xl:text-[48px]">
        {item.client}
      </p>
    </Link>
  );
}

export default function CaseStudyPage({ item }: { item: WorkItem }) {
  const meta = getSiteMeta() as ReturnType<typeof getSiteMeta> & {
    navWork?: string;
    navAbout?: string;
    ctaLabel?: string;
  };
  const others = getOtherWorkItems(item.slug, 3);

  return (
    <div className="relative min-h-screen bg-[#fdfbf5] font-archivo">
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 z-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[10px] z-50 border border-[#6e6e6d]"
      />
      {/* StickyIntro sticks at top-10 (leaving a 40px gap above it for
          breathing room), but nothing was covering that strip once you
          scroll -- content underneath could show through. Solid opaque
          bar fills it at all scroll positions. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-30 h-10 bg-[#fdfbf5]"
      />

      <div className="relative z-10 mx-auto flex max-w-[1800px] flex-col gap-10 px-6 py-6 md:px-[90px]">
        <WorkHeader meta={meta} />

        {/* Title + description + client/timeline/services -- stays
            pinned at the top while the sections below crossfade. Its
            real height is measured and exposed as a CSS var so
            CaseStudySections can size itself to exactly fill the rest
            of the viewport below it (see StickyIntro). */}
        <StickyIntro>
          <div className="flex w-full flex-col items-start gap-3 md:flex-[7]">
            <h1 className="font-archivo text-3xl font-medium tracking-[-1px] text-[#1a1a1a] md:text-[36px] lg:text-[40px] xl:text-[44px]">
              {item.client}
            </h1>
            {item.description && (
              <p className="font-archivo text-sm font-light leading-[20px] tracking-[-0.24px] text-[#6e6e6d] md:text-base">
                {item.description}
              </p>
            )}
          </div>
          <VDivider />
          <div className="flex w-full flex-col items-start justify-center gap-3 md:flex-[3]">
            <MetaRow label="Client" value={item.client} />
            <MetaRow label="Timeline" value={item.timeline} />
            <MetaRow label="Services" value={item.services} />
            <MetaRow
              label="Website"
              value={item.liveUrl ? new URL(item.liveUrl).hostname.replace(/^www\./, "") : undefined}
              href={item.liveUrl}
            />
          </div>
        </StickyIntro>

        {/* Flexible highlight sections -- each is one image + one short
            description, as many as this specific project needs. Layout
            stays pinned in one spot the whole time; only the text +
            image crossfade from one section to the next as you scroll
            (see CaseStudySections). */}
        {item.sections?.length ? <CaseStudySections sections={item.sections} /> : null}

        {HR}

        {/* Other projects */}
        {others.length > 0 && (
          <>
            <div className="flex w-full flex-col items-center gap-6">
              <h2 className="font-archivo text-5xl font-medium tracking-[-1.44px] text-[#1a1a1a] md:text-[56px] lg:text-[64px] xl:text-[72px]">
                Other projects
              </h2>
              <div className="grid w-full grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((o) => (
                  <OtherProjectCard key={o.slug} item={o} />
                ))}
              </div>
              <Link
                href="/"
                className="rounded-lg bg-[#1a1a1a] px-4 py-2 font-mono text-sm uppercase tracking-[-0.56px] text-[#fdfbf5] transition hover:opacity-90"
              >
                View all →
              </Link>
            </div>
            {HR}
          </>
        )}

        {/* CTA */}
        <div className="flex w-full flex-col items-center gap-10 py-10 lg:flex-row">
          <h2 className="font-archivo w-full text-3xl font-medium leading-tight tracking-[-1.44px] text-[#1a1a1a] sm:whitespace-nowrap sm:text-5xl lg:w-auto lg:shrink-0 lg:text-[40px] xl:text-[48px]">
            Interested in collaborating?
          </h2>
          <VDivider />
          <div className="flex w-full flex-1 flex-col items-start gap-10">
            <p className="font-archivo text-lg font-light leading-[22px] tracking-[-0.36px] text-[#6e6e6d]">
              Whether it's a specific project, a full-time role, or something
              experimental, let's explore it together.
            </p>
            <a
              href={meta.contactEmail ? `mailto:${meta.contactEmail}` : "#"}
              className="rounded-lg bg-[#1a1a1a] px-4 py-2 font-mono text-sm uppercase tracking-[-0.56px] text-[#fdfbf5] transition hover:opacity-90"
            >
              Set up a call →
            </a>
          </div>
        </div>

        {HR}

        <WorkFooter meta={meta} />
      </div>
    </div>
  );
}
