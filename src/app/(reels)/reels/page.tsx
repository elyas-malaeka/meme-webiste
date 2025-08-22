// app/reals/page.tsx
import React from "react";
import ClientReelsWrapper from "@/Components/Reals/ClientReelsWrapper";
import prisma from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حلقه فیلم",
  description:
    "جدیدترین رئال‌ها و ویدیوهای طنز و سرگرمی را در حلقه فیلم مشاهده کنید.",
};

export const dynamic = "force-dynamic"; // ensure a fresh random pick each request

export default async function Reals() {
  // fetch your reels (adjust ordering/limit as needed)
  const reels = await prisma.mediaItem.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
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
      <div className="Reals mb-28 lg:mb-8">
        <p className="mt-2 text-base font-normal">No reels available</p>
      </div>
    );
  }

  // filter out items without src
  const validReels = reels.filter((r) => !!r.src);

  if (validReels.length === 0) {
    return (
      <div className="Reals mb-28 lg:mb-8">
        <p className="mt-2 text-base font-normal">No valid media to show</p>
      </div>
    );
  }

  // map to the client Post type the ReelsFeed expects
  const posts = validReels.map((r) => ({
    id: r.id,
    slug: r.slug,
    src: r.src!,
    isVideo: r.src!.toLowerCase().endsWith(".mp4"),
    poster: undefined,
    initialLikes: r.likes ?? 0,
    initialViews: r.views ?? 0,
    caption: r.description ?? "",
    author: r.author ?? "@uploader",
  }));

  // pick a random initial index (0..posts.length-1)
  const initialIndex = Math.floor(Math.random() * posts.length);

  return (
    <div className="Reals">
      {/* client wrapper contains the ReelsFeed and receives initialIndex */}
      <ClientReelsWrapper posts={posts} initialIndex={initialIndex} />
    </div>
  );
}
