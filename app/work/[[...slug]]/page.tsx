import { collectNiches, getWorkItems, slugToTypes } from "@/lib/work";
import WorkHome from "@/components/work/WorkHome";

// Revalidate hourly so scheduled projects (publishAt in the
// future) go live on their own without a redeploy once their
// date passes -- otherwise Next would keep serving the
// build-time snapshot on a statically generated page.
export const revalidate = 3600;

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
