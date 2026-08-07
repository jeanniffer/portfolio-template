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
export { WORK_TYPES, typesToSlug, slugToTypes } from "./workTypes";

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

export function filterWorkItems(items: WorkItem[], activeTypes: WorkType[]): WorkItem[] {
  if (!activeTypes.length) return items;
  return items.filter((item) => activeTypes.every((t) => item.types.includes(t)));
}
