// app/gallery/[slug]/page.tsx
import React from "react";
import ClientReelsWrapper from "@/Components/Reals/ClientReelsWrapper"; // Changed this line
import prisma from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سرگرمی و طنز مذهبی",
  description:
    "بهترین مجموعه میم‌های شیعه، لحظات خنده‌دار و آموزنده مذهبی برای همه‌ی دوستداران طنز و فرهنگ شیعی.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // await params (Next.js requires this in some environments)
  const { slug } = await params;
  // Fetch a set of reels (adjust order / limit as you want)
  const reels = await prisma.mediaItem.findMany({
    orderBy: { createdAt: "desc" },
    take: 50, // adjust as needed
    select: {
      id: true,
      slug: true,
      src: true,
      description: true,
      likes: true,
      views: true,
      author: true,
      createdAt: true,
    },
  });

  if (!reels || reels.length === 0) {
    return (
      <div className="RealsMedia min-h-[calc(100vh-9.5rem)]">
        <p className="mt-2 text-base font-normal">No reels found</p>
      </div>
    );
  }

  // remove items with null src before mapping
  const validReels = reels.filter((r) => !!r.src);

  const posts = validReels.map((r) => ({
    id: r.id,
    slug: r.slug,
    src: r.src!, // safe because filtered
    isVideo: r.src!.toLowerCase().endsWith(".mp4"),
    poster: undefined,
    initialLikes: r.likes ?? 0,
    initialViews: r.views ?? 0,
    caption: r.description ?? "",
    author: r.author ?? "@uploader",
  }));

  if (posts.length === 0) {
    return (
      <div className="RealsMedia min-h-[calc(100vh-9.5rem)]">
        <p className="mt-2 text-base font-normal">No valid media to show</p>
      </div>
    );
  }

  const initialIndex = Math.max(
    posts.findIndex((p) => p.slug === slug),
    0,
  );

  return (
    <div className="RealsMedia">
      <ClientReelsWrapper posts={posts} initialIndex={initialIndex} />
    </div>
  );
}
