"use client";

import Link from "next/link";
import { WORK_TYPES, typesToSlug, type WorkType } from "@/lib/work";

export default function WorkFilterSidebar({
  activeTypes,
  titleA,
  titleB,
}: {
  activeTypes: WorkType[];
  titleA: string;
  titleB: string;
}) {
  function hrefFor(type: WorkType) {
    const isActive = activeTypes.includes(type);
    const next = isActive
      ? activeTypes.filter((t) => t !== type)
      : [...activeTypes, type];
    const slug = typesToSlug(next);
    return slug.length ? `/work/${slug.join("/")}` : "/";
  }

  return (
    <aside className="shrink-0 border-b border-ink/10 px-6 py-10 md:w-72 md:border-b-0 md:border-r md:px-10 md:py-16">
      <h1 className="font-display text-5xl font-black leading-[0.95] text-ink md:text-6xl">
        {titleA}
        <br />
        {titleB}
      </h1>

      <div className="mt-10">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-ink/50">
          Type
        </p>
        <ul className="flex flex-wrap gap-2 md:flex-col md:items-start">
          {WORK_TYPES.map(({ slug, label }) => {
            const active = activeTypes.includes(slug);
            return (
              <li key={slug}>
                <Link
                  href={hrefFor(slug)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition ${
                    active
                      ? "border-ink bg-ink text-cream"
                      : "border-ink/20 text-ink hover:border-ink/50"
                  }`}
                >
                  {label}
                  {active && <span aria-hidden>✓</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
