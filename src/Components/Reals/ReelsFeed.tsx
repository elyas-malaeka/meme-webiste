// ReelsFeed.tsx - Updated with reels/ URLs
"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import ReelsCard from "./ReelsCard";
import type { StaticImageData } from "next/image";

type Post = {
  id: number;
  slug: string;
  src: string | StaticImageData;
  isVideo?: boolean;
  poster?: string;
  initialLikes?: number;
  initialViews?: number;
  caption?: string;
  author?: string;
};

type Props = {
  posts: Post[];
  initialIndex?: number;
};

export default function ReelsFeed({ posts, initialIndex = 0 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentIndexRef = useRef<number>(initialIndex);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // URL/history helpers (dynamic route detection)
  const urlTimeoutRef = useRef<number | null>(null);
  const lastUrlRef = useRef<string>("");

  // Detect if we're on a reels or gallery page
  const getRoutePrefix = useCallback(() => {
    const pathname = window.location.pathname;
    if (pathname.startsWith("/reels")) return "/reels";
    if (pathname.startsWith("/gallery")) return "/gallery";
    return "/reels"; // default fallback
  }, []);

  const updateUrl = useCallback(
    (slug: string, usePush = true) => {
      if (lastUrlRef.current === slug) return;
      if (urlTimeoutRef.current) {
        window.clearTimeout(urlTimeoutRef.current);
      }
      urlTimeoutRef.current = window.setTimeout(() => {
        const routePrefix = getRoutePrefix();
        const path = `${routePrefix}/${slug}`;
        if (usePush) {
          window.history.pushState({ slug }, "", path);
        } else {
          window.history.replaceState({ slug }, "", path);
        }
        lastUrlRef.current = slug;
      }, 250);
    },
    [getRoutePrefix],
  );

  const scrollToIndex = useCallback((idx: number) => {
    const container = containerRef.current;
    const selector = `.reel-item[data-index="${idx}"]`;
    const el =
      (container?.querySelector<HTMLElement>(selector) as HTMLElement) ??
      (document.querySelector<HTMLElement>(selector) as HTMLElement);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // initial scroll + replaceState
  useEffect(() => {
    const t = window.setTimeout(() => {
      scrollToIndex(initialIndex);
      if (posts[initialIndex]?.slug) {
        lastUrlRef.current = posts[initialIndex].slug;
        const routePrefix = getRoutePrefix();
        window.history.replaceState(
          { slug: posts[initialIndex].slug },
          "",
          `${routePrefix}/${posts[initialIndex].slug}`,
        );
      }
    }, 40);
    return () => window.clearTimeout(t);
  }, [initialIndex, posts, scrollToIndex, getRoutePrefix]);

  // IntersectionObserver (root = container so visibility is measured correctly)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const idx = Number(
              (entry.target as HTMLElement).dataset.index ?? 0,
            );
            if (idx !== currentIndexRef.current) {
              setCurrentIndex(idx);
              currentIndexRef.current = idx;
              const slug = posts[idx]?.slug;
              if (slug) updateUrl(slug, true);
            }
          }
        });
      },
      {
        root: container,
        threshold: [0.6],
        rootMargin: "-10% 0px -10% 0px",
      },
    );

    const items = container.querySelectorAll<HTMLElement>(".reel-item");
    items.forEach((item) => observerRef.current?.observe(item));

    return () => observerRef.current?.disconnect();
  }, [posts, updateUrl]);

  // popstate handling (handles both reels/ and gallery/ URLs)
  useEffect(() => {
    const onPop = () => {
      const pathSegments = window.location.pathname.split("/").filter(Boolean);
      // Look for /reels/[slug] or /gallery/[slug] pattern
      const reelsIndex = pathSegments.indexOf("reels");
      const galleryIndex = pathSegments.indexOf("gallery");

      let slugFromPath = "";
      if (reelsIndex >= 0 && pathSegments[reelsIndex + 1]) {
        slugFromPath = pathSegments[reelsIndex + 1];
      } else if (galleryIndex >= 0 && pathSegments[galleryIndex + 1]) {
        slugFromPath = pathSegments[galleryIndex + 1];
      }

      if (!slugFromPath) return;
      const idx = posts.findIndex((p) => p.slug === slugFromPath);
      if (idx >= 0 && idx !== currentIndexRef.current) {
        currentIndexRef.current = idx;
        setCurrentIndex(idx);
        scrollToIndex(idx);
        lastUrlRef.current = slugFromPath;
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [posts, scrollToIndex]);

  // keyboard nav
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown"].includes(e.key)) {
        e.preventDefault();
        const next = Math.min(currentIndexRef.current + 1, posts.length - 1);
        scrollToIndex(next);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        const prev = Math.max(currentIndexRef.current - 1, 0);
        scrollToIndex(prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [posts.length, scrollToIndex]);

  // cleanup debounce timeout
  useEffect(() => {
    return () => {
      if (urlTimeoutRef.current) window.clearTimeout(urlTimeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="no-scrollbar -webkit-overflow-scrolling-touch mx-auto flex h-screen w-full snap-y snap-mandatory flex-col gap-2 overflow-y-auto lg:h-[calc(100vh-4rem)] lg:max-w-[600px] lg:gap-6"
      role="list"
    >
      {posts.map((p, i) => {
        // resolve StaticImageData -> string for TypeScript safety
        const resolvedSrc: string =
          typeof p.src === "string" ? p.src : (p.src as StaticImageData).src;

        return (
          <div
            key={p.id}
            data-index={i}
            data-slug={p.slug}
            className="reel-item flex h-screen w-full flex-none snap-start items-center justify-center overflow-hidden bg-black lg:h-[calc(100vh-4rem)] lg:rounded-2xl"
            role="listitem"
          >
            <ReelsCard
              src={resolvedSrc}
              isVideo={p.isVideo}
              poster={p.poster}
              initialLikes={p.initialLikes}
              initialViews={p.initialViews}
              caption={p.caption}
              author={p.author}
              isActive={i === currentIndex}
            />
          </div>
        );
      })}
    </div>
  );
}
