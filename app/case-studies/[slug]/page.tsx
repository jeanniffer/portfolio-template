import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteMeta } from "@/lib/content";
import { getWorkItem } from "@/lib/work";
import CaseStudyPage from "@/components/work/CaseStudyPage";
import ComingSoonPage from "@/components/work/ComingSoonPage";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const item = getWorkItem(params.slug);
  const meta = getSiteMeta();
  if (!item) return {};

  const title = `${item.client} — ${meta.name}`;
  const description =
    item.description || `${item.client} case study by ${meta.name}, ${meta.role}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: item.cover ? [{ url: item.cover }] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: item.cover ? [item.cover] : undefined,
    },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const item = getWorkItem(params.slug);
  if (!item) return notFound();
  if (item.comingSoon) return <ComingSoonPage item={item} />;
  return <CaseStudyPage item={item} />;
}
