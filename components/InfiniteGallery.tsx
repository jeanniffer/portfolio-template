"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Orientation = "landscape" | "portrait";
type Ratios = Record<string, number>;

function HoverPlus() {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition duration-300 group-hover:bg-ink/20 group-hover:opacity-100">
      <span className="flex h-12 w-12 scale-75 items-center justify-center rounded-full border border-accent bg-accent font-display text-2xl font-semibold text-ink shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition duration-300 group-hover:scale-100">
        +
      </span>
    </span>
  );
}

type GalleryCell =
  | { type: "single"; image: string; index: number }
  | { type: "pair"; images: [string, string]; indices: [number, number] };

/**
 * Horizontal, infinitely-looping strip. Every tile is sized to the image's
 * real aspect ratio (`style={{ aspectRatio }}`), so `object-cover` fills it
 * exactly -- no cropping, no empty letterbox space, photos read at full
 * size. Two horizontal (landscape) images in a row stack into one 2-row
 * column (matches a slide deck's cover + detail pairing); a vertical
 * (portrait) image always gets its own full-height column. Auto-scrolls
 * slowly when idle, pauses on hover, and always supports click-and-drag.
 * Clicking any tile opens the lightbox at its real position across the
 * combined thumbnails + slides set.
 */
export default function InfiniteGallery({
  thumbnails,
  slides,
  onOpen,
}: {
  thumbnails: string[];
  slides: string[];
  onOpen: (index: number) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const images = [...thumbnails, ...slides];
  const [ratios, setRatios] = useState<Ratios>({});

  // Load each image's real dimensions once, client-side, so every tile can
  // be sized to its exact aspect ratio -- no cropping, no leftover empty
  // space, and it tells us which ones can be paired into a 2-row column.
  useEffect(() => {
    images.forEach((src) => {
      if (!src || ratios[src]) return;
      const img = new Image();
      img.onload = () => {
        setRatios((prev) =>
          prev[src] ? prev : { ...prev, [src]: img.naturalWidth / img.naturalHeight }
        );
      };
      img.src = src;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thumbnails, slides]);

  const orientationOf = (src: string): Orientation | undefined =>
    ratios[src] === undefined ? undefined : ratios[src] >= 1 ? "landscape" : "portrait";

  const cells: GalleryCell[] = [];
  {
    let i = 0;
    while (i < images.length) {
      const src = images[i];
      const orientation = orientationOf(src);
      const nextSrc = images[i + 1];
      const nextOrientation = nextSrc ? orientationOf(nextSrc) : undefined;

      if (
        orientation === "landscape" &&
        nextOrientation === "landscape" &&
        nextSrc
      ) {
        cells.push({
          type: "pair",
          images: [src, nextSrc],
          indices: [i, i + 1],
        });
        i += 2;
      } else {
        cells.push({ type: "single", image: src, index: i });
        i += 1;
      }
    }
  }

  const looped = [...cells, ...cells, ...cells];

  const isPaused = useRef(false);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const dragMoved = useRef(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || cells.length === 0) return;
    el.scrollLeft = el.scrollWidth / 3;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cells.length]);

  const wrapScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const third = el.scrollWidth / 3;
    if (third === 0) return;
    if (el.scrollLeft < third * 0.5) {
      el.scrollLeft += third;
    } else if (el.scrollLeft > third * 1.5) {
      el.scrollLeft -= third;
    }
  }, []);

  // Slow auto-scroll while idle (not hovered, not being dragged).
  useEffect(() => {
    let frame: number;
    function tick() {
      const el = scrollerRef.current;
      if (el && !isPaused.current && !isDragging.current) {
        el.scrollLeft += 0.4;
        wrapScroll();
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [wrapScroll]);

  // Click-and-drag scrolling uses plain mouse events on `window` (not the
  // Pointer Events + setPointerCapture API) -- Safari has a known bug
  // where capturing the pointer on an ancestor element can silently
  // swallow the resulting `click` on a nested <button>.
  const handleWindowMouseMove = useCallback((e: MouseEvent) => {
    const el = scrollerRef.current;
    if (!el || !isDragging.current) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 6) dragMoved.current = true;
    el.scrollLeft = dragStartScroll.current - dx;
  }, []);

  const handleWindowMouseUp = useCallback(() => {
    isDragging.current = false;
    wrapScroll();
    window.removeEventListener("mousemove", handleWindowMouseMove);
    window.removeEventListener("mouseup", handleWindowMouseUp);
  }, [handleWindowMouseMove, wrapScroll]);

  function handleMouseDown(e: React.MouseEvent) {
    const el = scrollerRef.current;
    if (!el) return;
    isDragging.current = true;
    dragMoved.current = false;
    dragStartX.current = e.clientX;
    dragStartScroll.current = el.scrollLeft;
    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);
  }

  function openIfNotDragged(index: number) {
    if (!dragMoved.current) onOpen(index);
  }

  // Safety net: if the component unmounts mid-drag, don't leak listeners.
  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, [handleWindowMouseMove, handleWindowMouseUp]);

  return (
    <div
      ref={scrollerRef}
      onScroll={wrapScroll}
      onMouseEnter={() => (isPaused.current = true)}
      onMouseLeave={() => (isPaused.current = false)}
      onMouseDown={handleMouseDown}
      className="no-scrollbar flex w-full cursor-grab select-none gap-4 overflow-x-auto active:cursor-grabbing"
    >
      {looped.map((cell, i) => {
        if (cell.type === "pair") {
          return (
            <div
              key={i}
              className="flex h-[50vh] max-w-[70vw] shrink-0 flex-col items-start gap-4 md:h-[68vh]"
            >
              {cell.images.map((src, j) => (
                <button
                  type="button"
                  key={j}
                  onClick={() => openIfNotDragged(cell.indices[j])}
                  style={{ aspectRatio: ratios[src] ?? 1.5, maxWidth: "70vw" }}
                  className="group relative h-1/2 w-full overflow-hidden rounded-xl bg-white/5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    draggable={false}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <HoverPlus />
                </button>
              ))}
            </div>
          );
        }

        return (
          <button
            type="button"
            key={i}
            onClick={() => openIfNotDragged(cell.index)}
            style={{ aspectRatio: ratios[cell.image] ?? 0.75, maxWidth: "70vw" }}
            className="group relative h-[50vh] shrink-0 overflow-hidden rounded-xl bg-white/5 md:h-[68vh]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cell.image}
              alt=""
              draggable={false}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <HoverPlus />
          </button>
        );
      })}
    </div>
  );
}
