import Image from "next/image";
import Link from "next/link";
import type { WorkItem } from "@/lib/work";

export default function WorkGrid({ items }: { items: WorkItem[] }) {
  if (!items.length) {
    return (
      <div className="flex flex-1 items-center justify-center py-16 text-[#818181]">
        No projects match this filter yet.
      </div>
    );
  }

  return (
    <div className="grid flex-1 grid-cols-1 gap-x-6 gap-y-6 overflow-y-auto py-6 sm:grid-cols-2">
      {items.map((item) => {
        const card = (
          <>
            <div className="relative h-[340px] w-full shrink-0 overflow-hidden rounded-2xl bg-[#d9d9d9]">
              <Image
                src={item.cover}
                alt={item.client}
                fill
                sizes="(min-width: 640px) 40vw, 90vw"
                className="object-cover object-bottom transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="mt-3 flex w-full items-center justify-between whitespace-nowrap font-mono text-xs font-light tracking-[0.72px] text-[#1a1a1a]">
              <div className="flex items-start gap-2">
                {item.tags.map((t) => (
                  <p key={t}>[{t.toUpperCase()}]</p>
                ))}
              </div>
              <p>[{item.year}]</p>
            </div>
            <p className="font-archivo mt-0 w-full text-[32px] font-medium tracking-[-1.28px] text-[#1a1a1a]">
              {item.client}
            </p>
          </>
        );

        return item.href ? (
          <Link
            key={item.slug}
            href={item.href}
            className="group flex flex-col items-start pb-4"
          >
            {card}
          </Link>
        ) : (
          <div key={item.slug} className="group flex flex-col items-start pb-4">
            {card}
          </div>
        );
      })}
    </div>
  );
}
