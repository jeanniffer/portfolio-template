import { collectNiches, getWorkItems, slugToTypes } from "@/lib/work";
import WorkHome from "@/components/work/WorkHome";

export default function WorkPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  const items = getWorkItems();
  const allNiches = collectNiches(items);
  const activeTypes = slugToTypes(params.slug, allNiches);
  return <WorkHome activeTypes={activeTypes} />;
}
