import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Section } from "./content";

/**
 * PARALLEL content system (opt-in, not wired into any page yet).
 *
 * Instead of every variant duplicating full copies of case studies /
 * testimonials / services, the source of truth for each item lives once
 * under content/_shared/<kind>/<slug>.md ("the master"). Each variant then
 * has a small "selections" file (content/<variant>/selections.md) that
 * just lists which slugs it wants, in what order, and -- optionally -- a
 * set of field overrides if that variant needs to say something different
 * to its specific audience (e.g. a different "role" or a fully rewritten
 * description).
 *
 * Nothing here replaces the existing getCaseStudies()/getSection() calls
 * that the live pages use -- this is a separate set of functions a page
 * can opt into later by importing from here instead. Existing published
 * variants are untouched.
 */

const CONTENT_ROOT = path.join(process.cwd(), "content");
const SHARED_ROOT = path.join(CONTENT_ROOT, "_shared");

export type SharedKind =
  | "case-studies"
  | "testimonials"
  | "services"
  | "sneak-peek-projects";

type SelectionEntry = {
  slug: string;
  order?: number;
  // Shallow frontmatter overrides (e.g. role, deliverables, title, price).
  overrides?: Record<string, any>;
  // Full replacement for the master's markdown body, if this variant
  // needs a differently-worded description/quote for this item.
  content?: string;
};

type Selections = {
  caseStudies?: SelectionEntry[];
  testimonials?: SelectionEntry[];
  services?: SelectionEntry[];
  sneakPeekProjects?: SelectionEntry[];
};

const SELECTION_KEY: Record<SharedKind, keyof Selections> = {
  "case-studies": "caseStudies",
  testimonials: "testimonials",
  services: "services",
  "sneak-peek-projects": "sneakPeekProjects",
};

function readMasterFile(kind: SharedKind, slug: string): Section {
  const file = path.join(SHARED_ROOT, kind, `${slug}.md`);
  if (!fs.existsSync(file)) {
    throw new Error(
      `Shared content missing: content/_shared/${kind}/${slug}.md was ` +
        `referenced in a selections.md but doesn't exist.`
    );
  }
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return { slug, frontmatter: data, content };
}

function readSelections(variant: string): Selections {
  const file = path.join(CONTENT_ROOT, variant, "selections.md");
  if (!fs.existsSync(file)) return {};
  const raw = fs.readFileSync(file, "utf8");
  const { data } = matter(raw);
  return data as Selections;
}

/**
 * Merges a master item with a variant's selection entry: frontmatter
 * overrides are shallow-merged on top of the base, and a full `content`
 * override (if present) replaces the master's body entirely.
 */
function applyOverrides(master: Section, entry: SelectionEntry): Section {
  return {
    slug: master.slug,
    frontmatter: { ...master.frontmatter, ...(entry.overrides || {}) },
    content: entry.content ?? master.content,
  };
}

/**
 * Returns the merged, ordered list of items of one kind for a variant --
 * e.g. getSharedItems("case-studies", "osf") reads
 * content/osf/selections.md for which case studies it wants (and any
 * overrides), then merges each against its master file in
 * content/_shared/case-studies/.
 *
 * If a variant has no selections.md (or no entries for this kind), this
 * returns an empty array -- it's purely opt-in per variant.
 */
export function getSharedItems(kind: SharedKind, variant: string): Section[] {
  const selections = readSelections(variant);
  const entries = selections[SELECTION_KEY[kind]] || [];

  return entries
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((entry) => applyOverrides(readMasterFile(kind, entry.slug), entry));
}

export function getSharedCaseStudies(variant: string): Section[] {
  return getSharedItems("case-studies", variant);
}

export function getSharedTestimonials(variant: string): Section[] {
  return getSharedItems("testimonials", variant);
}

export function getSharedServices(variant: string): Section[] {
  return getSharedItems("services", variant);
}

export function getSharedSneakPeekProjects(variant: string): Section[] {
  return getSharedItems("sneak-peek-projects", variant);
}

/** Lists every master slug available for a given kind -- handy for a
 * future admin UI or just to see what's available to select from. */
export function listMasterSlugs(kind: SharedKind): string[] {
  const dir = path.join(SHARED_ROOT, kind);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .sort();
}
