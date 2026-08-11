import { notFound } from "next/navigation";
import { getWorkItem } from "@/lib/work";
import CaseStudyPage from "@/components/work/CaseStudyPage";
import ComingSoonPage from "@/components/work/ComingSoonPage";

export default function Page({ params }: { params: { slug: string } }) {
  const item = getWorkItem(params.slug);
  if (!item) return notFound();
  if (item.comingSoon) return <ComingSoonPage item={item} />;
  return <CaseStudyPage item={item} />;
}
