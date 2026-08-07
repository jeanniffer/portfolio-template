"use client";

import Link from "next/link";
import { WORK_TYPES, typesToSlug, type WorkType } from "@/lib/workTypes";

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
    <aside className="flex h-full shrink-0 flex-col items-start gap-6 py-6">
      <div className="flex w-[300px] flex-col items-start">
        <p className="font-archivo w-full text-[72px] font-medium leading-none tracking-[-1.44px] text-[#1a1a1a]">
          {titleA}
          <br />
          {titleB}
        </p>
      </div>

      <div className="flex w-full flex-col items-start gap-3">
        <div className="flex items-center gap-1">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.48px] text-[#818181]">
            Type
          </p>
          <span aria-hidden className="text-[9px] text-[#818181]">
            ▾
          </span>
        </div>
        <div className="flex w-full flex-wrap items-start gap-3">
          {WORK_TYPES.map(({ slug, label }) => {
            const active = activeTypes.includes(slug);
            return (
              <Link
                key={slug}
                href={hrefFor(slug)}
                className={`flex items-center justify-center gap-1 rounded-full border px-3 py-1 font-mono text-sm tracking-[-0.56px] transition ${
                  active
                    ? "border-[#1a1a1a] bg-[#1a1a1a] text-[#fdfbf5]"
                    : "border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a]/5"
                }`}
              >
                {label}
                {active && <span aria-hidden>✓</span>}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
