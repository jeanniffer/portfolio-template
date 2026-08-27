import fs from "fs";
import path from "path";
import type { Section } from "@/lib/content";
import UXUIReveal from "./UXUIReveal";

type Cert = { name: string; issuer: string; year: string; image?: string };

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];

// Resolves a cert's declared image path to whatever file actually exists on
// disk, regardless of the extension written in certifications.md -- so
// dropping a .jpg where a .png was declared (or vice versa) just works.
function resolveImage(publicPath?: string): string | null {
  if (!publicPath) return null;
  const dir = path.join(process.cwd(), "public", path.dirname(publicPath.replace(/^\//, "")));
  const base = path.basename(publicPath).replace(/\.[^.]+$/, "");
  const urlDir = path.dirname(publicPath);

  for (const ext of IMAGE_EXTENSIONS) {
    const candidate = path.join(dir, `${base}.${ext}`);
    try {
      if (fs.existsSync(candidate)) {
        return `${urlDir}/${base}.${ext}`;
      }
    } catch {
      // ignore
    }
  }
  return null;
}

export default function UXUICertifications({ section }: { section: Section }) {
  const { titleA, titleB } = section.frontmatter;
  const certs: Cert[] = section.frontmatter.certs || [];

  if (!certs.length) return null;

  return (
    <section
      id="certifications"
      data-section-label="Certifications"
      className="relative flex flex-col justify-center px-6 py-14 md:px-20"
    >
      <UXUIReveal>
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-10">
          {titleA ? (
            <h2 className="font-archivo max-w-2xl text-3xl font-medium leading-[1.15] tracking-[-0.8px] text-[#1a1a1a] md:text-[42px]">
              {titleA}
              <span className="italic">{titleB}</span>
            </h2>
          ) : null}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certs.map((cert, i) => {
              const resolvedImage = resolveImage(cert.image);
              const hasImage = Boolean(resolvedImage);
              return (
                <div
                  key={`${cert.name}-${i}`}
                  className="flex flex-col overflow-hidden border border-[#e3e0d3] bg-[#fdfbf5]"
                >
                  <div className="relative flex aspect-[4/3] w-full items-center justify-center bg-[#f3f0e6]">
                    {hasImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolvedImage!}
                        alt={`${cert.name} certificate`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="dot-grid absolute inset-0 opacity-40" aria-hidden />
                    )}
                    {!hasImage ? (
                      <div className="relative flex flex-col items-center gap-2 px-6 text-center">
                        <span className="font-mono text-[10px] uppercase tracking-[2px] text-[#818181]">
                          Image placeholder
                        </span>
                        <span className="font-mono text-[10px] text-[#a3a3a2]">
                          {cert.image}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1 px-5 py-4">
                    <p className="font-archivo text-base font-medium leading-snug text-[#1a1a1a]">
                      {cert.name}
                    </p>
                    <p className="font-mono text-xs uppercase tracking-[1px] text-[#818181]">
                      {cert.issuer} · {cert.year}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </UXUIReveal>
    </section>
  );
}
