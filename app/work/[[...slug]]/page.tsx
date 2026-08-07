import { slugToTypes } from "@/lib/work";
import WorkHome from "@/components/work/WorkHome";

export default function WorkPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  const activeTypes = slugToTypes(params.slug);
  return <WorkHome activeTypes={activeTypes} />;
}
