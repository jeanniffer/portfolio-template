import Image from "next/image";
import Link from "next/link";
import type { WorkItem } from "@/lib/work";

export default function WorkGrid({ items }: { items: WorkItem[] }) {
  if (!items.length) {
    return (
      <div className="flex-1 px-6 py-16 text-ink/50 md:px-10">
        No projects match this filter yet.
      </div>
    );
  }

  return (
    <div className="grid flex-1 grid-cols-1 gap-x-8 gap-y-12 px-6 py-10 sm:grid-cols-2 md:px-10 md:py-16">
      {items.map((item) => {
        const card = (
          <>
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink/5">
              <Image
                src={item.cover}
                alt={item.client}
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="mt-3 flex items-baseline justify-between font-mono text-xs uppercase tracking-wide text-ink/50">
              <span>{item.tags.map((t) => `[${t.toUpperCase()}]`).join(" ")}</span>
              <span>[{item.year}]</span>
            </div>
            <p className="mt-1 text-2xl font-semibold text-ink">{item.client}</p>
          </>
        );

        return item.href ? (
          <Link key={item.slug} href={item.href} className="group block">
            {card}
          </Link>
        ) : (
          <div key={item.slug} className="group block">
            {card}
          </div>
        );
      })}
    </div>
  );
}
