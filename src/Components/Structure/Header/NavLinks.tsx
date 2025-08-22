"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { GoHomeFill } from "react-icons/go";
import { BsImageFill } from "react-icons/bs";
import { HiSquares2X2 } from "react-icons/hi2";
import { FaPenSquare } from "react-icons/fa";

// Persian navigation labels with updated icon sizes
export const navLinks = [
  {
    href: "/",
    label: "صفحه اصلی",
    icon: <GoHomeFill size={30} />,
  },
  {
    href: "/gallery",
    label: "گالری آثار",
    icon: <BsImageFill size={30} />,
  },
  {
    href: "/reels",
    label: "حلقه فیلم",
    icon: <HiSquares2X2 size={30} />,
  },
  {
    href: "/about-us",
    label: "درباره ما",
    icon: <FaPenSquare size={30} />,
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      <ul className="nav-links space-y-2 max-lg:hidden">
        {navLinks.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                title={label}
                href={href}
                className={[
                  "flex items-center gap-4 rounded-xl p-3 text-xl",
                  !isActive
                    ? "text-light-dark hover:text-accent hover:bg-primary-40"
                    : "text-accent bg-primary-40",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {icon}
                <span className="font-semibold">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mobile-nav-links z-50 mx-auto mb-4 max-w-lg rounded-full bg-white p-2 shadow-2xl sm:p-3 lg:hidden">
        <ul className="flex items-center justify-between sm:gap-4">
          {navLinks.map(({ href, label, icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    "flex items-center gap-2 rounded-full p-3",
                    !isActive
                      ? "text-light-dark hover:text-accent hover:bg-primary-40"
                      : "text-accent bg-primary-40",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {icon}
                  {isActive && (
                    <span className="text-base font-semibold max-[374px]:hidden">
                      {label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
