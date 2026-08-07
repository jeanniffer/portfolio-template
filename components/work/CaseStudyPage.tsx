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

function StepBlock({ title, text }: { title: string; text?: string }) {
  if (!text) return null;
  return (
    <div className="flex w-[300px] flex-col items-start gap-1">
      <div className="mb-2 size-[63px] rounded-full border border-[#1a1a1a]" />
      <p className="font-archivo text-4xl font-medium tracking-[-0.72px] text-[#1a1a1a]">
        {title}
      </p>
      <p className="font-archivo text-xs font-light tracking-[-0.24px] text-[#474746]">
        {text}
      </p>
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
  const gallery = item.gallery?.length ? item.gallery : [item.cover];

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

        {/* Challenge / Solution / Result + gallery */}
        {(item.challenge || item.solution || item.result) && (
          <div className="flex w-full flex-col items-start gap-10 md:flex-row">
            <div className="flex flex-col items-start justify-center gap-10">
              <StepBlock title="Challenge" text={item.challenge} />
              <StepBlock title="Solution" text={item.solution} />
              <StepBlock title="Result" text={item.result} />
            </div>
            <VDivider />
            <div className="flex flex-1 flex-col items-start justify-center gap-10">
              {gallery[0] && (
                <div className="relative h-[372px] w-full overflow-hidden rounded-2xl bg-[#d9d9d9]">
                  <Image src={gallery[0]} alt={`${item.client} 1`} fill className="object-cover" />
                </div>
              )}
              {gallery[1] && (
                <div className="relative h-[372px] w-full overflow-hidden rounded-2xl bg-[#d9d9d9]">
                  <Image src={gallery[1]} alt={`${item.client} 2`} fill className="object-cover" />
                </div>
              )}
              {(gallery[2] || gallery[3]) && (
                <div className="flex w-full items-start gap-10">
                  {gallery[2] && (
                    <div className="relative h-[372px] flex-1 overflow-hidden rounded-2xl bg-[#d9d9d9]">
                      <Image src={gallery[2]} alt={`${item.client} 3`} fill className="object-cover" />
                    </div>
                  )}
                  {gallery[3] && (
                    <div className="relative h-[372px] flex-1 overflow-hidden rounded-2xl bg-[#d9d9d9]">
                      <Image src={gallery[3]} alt={`${item.client} 4`} fill className="object-cover" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

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
