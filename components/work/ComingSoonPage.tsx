import { getSiteMeta } from "@/lib/content";
import type { WorkItem } from "@/lib/work";
import WorkHeader from "./WorkHeader";
import WorkFooter from "./WorkFooter";
import ComingSoonContent from "./ComingSoonContent";

/**
 * Shown instead of the full case study when a project's `comingSoon`
 * flag is on -- lets a project's grid card go live right away while the
 * write-up itself is still being put together, instead of either
 * hiding the project entirely or shipping a half-empty detail page.
 */
export default function ComingSoonPage({ item }: { item: WorkItem }) {
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
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-30 h-10 bg-[#fdfbf5]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1800px] flex-col gap-10 px-6 py-6 md:px-[90px]">
        <WorkHeader meta={meta} />

        <ComingSoonContent client={item.client} />

        <WorkFooter meta={meta} />
      </div>
    </div>
  );
}
