import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { typesToSlug, type WorkType } from "./workTypes";

/**
 * Server-only content layer for the new www.jeanniffer.com homepage: a
 * single filterable gallery of work items (content/jeanniffer/work/*.md),
 * independent from the long-scroll case-study system the freelance
 * variants use. The fixed TYPE list + slug helpers live in workTypes.ts
 * so client components can use them without importing `fs`.
 */

const WORK_DIR = path.join(process.cwd(), "content", "jeanniffer", "work");

export type { WorkType };
export { WORK_TYPES, typesToSlug, slugToTypes, filterWorkItems } from "./workTypes";

export type WorkItem = {
  slug: string;
  client: string;
  cover: string;
  year: string;
  types: WorkType[];
  tags: string[];
  href?: string;
  order: number;
  // When true, the /case-studies/[slug] page shows a "Coming soon"
  // placeholder instead of the full case study -- lets Jean publish a
  // project's thumbnail/grid card right away and fill in the real
  // write-up later, without a broken or half-empty detail page in the
  // meantime.
  comingSoon?: boolean;
  // Fields used on the case-study detail page (/case-studies/[slug]) --
  // optional so a work item can exist in the grid without a detail page.
  description?: string;
  timeline?: string;
  services?: string;
  // Flexible, per-project scroll sections -- each is one image + one
  // short highlight (Design System, Before & After, whatever's relevant
  // to that specific project). Not a fixed Challenge/Solution/Result
  // structure -- projects can have as many or as few as make sense.
  sections?: { title: string; description: string; image: string }[];
};

function readWorkFile(f: string): WorkItem {
  const raw = fs.readFileSync(path.join(WORK_DIR, f), "utf8");
  const { data } = matter(raw);
  return {
    slug: f.replace(/\.md$/, ""),
    client: data.client,
    cover: data.cover,
    year: data.year,
    types: data.types || [],
    tags: data.tags || [],
    href: data.href,
    order: data.order ?? 0,
    comingSoon: data.comingSoon ?? false,
    description: data.description,
    timeline: data.timeline,
    services: data.services,
    sections: data.sections,
  };
}

export function getWorkItems(): WorkItem[] {
  if (!fs.existsSync(WORK_DIR)) return [];

  return fs
    .readdirSync(WORK_DIR)
    // Files starting with "_" (e.g. _template.md) are duplicate-me
    // starting points for new projects, not real content -- skip them.
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map(readWorkFile)
    .sort((a, b) => a.order - b.order);
}

export function getWorkItem(slug: string): WorkItem | undefined {
  const file = path.join(WORK_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return undefined;
  return readWorkFile(`${slug}.md`);
}

/** Up to `limit` other work items, for the "Other projects" section on a
 * case-study detail page -- excludes the current one, keeps `order`. */
export function getOtherWorkItems(excludeSlug: string, limit = 3): WorkItem[] {
  return getWorkItems()
    .filter((item) => item.slug !== excludeSlug)
    .slice(0, limit);
}
