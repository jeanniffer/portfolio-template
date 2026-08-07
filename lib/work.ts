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
  // Fields used on the case-study detail page (/case-studies/[slug]) --
  // optional so a work item can exist in the grid without a detail page.
  description?: string;
  timeline?: string;
  services?: string;
  gallery?: string[];
  challenge?: string;
  solution?: string;
  result?: string;
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
    description: data.description,
    timeline: data.timeline,
    services: data.services,
    gallery: data.gallery,
    challenge: data.challenge,
    solution: data.solution,
    result: data.result,
  };
}

export function getWorkItems(): WorkItem[] {
  if (!fs.existsSync(WORK_DIR)) return [];

  return fs
    .readdirSync(WORK_DIR)
    .filter((f) => f.endsWith(".md"))
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
