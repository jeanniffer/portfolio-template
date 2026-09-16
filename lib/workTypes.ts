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

/** Counts how many items carry each label, in first-seen order (used
 * as the tiebreak when two labels have the same count, so the order
 * stays stable rather than jumping around as content changes). */
function countLabels(lists: string[][]): [string, number][] {
  const counts = new Map<string, number>();
  for (const labels of lists) {
    for (const label of labels) {
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
  }
  return [...counts.entries()];
}

/** Most-populated label first -- filter pills for niches/tags with more
 * projects behind them surface before ones with only one or two, so the
 * list reads as "here's most of what I do" instead of a random order.
 * Ties keep first-seen order (stable sort). */
function sortByCountDesc(counted: [string, number][]): string[] {
  return counted
    .map(([label, count], index) => ({ label, count, index }))
    .sort((a, b) => b.count - a.count || a.index - b.index)
    .map((entry) => entry.label);
}

/** All distinct niche labels across a set of items, most-populated
 * first. */
export function collectNiches<T extends { types: WorkType[] }>(items: T[]): WorkType[] {
  return sortByCountDesc(countLabels(items.map((item) => item.types)));
}

/** All distinct tags across a set of items, most-populated first. */
export function collectTags<T extends { tags: string[] }>(items: T[]): string[] {
  return sortByCountDesc(countLabels(items.map((item) => item.tags)));
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
