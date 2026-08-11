"use client";

import { useMemo, useState } from "react";
import {
  collectNiches,
  collectTags,
  filterByTags,
  filterWorkItems,
  sortWorkItems,
  typesToSlug,
  type SortMode,
  type WorkType,
} from "@/lib/workTypes";
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
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("curated");

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

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  const allTags = useMemo(() => collectTags(items), [items]);
  const allNiches = useMemo(() => collectNiches(items), [items]);

  const filtered = useMemo(() => {
    const byType = filterWorkItems(items, activeTypes);
    const byTag = filterByTags(byType, activeTags);
    return sortWorkItems(byTag, sortMode);
  }, [items, activeTypes, activeTags, sortMode]);

  return (
    <main className="flex min-h-screen flex-col gap-10 border-b border-[#1a1a1a] md:flex-row md:items-stretch">
      <WorkFilterSidebar
        allNiches={allNiches}
        activeTypes={activeTypes}
        onToggleType={toggleType}
        allTags={allTags}
        activeTags={activeTags}
        onToggleTag={toggleTag}
        titleA={titleA}
        titleB={titleB}
      />
      <div className="hidden w-px shrink-0 bg-[#1a1a1a] md:block" />
      <WorkGrid items={filtered} sortMode={sortMode} onSortModeChange={setSortMode} />
    </main>
  );
}
