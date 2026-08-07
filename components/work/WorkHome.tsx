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
    <div className="min-h-screen bg-cream text-ink">
      <WorkHeader meta={meta} />
      <main className="flex flex-col md:flex-row">
        <WorkFilterSidebar
          activeTypes={activeTypes}
          titleA={meta.titleA || "Selected"}
          titleB={meta.titleB || "Works"}
        />
        <WorkGrid items={items} />
      </main>
      <WorkFooter meta={meta} />
    </div>
  );
}
