import { getSiteMeta } from "@/lib/content";
import { getWorkItems, type WorkType } from "@/lib/work";
import WorkHeader from "./WorkHeader";
import WorkGallery from "./WorkGallery";
import WorkFooter from "./WorkFooter";

export default function WorkHome({ activeTypes }: { activeTypes: WorkType[] }) {
  const meta = getSiteMeta() as ReturnType<typeof getSiteMeta> & {
    navWork?: string;
    navAbout?: string;
    ctaLabel?: string;
    titleA?: string;
    titleB?: string;
  };
  const items = getWorkItems();

  return (
    <div className="relative min-h-screen bg-[#fdfbf5] font-archivo">
      {/* Subtle dotted-notebook texture, spans the full scrollable page
          (not the viewport) so it moves with the content like a texture
          printed on the sheet itself. */}
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 z-0" />

      {/* Decorative frame -- wraps the entire page like the edge of a
          sheet of paper, 10px in from every side of the full scrollable
          content (not the viewport), so it scrolls together with
          everything else instead of staying pinned in place. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[10px] z-50 border border-[#474746]"
      />

      <div className="relative z-10 mx-auto flex max-w-[1800px] flex-col gap-6 px-6 py-6 md:px-[90px]">
        <WorkHeader meta={meta} />
        <WorkGallery
          items={items}
          initialActiveTypes={activeTypes}
          titleA={meta.titleA || "Selected"}
          titleB={meta.titleB || "Works"}
        />
        <WorkFooter meta={meta} />
      </div>
    </div>
  );
}
