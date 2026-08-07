import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * Content for the new www.jeanniffer.com homepage: a single filterable
 * gallery of work items (content/jeanniffer/work/*.md), independent from
 * the long-scroll case-study system the freelance variants use.
 */

const WORK_DIR = path.join(process.cwd(), "content", "jeanniffer", "work");

export type WorkType = "mission-driven" | "tech-finance" | "personal-experimental";

// Fixed for now (per Jean, Aug 2026) -- order here is the order shown in
// the TYPE filter sidebar.
export const WORK_TYPES: { slug: WorkType; label: string }[] = [
  { slug: "mission-driven", label: "Mission-driven" },
  { slug: "tech-finance", label: "Tech & Finance" },
  { slug: "personal-experimental", label: "Personal & Experimental" },
];

export type WorkItem = {
  slug: string;
  client: string;
  cover: string;
  year: string;
  types: WorkType[];
  tags: string[];
  href?: string;
  order: number;
};

export function getWorkItems(): WorkItem[] {
  if (!fs.existsSync(WORK_DIR)) return [];

  return fs
    .readdirSync(WORK_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
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
      } as WorkItem;
    })
    .sort((a, b) => a.order - b.order);
}

/**
 * Canonical slug for a set of active type filters: always sorted so the
 * same combination of tags produces the same URL no matter what order
 * they were clicked in (/work/mission-driven/tech-finance, never
 * /work/tech-finance/mission-driven).
 */
export function typesToSlug(types: WorkType[]): WorkType[] {
  return [...types].sort() as WorkType[];
}

/** Parses the catch-all route params back into valid, known type slugs. */
export function slugToTypes(slugParts: string[] | undefined): WorkType[] {
  if (!slugParts) return [];
  const known = new Set(WORK_TYPES.map((t) => t.slug));
  return typesToSlug(
    slugParts.filter((s): s is WorkType => known.has(s as WorkType))
  );
}

export function filterWorkItems(items: WorkItem[], activeTypes: WorkType[]): WorkItem[] {
  if (!activeTypes.length) return items;
  return items.filter((item) => activeTypes.every((t) => item.types.includes(t)));
}
