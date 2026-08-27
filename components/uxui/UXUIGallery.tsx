"use client";

export type GalleryItem = { image: string; caption?: string };

/**
 * Vertical stack of rows -- image and description split 50/50. Clicking
 * the image still opens the lightbox at its index in the set.
 */
export default function UXUIGallery({
  items,
  onOpen,
}: {
  items: GalleryItem[];
  onOpen: (index: number) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-8">
      {items.map((item, i) => (
        <div
          key={`${item.image}-${i}`}
          className="flex flex-col gap-4 border-t border-[#e3e0d3] pt-8 sm:flex-row sm:items-center sm:gap-10"
        >
          <button
            type="button"
            onClick={() => onOpen(i)}
            className="group relative w-full shrink-0 overflow-hidden rounded-xl bg-[#d9d9d9] sm:w-1/2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.caption ?? ""}
              className="h-auto w-full object-contain transition duration-300 group-hover:scale-[1.02]"
            />
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#1a1a1a]/0 opacity-0 transition duration-300 group-hover:bg-[#1a1a1a]/10 group-hover:opacity-100">
              <span className="flex h-9 w-9 scale-75 items-center justify-center rounded-full border border-[#1a1a1a] bg-[#fdfbf5] font-archivo text-xl font-medium text-[#1a1a1a] shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition duration-300 group-hover:scale-100">
                +
              </span>
            </span>
          </button>
          {item.caption ? (
            <p className="font-archivo w-full text-sm font-light leading-relaxed text-[#6e6e6d] sm:w-1/2 sm:text-base">
              {item.caption}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
