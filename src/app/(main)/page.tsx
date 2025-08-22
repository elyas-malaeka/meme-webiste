// app/page.tsx  (or wherever your page component lives)
import Image from "next/image";
import prisma from "@/lib/db"; // adjust path if needed
import type { Link } from "@prisma/client";

function chunkArray<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

function isTailwindBgClass(s: string | null | undefined) {
  if (!s) return false;
  // simple heuristic: user might store tailwind utility classes like "bg-gradient-to-r from-... to-..."
  return (
    s.includes("bg-") ||
    s.includes("from-") ||
    s.includes("to-") ||
    s.includes("gradient-to")
  );
}

export default async function Home() {
  // fetch links from your DB
  const links: Link[] = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  });

  // chunk into groups of 6 (matches the positionClasses array size in your original code)
  const groups = chunkArray(links, 6);

  return (
    <div>
      <div className="Banner">
        <div className="banner-image overflow-hidden rounded-2xl drop-shadow-xl">
          <Image
            src="/banner/shia-meme-banner.jpg"
            alt="شیعه میم"
            width={1200}
            height={400}
            priority
            quality={100}
            className="h-auto w-full object-contain"
          />
        </div>
      </div>

      <div dir="ltr" className="Links mt-6 max-lg:mb-28 md:mt-8">
        {groups.map((group, gIdx) => (
          <div
            key={gIdx}
            className="mb-4 grid gap-4 md:mb-6 md:gap-6 lg:grid-cols-2"
          >
            {group.map((link, i) => {
              const base =
                "Link-Item w-full flex min-h-[120px] gap-6 lg:items-center lg:flex-row flex-col justify-between rounded-3xl p-4 sm:p-6 lg:p-8 lg:py-10";
              const positionClasses =
                [
                  "max-lg:col-span-2 max-lg:row-span-1", // 1 -> 2/3
                  "max-lg:col-span-1 max-lg:row-span-1", // 2 -> 1/3
                  "max-lg:col-span-3 max-lg:row-span-1 max-lg:flex-row items-center ", // 3 -> full width
                  "max-lg:col-span-2 max-lg:row-span-2", // 4 -> 2/3 and spans 2 rows
                  "max-lg:col-span-1 max-lg:row-span-1", // 5 -> 1/3 top-right
                  "max-lg:col-span-1 max-lg:row-span-1", // 6 -> 1/3 below the 5th
                ][i] ?? "";

              // decide whether backgroundCss from DB is a tailwind class or a raw CSS value
              const dbBg = (link?.backgroundCss || "").trim();
              const useTailwindBg = isTailwindBgClass(dbBg);
              const inlineStyle: React.CSSProperties = {};
              const bgClass = useTailwindBg ? dbBg : "";

              if (!useTailwindBg && dbBg) {
                // if not tailwind, treat it as a CSS background (e.g. "linear-gradient(...)" or "#123456")
                inlineStyle.background = dbBg;
              }

              // text color: prefer inline style (safe)
              const textStyle: React.CSSProperties = {};
              if (link?.textColor) textStyle.color = link.textColor;

              const logoSrc = link.logoUrl || "/logo/default.png";

              return (
                <a
                  key={link.id}
                  href={link.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${base} ${positionClasses} ${bgClass}`}
                  style={inlineStyle}
                >
                  <div className="image-icon h-16 w-16 flex-shrink-0 md:h-20 md:w-20">
                    <Image
                      src={`/logo/Links/${logoSrc}`}
                      alt={link.label || "Link Icon"}
                      width={96}
                      height={96}
                      className="h-full w-full object-contain"
                      // If logoSrc are external, consider configuring next.config.js domains or use `unoptimized`
                      unoptimized={false}
                    />
                  </div>

                  <div className="flex flex-col gap-2 text-right">
                    <span
                      className="truncate leading-tight font-semibold text-white sm:text-2xl"
                      style={textStyle}
                    >
                      {link.label || "Untitled Link"}
                    </span>
                    <span
                      className="text-xl font-normal text-white"
                      style={textStyle}
                    >
                      {link.username || "No Username"}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
