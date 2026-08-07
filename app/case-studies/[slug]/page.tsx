import { notFound } from "next/navigation";
import { getWorkItem } from "@/lib/work";
import CaseStudyPage from "@/components/work/CaseStudyPage";

export default function Page({ params }: { params: { slug: string } }) {
  const item = getWorkItem(params.slug);
  if (!item) return notFound();
  return <CaseStudyPage item={item} />;
}
