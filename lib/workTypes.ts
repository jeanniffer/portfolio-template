/**
 * Client-safe slice of lib/work.ts: just the fixed TYPE list and the
 * slug <-> types helpers. No `fs`/`path` here so client components
 * (WorkFilterSidebar) can import it without pulling Node built-ins
 * into the browser bundle.
 */

export type WorkType =
  | "mission-driven"
  | "tech-finance"
  | "edtech"
  | "personal-experimental";

// Fixed for now (per Jean, Aug 2026) -- order here is the order shown in
// the TYPE filter sidebar.
export const WORK_TYPES: { slug: WorkType; label: string }[] = [
  { slug: "mission-driven", label: "Mission-driven" },
  { slug: "tech-finance", label: "Tech & Finance" },
  { slug: "edtech", label: "EdTech" },
  { slug: "personal-experimental", label: "Personal & Experimental" },
];

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

/** Generic so it works on the client without importing WorkItem (which
 * lives in lib/work.ts, an fs-importing server-only module). */
export function filterWorkItems<T extends { types: WorkType[] }>(
  items: T[],
  activeTypes: WorkType[]
): T[] {
  if (!activeTypes.length) return items;
  return items.filter((item) => activeTypes.every((t) => item.types.includes(t)));
}

/** Free-form tags (e.g. "Web Design", "Design System") are per-project
 * content, not a fixed list like WORK_TYPES -- so filtering just checks
 * against whatever strings each item actually has. */
export function filterByTags<T extends { tags: string[] }>(
  items: T[],
  activeTags: string[]
): T[] {
  if (!activeTags.length) return items;
  return items.filter((item) => activeTags.every((t) => item.tags.includes(t)));
}

/** All distinct tags across a set of items, in first-seen order (so the
 * filter list order tracks the order projects are curated in). */
export function collectTags<T extends { tags: string[] }>(items: T[]): string[] {
  const seen = new Set<string>();
  for (const item of items) {
    for (const t of item.tags) seen.add(t);
  }
  return [...seen];
}

export type SortMode = "curated" | "date";

/**
 * "Curated" keeps the manual `order` field from the CMS (how Jean
 * actually wants projects ranked). "Date" re-sorts by the most recent
 * year mentioned in each item's `year` string, newest first.
 */
export function sortWorkItems<T extends { order: number; year: string }>(
  items: T[],
  mode: SortMode
): T[] {
  if (mode === "curated") return [...items].sort((a, b) => a.order - b.order);
  const latestYear = (y: string) => {
    const matches = y.match(/\d{4}/g);
    return matches ? parseInt(matches[matches.length - 1], 10) : 0;
  };
  return [...items].sort((a, b) => latestYear(b.year) - latestYear(a.year));
}
