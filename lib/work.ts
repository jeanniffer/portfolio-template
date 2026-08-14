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
export {
  typesToSlug,
  slugToTypes,
  filterWorkItems,
  filterByTags,
  collectNiches,
  collectTags,
  sortWorkItems,
} from "./workTypes";

/**
 * How a grid card behaves when clicked:
 * - "case-study" (default): navigates to /case-studies/[slug], the full
 *   internal detail page built with StickyIntro + CaseStudySections.
 * - "external": `href` is a full external URL (e.g. a net art project
 *   living outside the portfolio) -- opens in a new tab, card shows a
 *   small ↗ indicator.
 * - "deliverable": a small standalone piece with no case study to
 *   write up -- clicking opens the cover image full-size in a
 *   lightbox instead of navigating anywhere.
 */
export type WorkKind = "case-study" | "external" | "deliverable";

export type WorkItem = {
  slug: string;
  client: string;
  cover: string;
  year: string;
  types: WorkType[];
  tags: string[];
  href?: string;
  kind: WorkKind;
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
  // Optional live link to the actual shipped site -- shown as an
  // extra row next to Client/Timeline/Services when present.
  liveUrl?: string;
  // Flexible, per-project scroll sections -- each is one image + one
  // short highlight (Design System, Before & After, whatever's relevant
  // to that specific project). Not a fixed Challenge/Solution/Result
  // structure -- projects can have as many or as few as make sense.
  // `beforeImage` is optional: when set, the section renders as a
  // draggable before/after slider (before/after) instead of a single
  // static image.
  sections?: {
    title: string;
    description: string;
    image: string;
    beforeImage?: string;
  }[];
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
    kind: (data.kind as WorkKind) || "case-study",
    order: data.order ?? 0,
    comingSoon: data.comingSoon ?? false,
    description: data.description,
    timeline: data.timeline,
    services: data.services,
    liveUrl: data.liveUrl,
    sections: data.sections?.map(
      (s: { title: string; description: string; image: string; beforeImage?: string }) => ({
        title: s.title,
        description: s.description,
        image: s.image,
        beforeImage: s.beforeImage,
      })
    ),
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
    // comingSoon projects stay unpublished -- not in the grid, not in
    // filters, not in "Other projects" -- until the write-up is ready
    // and the flag is flipped off. The /case-studies/[slug] page still
    // works if someone has the direct link (shows the coming-soon
    // placeholder), it just isn't surfaced anywhere on the site.
    .filter((item) => !item.comingSoon)
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
