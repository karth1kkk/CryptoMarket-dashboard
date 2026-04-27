"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Market" },
  { href: "/watchlist", label: "Watch" },
  { href: "/portfolio", label: "Port." },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex border-b border-slate-800 bg-slate-950/80 md:hidden"
      aria-label="Primary"
    >
      {links.map(({ href, label }) => {
        const active =
          href === "/"
            ? pathname === "/"
            : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={`min-h-[44px] flex-1 py-2.5 text-center text-xs font-medium transition-colors ${
              active
                ? "border-b-2 border-slate-200 text-slate-100"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
