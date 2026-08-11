/**
 * Client-safe slice of lib/work.ts: slug <-> label helpers and the
 * filter/sort logic. No `fs`/`path` here so client components
 * (WorkFilterSidebar) can import it without pulling Node built-ins
 * into the browser bundle.
 *
 * Niches (`types`) work exactly like Tags: whatever labels show up in
 * a project's `types:` frontmatter automatically become filter pills,
 * no fixed list to maintain in code. To keep the shareable
 * /work/[niche-slug] URLs working with free-form labels, we slugify
 * each label for the URL and map back to the real label using
 * whatever niches actually exist in the content at request time.
 */

export type WorkType = string;

/** "Tech & Finance" -> "tech-and-finance" */
function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

/** All distinct niche labels across a set of items, in first-seen
 * order (so the filter list order tracks the order projects are
 * curated in). */
export function collectNiches<T extends { types: WorkType[] }>(items: T[]): WorkType[] {
  const seen = new Set<string>();
  for (const item of items) {
    for (const t of item.types) seen.add(t);
  }
  return [...seen];
}

/** All distinct tags across a set of items, same first-seen ordering. */
export function collectTags<T extends { tags: string[] }>(items: T[]): string[] {
  const seen = new Set<string>();
  for (const item of items) {
    for (const t of item.tags) seen.add(t);
  }
  return [...seen];
}

/**
 * Canonical slug for a set of active niche filters: always sorted so
 * the same combination produces the same URL no matter what order
 * they were clicked in.
 */
export function typesToSlug(types: WorkType[]): string[] {
  return [...new Set(types.map(slugify))].sort();
}

/** Parses the catch-all route params back into real niche labels,
 * matching against whatever niches actually exist in the content
 * (since niches are free-form, not a fixed enum). */
export function slugToTypes(
  slugParts: string[] | undefined,
  allNiches: WorkType[]
): WorkType[] {
  if (!slugParts) return [];
  const bySlug = new Map(allNiches.map((label) => [slugify(label), label]));
  const matched = slugParts
    .map((s) => bySlug.get(s))
    .filter((label): label is WorkType => Boolean(label));
  return [...new Set(matched)].sort();
}

/** Generic so it works on the client without importing WorkItem (which
 * lives in lib/work.ts, an fs-importing server-only module). Multiple
 * selected niches are OR'd together (match if the project has *any* of
 * the selected niches), not AND'd. */
export function filterWorkItems<T extends { types: WorkType[] }>(
  items: T[],
  activeTypes: WorkType[]
): T[] {
  if (!activeTypes.length) return items;
  return items.filter((item) => activeTypes.some((t) => item.types.includes(t)));
}

/** Free-form tags (e.g. "Web Design", "Design System") are per-project
 * content, not a fixed list -- filtering just checks against whatever
 * strings each item actually has. Same OR logic as filterWorkItems. */
export function filterByTags<T extends { tags: string[] }>(
  items: T[],
  activeTags: string[]
): T[] {
  if (!activeTags.length) return items;
  return items.filter((item) => activeTags.some((t) => item.tags.includes(t)));
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
