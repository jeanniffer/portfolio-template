import Image from "next/image";
import { getSiteMeta } from "@/lib/content";
import WorkHeader from "@/components/work/WorkHeader";
import WorkFooter from "@/components/work/WorkFooter";

export default function AboutPage() {
  const meta = getSiteMeta() as ReturnType<typeof getSiteMeta> & {
    navWork?: string;
    navAbout?: string;
    ctaLabel?: string;
  };

  return (
    <div className="relative min-h-screen bg-[#fdfbf5] font-archivo">
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 z-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[10px] z-50 border border-[#6e6e6d]"
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1800px] flex-col gap-10 px-6 pb-10 pt-4 sm:pt-6 md:px-[90px] md:pt-10">
        <WorkHeader meta={meta} />

        <main className="flex flex-1 flex-col items-center justify-center gap-8 py-16 text-center md:flex-row md:gap-16 md:text-left">
          <div className="relative h-[220px] w-[220px] shrink-0 overflow-hidden rounded-2xl bg-[#d9d9d9] md:h-[320px] md:w-[320px]">
            <Image
              src="/images/profile-photo.png"
              alt={meta.name}
              fill
              sizes="(min-width: 768px) 320px, 220px"
              className="object-cover grayscale"
            />
          </div>
          <div className="flex max-w-md flex-col items-center gap-4 md:items-start">
            <h1 className="font-archivo text-4xl font-medium tracking-[-1.28px] text-[#1a1a1a] md:text-5xl">
              About
            </h1>
            <p className="font-archivo text-base font-light leading-relaxed tracking-[-0.24px] text-[#6e6e6d] md:text-lg">
              This page is coming soon. Check back for more about who I am and how I work.
            </p>
          </div>
        </main>

        <WorkFooter meta={meta} />
      </div>
    </div>
  );
}
