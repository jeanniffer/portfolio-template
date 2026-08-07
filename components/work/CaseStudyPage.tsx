import Image from "next/image";
import Link from "next/link";
import { getSiteMeta } from "@/lib/content";
import { getOtherWorkItems, type WorkItem } from "@/lib/work";
import WorkHeader from "./WorkHeader";
import WorkFooter from "./WorkFooter";

const HR = <div className="w-full border-t border-[#474746]" />;

function VDivider() {
  return <div className="hidden w-px shrink-0 self-stretch bg-[#474746] md:block" />;
}

function MetaRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.48px] text-[#818181]">
        {label}
      </p>
      <p className="font-archivo w-full text-lg font-light leading-[22px] tracking-[-0.36px] text-[#1a1a1a]">
        {value}
      </p>
    </div>
  );
}

/**
 * One flexible highlight: a large image paired with a short label + a
 * couple sentences. Projects list as many of these as make sense for
 * them (a rebrand might get "Design System" + "Before & After"; a
 * feature project might just get "Challenge" + "Result") -- not a fixed
 * Challenge/Solution/Result structure.
 *
 * Pinned-scroll effect: each section is `sticky top-0` and full viewport
 * height. Scrolling past one doesn't move it up the page -- it stays put
 * (text + image together) until the next section (later in DOM order,
 * so it paints on top) scrolls up and fully covers it. No JS needed --
 * this is plain sticky-stacking, each section is its own scroll frame.
 */
function CaseStudySection({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) {
  return (
    <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center gap-10 bg-[#fdfbf5] md:flex-row">
      <div className="flex w-full flex-col items-start gap-4 md:w-[420px] md:shrink-0">
        <div className="size-16 rounded-full border border-[#1a1a1a]" />
        <p className="font-archivo text-5xl font-medium tracking-[-0.72px] text-[#1a1a1a] md:text-6xl">
          {title}
        </p>
        <p className="font-archivo max-w-sm text-base font-light leading-relaxed tracking-[-0.24px] text-[#474746] md:text-lg">
          {description}
        </p>
      </div>
      <VDivider />
      <div className="relative h-[50vh] w-full flex-1 overflow-hidden rounded-2xl bg-[#1a1a1a] md:h-[80vh]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 768px) 60vw, 90vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

function OtherProjectCard({ item }: { item: WorkItem }) {
  return (
    <Link
      href={item.href || "#"}
      className="group flex flex-1 flex-col items-start gap-3 pb-6"
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
      <div className="flex w-full items-center justify-between whitespace-nowrap font-mono text-xs font-light tracking-[0.72px] text-[#1a1a1a]">
        <div className="flex items-start gap-2">
          {item.tags.map((t) => (
            <p key={t}>[{t.toUpperCase()}]</p>
          ))}
        </div>
        <p>[{item.year}]</p>
      </div>
      <p className="font-archivo w-full text-[32px] font-medium tracking-[-1.28px] text-[#1a1a1a] md:text-[48px]">
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
        className="pointer-events-none absolute inset-[10px] z-50 border border-[#474746]"
      />

      <div className="relative z-10 mx-auto flex max-w-[1800px] flex-col gap-10 px-6 py-6 md:px-[90px]">
        <WorkHeader meta={meta} />

        {/* Title + description + client/timeline/services */}
        <div className="flex w-full flex-col items-start gap-10 border-b border-[#474746] py-10 md:flex-row">
          <div className="flex w-full flex-col items-start gap-2 md:w-[911px]">
            <h1 className="font-archivo text-5xl font-medium tracking-[-1.44px] text-[#1a1a1a] md:text-[72px]">
              {item.client}
            </h1>
            {item.description && (
              <p className="font-archivo text-lg font-light leading-[22px] tracking-[-0.36px] text-[#474746]">
                {item.description}
              </p>
            )}
          </div>
          <VDivider />
          <div className="flex w-full flex-col items-start justify-center gap-4 md:flex-1">
            <MetaRow label="Client" value={item.client} />
            <MetaRow label="Timeline" value={item.timeline} />
            <MetaRow label="Services" value={item.services} />
          </div>
        </div>

        {/* Flexible highlight sections -- each is one image + one short
            description, as many as this specific project needs. Each one
            pins full-screen while you scroll through it, then the next
            section covers it entirely (see CaseStudySection). No gap
            here on purpose -- the sticky stacking handles the transition
            between sections itself. */}
        {item.sections?.length ? (
          <div className="w-full">
            {item.sections.map((section, i) => (
              <CaseStudySection key={i} {...section} />
            ))}
          </div>
        ) : null}

        {HR}

        {/* Other projects */}
        {others.length > 0 && (
          <>
            <div className="flex w-full flex-col items-center gap-6">
              <h2 className="font-archivo text-5xl font-medium tracking-[-1.44px] text-[#1a1a1a] md:text-[72px]">
                Other projects
              </h2>
              <div className="flex w-full flex-col items-start gap-10 md:flex-row">
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
        <div className="flex w-full flex-col items-center gap-10 py-10 md:flex-row">
          <h2 className="font-archivo w-full text-5xl font-medium leading-tight tracking-[-1.44px] text-[#1a1a1a] md:w-[911px] md:text-[72px]">
            Interested in
            <br />
            collaborating?
          </h2>
          <VDivider />
          <div className="flex w-full flex-1 flex-col items-start gap-10">
            <p className="font-archivo text-lg font-light leading-[22px] tracking-[-0.36px] text-[#474746]">
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
