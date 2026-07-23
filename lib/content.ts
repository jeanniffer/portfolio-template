import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * Content lives in /content/<variant>/*.md
 * The active variant is chosen by the SITE_VARIANT env var, which is set
 * per Vercel project (see README.md). This lets one repo power multiple
 * subdomains (nonprofits.jeanniffer.com, education.jeanniffer.com, ...)
 * with completely different copy, images and case studies -- no code changes.
 */

const CONTENT_ROOT = path.join(process.cwd(), "content");
const CASE_STUDY_IMAGES_ROOT = path.join(
  process.cwd(),
  "public",
  "images",
  "case-studies"
);
const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp)$/i;

/**
 * Auto-picks up any JPG/PNG/WebP dropped into
 * public/images/case-studies/<folder>/ -- no markdown edits needed.
 * A "thumbnails" subfolder (optional) becomes the mini-collage tile;
 * everything else directly in <folder> becomes a full-size slide, both
 * sorted alphabetically (so name files 01, 02, 03... to control order).
 */
function getCaseStudyGallery(folder: string): {
  thumbnails: string[];
  slides: string[];
} {
  const base = path.join(CASE_STUDY_IMAGES_ROOT, folder);
  const thumbDir = path.join(base, "thumbnails");

  // Preference order when the same photo exists in more than one format
  // (e.g. an original "01.png" next to an optimized "01.jpg") -- keeps the
  // smaller, web-friendly version and skips the heavier duplicate.
  const FORMAT_PRIORITY: Record<string, number> = {
    webp: 0,
    jpg: 1,
    jpeg: 1,
    png: 2,
  };

  function listImages(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    const files = fs.readdirSync(dir).filter((f) => IMAGE_EXTENSIONS.test(f));

    const byBaseName = new Map<string, string>();
    for (const f of files) {
      const ext = path.extname(f).slice(1).toLowerCase();
      const base = f.slice(0, -(ext.length + 1));
      const existing = byBaseName.get(base);
      if (
        !existing ||
        FORMAT_PRIORITY[ext] < FORMAT_PRIORITY[path.extname(existing).slice(1).toLowerCase()]
      ) {
        byBaseName.set(base, f);
      }
    }

    return Array.from(byBaseName.values()).sort();
  }

  const thumbnails = listImages(thumbDir).map(
    (f) => `/images/case-studies/${folder}/thumbnails/${f}`
  );
  const slides = listImages(base).map(
    (f) => `/images/case-studies/${folder}/${f}`
  );

  return { thumbnails, slides };
}

export function getVariant(): string {
  return process.env.SITE_VARIANT || "nonprofits";
}

function variantDir(variant: string) {
  return path.join(CONTENT_ROOT, variant);
}

export type SiteMeta = {
  name: string;
  role: string;
  heroTitleA: string;
  heroTitleB: string;
  dateLabel: string;
  badge: string;
  skills: string;
  // Optional: when set, CTA buttons across the site link to this mailto:
  // address instead of the Upwork profile -- used for the social-impact
  // variant, which targets direct-hire foundations rather than Upwork.
  contactEmail?: string;
};

export type Section = {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
};

// Always the current month + year, e.g. "July 2026" -- overrides whatever
// static value site.md has for dateLabel so it never goes stale.
function currentDateLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function getSiteMeta(): SiteMeta {
  const file = path.join(variantDir(getVariant()), "site.md");
  const raw = fs.readFileSync(file, "utf8");
  const { data } = matter(raw);
  return { ...(data as SiteMeta), dateLabel: currentDateLabel() };
}

export function getSection(slug: string): Section {
  const file = path.join(variantDir(getVariant()), `${slug}.md`);
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return { slug, frontmatter: data, content };
}

export function getCaseStudies(): Section[] {
  const dir = variantDir(getVariant());
  return fs
    .readdirSync(dir)
    .filter((f) => f.startsWith("case-study-") && f.endsWith(".md"))
    .sort()
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { data, content } = matter(raw);

      // `imagesFolder` in frontmatter points at a folder under
      // public/images/case-studies/ -- if set, whatever images live there
      // become the gallery automatically (overriding any hand-typed
      // thumbnails/slides lists in the markdown).
      if (data.imagesFolder) {
        const { thumbnails, slides } = getCaseStudyGallery(data.imagesFolder);
        if (thumbnails.length) data.thumbnails = thumbnails;
        if (slides.length) data.slides = slides;
      }

      return { slug: f.replace(/\.md$/, ""), frontmatter: data, content };
    });
}
