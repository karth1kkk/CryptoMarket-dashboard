"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

const DEBOUNCE_MS = 320;

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramQ = searchParams.get("q") ?? "";
  const isHome = pathname === "/";
  const [value, setValue] = useState(paramQ);

  useEffect(() => {
    startTransition(() => {
      setValue(paramQ);
    });
  }, [paramQ]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (isHome) {
        const v = value.trim();
        if (v === (paramQ ?? "")) return;
        router.replace(v ? `/?q=${encodeURIComponent(v)}` : "/", {
          scroll: false,
        });
        return;
      }
      if (value.trim().length > 0) {
        router.replace(`/?q=${encodeURIComponent(value.trim())}`, {
          scroll: false,
        });
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [value, isHome, paramQ, router]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-4 px-4 md:px-5">
        <Link
          href="/"
          className="shrink-0 text-sm font-semibold tracking-tight text-slate-100 transition hover:text-white"
        >
          <span className="font-mono text-[15px]">CM</span>
          <span className="ml-1.5 hidden text-slate-400 sm:inline">Terminal</span>
        </Link>

        <div className="mx-auto min-w-0 max-w-md flex-1 md:max-w-lg">
          <label htmlFor="global-search" className="sr-only">
            Search market by name or symbol
          </label>
          <input
            id="global-search"
            type="search"
            autoComplete="off"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search by name or symbol…"
            className="w-full rounded-md border border-slate-700/90 bg-slate-900/80 py-2 pl-3 pr-3 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            aria-label="Search market by name or symbol"
          />
        </div>

        <div className="hidden w-8 shrink-0 sm:block" aria-hidden />
      </div>
    </header>
  );
}
