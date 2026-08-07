import { getSiteMeta } from "@/lib/content";
import { getWorkItems, filterWorkItems, type WorkType } from "@/lib/work";
import WorkHeader from "./WorkHeader";
import WorkFilterSidebar from "./WorkFilterSidebar";
import WorkGrid from "./WorkGrid";
import WorkFooter from "./WorkFooter";

export default function WorkHome({ activeTypes }: { activeTypes: WorkType[] }) {
  const meta = getSiteMeta() as ReturnType<typeof getSiteMeta> & {
    navWork?: string;
    navAbout?: string;
    ctaLabel?: string;
    titleA?: string;
    titleB?: string;
  };
  const items = filterWorkItems(getWorkItems(), activeTypes);

  return (
    <div className="min-h-screen bg-[#fdfbf5] p-[10px] font-archivo">
      <div className="mx-auto flex max-w-[1420px] flex-col gap-6 border border-[#474746] px-6 py-6 md:px-[90px]">
        <WorkHeader meta={meta} />
        <main className="flex min-h-[70vh] flex-col gap-6 border-b border-[#1a1a1a] md:flex-row md:items-stretch">
          <WorkFilterSidebar
            activeTypes={activeTypes}
            titleA={meta.titleA || "Selected"}
            titleB={meta.titleB || "Works"}
          />
          <div className="hidden w-px shrink-0 bg-[#1a1a1a] md:block" />
          <WorkGrid items={items} />
        </main>
        <WorkFooter meta={meta} />
      </div>
    </div>
  );
}
