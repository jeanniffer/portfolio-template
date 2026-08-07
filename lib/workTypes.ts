/**
 * Client-safe slice of lib/work.ts: just the fixed TYPE list and the
 * slug <-> types helpers. No `fs`/`path` here so client components
 * (WorkFilterSidebar) can import it without pulling Node built-ins
 * into the browser bundle.
 */

export type WorkType = "mission-driven" | "tech-finance" | "personal-experimental";

// Fixed for now (per Jean, Aug 2026) -- order here is the order shown in
// the TYPE filter sidebar.
export const WORK_TYPES: { slug: WorkType; label: string }[] = [
  { slug: "mission-driven", label: "Mission-driven" },
  { slug: "tech-finance", label: "Tech & Finance" },
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
