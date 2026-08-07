"use client";

import { useMemo, useState } from "react";
import { filterWorkItems, typesToSlug, type WorkType } from "@/lib/workTypes";
import type { WorkItem } from "@/lib/work";
import WorkFilterSidebar from "./WorkFilterSidebar";
import WorkGrid from "./WorkGrid";

export default function WorkGallery({
  items,
  initialActiveTypes,
  titleA,
  titleB,
}: {
  items: WorkItem[];
  initialActiveTypes: WorkType[];
  titleA: string;
  titleB: string;
}) {
  const [activeTypes, setActiveTypes] = useState<WorkType[]>(initialActiveTypes);

  function toggleType(type: WorkType) {
    setActiveTypes((prev) => {
      const next = prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];
      const slug = typesToSlug(next);
      const url = slug.length ? `/work/${slug.join("/")}` : "/";
      // Keeps the URL shareable/bookmarkable without triggering a Next.js
      // navigation (which would re-render the server component tree and
      // feel like a page reload). Filtering itself is pure client state.
      window.history.pushState(null, "", url);
      return next;
    });
  }

  const filtered = useMemo(
    () => filterWorkItems(items, activeTypes),
    [items, activeTypes]
  );

  return (
    <main className="flex min-h-screen flex-col gap-6 border-b border-[#1a1a1a] md:flex-row md:items-stretch">
      <WorkFilterSidebar
        activeTypes={activeTypes}
        onToggle={toggleType}
        titleA={titleA}
        titleB={titleB}
      />
      <div className="hidden w-px shrink-0 bg-[#1a1a1a] md:block" />
      <WorkGrid items={filtered} />
    </main>
  );
}
