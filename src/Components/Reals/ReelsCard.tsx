"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

/* ----------------------- Icon Props Types ----------------------- */
interface IconProps {
  size?: number;
  filled?: boolean;
}

interface VolumeIconProps {
  size?: number;
  muted?: boolean;
}

interface PlayPauseIconProps {
  size?: number;
  isPlaying?: boolean;
}

/* ----------------------- Plain Icons (no gradients, use currentColor) ----------------------- */
const HeartIcon = ({ size = 28, filled = false }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ShareIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <polyline
      points="16,6 12,2 8,6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <line
      x1="12"
      y1="2"
      x2="12"
      y2="15"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const EyeIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="currentColor"
      strokeWidth="2"
      fill="rgba(255,255,255,0.06)"
    />
  </svg>
);

const VolumeIcon = ({ muted = false, size = 20 }: VolumeIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <polygon
      points="11,5 6,9 2,9 2,15 6,15 11,19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      opacity={muted ? "0.5" : "1"}
    />
    {!muted && (
      <>
        <path
          d="m19.07 4.93-1.41 1.41A6 6 0 0 1 19 12a6 6 0 0 1-1.34 5.66l1.41 1.41A8 8 0 0 0 21 12a8 8 0 0 0-1.93-7.07z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M15.54 8.46a4 4 0 0 1 0 7.07"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </>
    )}
    {muted && (
      <line
        x1="23"
        y1="9"
        x2="17"
        y2="15"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);

const PlayPauseIcon = ({
  isPlaying = false,
  size = 24,
}: PlayPauseIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    {isPlaying ? (
      <>
        <rect x="6" y="4" width="4" height="16" rx="2" fill="currentColor" />
        <rect x="14" y="4" width="4" height="16" rx="2" fill="currentColor" />
      </>
    ) : (
      <polygon points="5,3 19,12 5,21" fill="currentColor" />
    )}
  </svg>
);

/* ----------------------- Types ----------------------- */
type ReelsCardProps = {
  src: string;
  isVideo?: boolean;
  poster?: string;
  initialLikes?: number;
  initialViews?: number;
  caption?: string;
  author?: string;
  isActive?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
};

/* ----------------------- Component ----------------------- */
export default function ReelsCard({
  src,
  isVideo = false,
  poster,
  initialLikes = 0,
  initialViews = 0,
  caption = "",
  author = "Unknown",
  isActive = false,
  onNext,
  onPrev,
}: ReelsCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [likeState, setLikeState] = useState<{ liked: boolean; likes: number }>(
    {
      liked: false,
      likes: initialLikes,
    },
  );
  const [views, setViews] = useState<number>(initialViews);
  const [showBigHeart, setShowBigHeart] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const touchStartY = useRef<number | null>(null);
  const lastTap = useRef<number>(0);
  const likeThrottleRef = useRef<boolean>(false);

  /* Sync video element state to our isPlaying state */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  /* When parent says this card is active, start playing (if video) */
  useEffect(() => {
    if (videoRef.current && isVideo) {
      videoRef.current.muted = muted;
      if (isActive) {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, isVideo, muted]);

  /* Keep isPlaying in sync when isActive toggles too */
  useEffect(() => {
    if (isActive && isVideo) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [isActive, isVideo]);

  useEffect(() => {
    if (!hasViewed) {
      setViews((p) => p + 1);
      setHasViewed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleLike = () => {
    if (likeThrottleRef.current) return;
    likeThrottleRef.current = true;
    setTimeout(() => (likeThrottleRef.current = false), 300);

    setLikeState((prev) => {
      const newLiked = !prev.liked;
      return {
        liked: newLiked,
        likes: prev.likes + (prev.liked ? -1 : 1),
      };
    });
  };

  const togglePlayPause = useCallback(
    (e?: React.SyntheticEvent) => {
      if (
        e &&
        typeof (e as React.SyntheticEvent).stopPropagation === "function"
      ) {
        (e as React.SyntheticEvent).stopPropagation();
      }

      if (!isVideo) return;

      const v = videoRef.current;
      if (!v) return;

      if (!v.paused && !v.ended) {
        v.pause();
      } else {
        v.play().catch(() => {});
      }
    },
    [isVideo],
  );

  const handleTap = () => {
    const now = Date.now();
    const timeDiff = now - lastTap.current;

    if (timeDiff < 300 && lastTap.current > 0) {
      // Double tap - show big heart and like
      setShowBigHeart(true);
      setLikeState((prev) =>
        prev.liked ? prev : { liked: true, likes: prev.likes + 1 },
      );
      // auto-hide big heart
      setTimeout(() => setShowBigHeart(false), 900);
      lastTap.current = 0;
    } else {
      // Single tap detection fallback
      setTimeout(() => {
        const currentTime = Date.now();
        if (currentTime - now >= 300) {
          if (isVideo) togglePlayPause();
        }
      }, 300);
      lastTap.current = now;
    }
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: caption || "Share",
          url: shareUrl,
        });
      } catch (error) {
        console.log("Share failed:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (error) {
        console.log("Copy failed:", error);
      }
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const endY = e.changedTouches[0].clientY;
    const delta = endY - touchStartY.current;
    touchStartY.current = null;
    if (delta < -80) {
      onNext?.();
    }
    if (delta > 80) {
      onPrev?.();
    }
  };

  /* Keyboard controls */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        onPrev?.();
      }
      if (e.key === "ArrowDown") {
        onNext?.();
      }
      if (e.key === " ") {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onNext, onPrev, togglePlayPause]);

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-3xl text-white shadow-2xl"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* MEDIA */}
      {isVideo ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          loop
          playsInline
          preload="metadata"
          onClick={(e) => {
            e.stopPropagation();
            togglePlayPause();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            handleTap();
          }}
          className="absolute inset-0 h-full w-full object-contain shadow-2xl lg:rounded-3xl"
        />
      ) : (
        <div
          onClick={() => togglePlayPause()}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative h-full w-full">
            <Image
              src={src}
              alt={caption || "media"}
              fill
              sizes="(min-width:1024px) 500px, 100vw"
              // optional: use priority when active to preload the visible image
              priority={isActive}
              className="object-contain shadow-2xl lg:rounded-3xl"
            />
          </div>
        </div>
      )}

      {/* Static overlays (no animated gradients) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/20" />

      {/* Big Heart (animated with framer-motion) */}
      <AnimatePresence>
        {showBigHeart && (
          <motion.div
            key="big-heart"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
          >
            <div className="relative">
              <HeartIcon size={140} filled={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Controls */}
      <div className="absolute top-6 right-4 left-4 z-20 flex items-center justify-between md:right-6 md:left-6">
        <div className="flex gap-3">
          <button
            onClick={() => {
              setMuted((m) => !m);
              if (videoRef.current)
                videoRef.current.muted = !videoRef.current.muted;
            }}
            className="group relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/50 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-white/50 hover:bg-black/70"
            aria-label="toggle mute"
          >
            <div className="absolute inset-0 rounded-full bg-white/10" />
            <VolumeIcon muted={muted} size={22} />
            <div className="absolute inset-0 rounded-full border-2 border-transparent" />
          </button>

          <div className="flex items-center gap-3 rounded-full border border-white/30 bg-black/50 px-4 py-2 text-sm font-semibold shadow-xl backdrop-blur-md">
            <div className="relative">
              <EyeIcon size={18} />
              <div className="absolute -inset-1 rounded-full bg-transparent" />
            </div>
            <span className="font-bold tracking-wide text-white">
              {formatNumber(views)}
            </span>
          </div>
        </div>

        {/* Play/Pause Button */}
        {isVideo && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            className="group relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-black/60 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-cyan-300/70 hover:bg-black/80"
            aria-label={isPlaying ? "pause" : "play"}
          >
            <div className="absolute inset-0 rounded-full bg-transparent" />
            <PlayPauseIcon isPlaying={isPlaying} size={26} />
            <div className="absolute inset-0 rounded-full border-2 border-transparent" />
          </button>
        )}
      </div>

      {/* Action Column */}
      <div className="absolute bottom-8 left-4 z-20 flex flex-col items-center gap-5 md:left-6">
        <button
          onClick={toggleLike}
          className="group relative flex flex-col items-center gap-2"
          aria-label="like"
        >
          <div
            className={`relative flex h-16 w-16 items-center justify-center rounded-full border-2 shadow-2xl backdrop-blur-md transition-all duration-500 ${
              likeState.liked
                ? "border-red-400/60 bg-red-600/20"
                : "border-white/30 bg-black/40 hover:border-white/50 hover:bg-black/60"
            }`}
          >
            <div className="absolute inset-0 rounded-full bg-white/10" />

            {/* animated small pulse when liked */}
            <motion.div
              key={`heart-pulse-${likeState.likes}`} // re-run animation when likes count changes
              animate={likeState.liked ? { scale: [1, 1.18, 1] } : { scale: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <HeartIcon size={32} filled={likeState.liked} />
            </motion.div>
          </div>

          <span className="text-sm font-bold tracking-wide drop-shadow-lg">
            {formatNumber(likeState.likes)}
          </span>
        </button>

        <button
          onClick={handleShare}
          className="group relative flex flex-col items-center gap-2"
          aria-label="share"
        >
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/30 bg-black/40 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-cyan-400/60 hover:bg-black/60">
            <div className="absolute inset-0 rounded-full bg-white/10" />
            <ShareIcon size={28} />
            <div className="absolute inset-0 rounded-full border border-transparent" />
          </div>
          <span className="text-sm font-bold tracking-wide drop-shadow-lg">
            Share
          </span>

          {/* static copied toast */}
          {copied && (
            <div className="absolute -top-20 rounded-xl border border-green-400/50 bg-green-600 px-4 py-2 text-xs font-bold text-white shadow-2xl">
              <div className="flex items-center gap-2">
                <span>✓</span>
                Link Copied!
              </div>
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 transform bg-green-600" />
            </div>
          )}
        </button>
      </div>

      {/* Description Section (static) */}
      {(caption || author) && (
        <div className="absolute right-4 bottom-8 z-20 max-w-xs md:right-6">
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-5">
            <div className="relative">
              {author && (
                <div className="mb-3 flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700/40 text-lg font-bold text-white shadow-lg">
                      {author.charAt(0).toUpperCase()}
                      <div className="absolute inset-0 rounded-full border-2 border-transparent" />
                    </div>
                  </div>
                  <div>
                    <span className="block text-lg font-bold tracking-wide text-white drop-shadow-lg">
                      {author}
                    </span>
                    <span className="text-xs font-medium text-white/70">
                      Content Creator
                    </span>
                  </div>
                </div>
              )}

              {caption && (
                <div>
                  <p className="text-sm leading-relaxed font-medium text-white/95">
                    {caption}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
