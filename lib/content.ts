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

  function listImages(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => IMAGE_EXTENSIONS.test(f))
      .sort();
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
};

export type Section = {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
};

export function getSiteMeta(): SiteMeta {
  const file = path.join(variantDir(getVariant()), "site.md");
  const raw = fs.readFileSync(file, "utf8");
  const { data } = matter(raw);
  return data as SiteMeta;
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
