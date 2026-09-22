"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useCallback, useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const DEBOUNCE_MS = 320;

const PRIMARY_NAV = [
  { href: "/", label: "Market" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/portfolio", label: "Portfolio" },
] as const;

export const AUTH_CHANGED_EVENT = "krypt:auth-changed";

function readUserEmail(): string | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("krypt:user");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { email?: string };
    return parsed.email ?? null;
  } catch {
    return null;
  }
}

function useIsActive(href: string) {
  const pathname = usePathname();
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavPill({ href, label }: { href: string; label: string }) {
  const active = useIsActive(href);
  return (
    <Link
      href={href}
      className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3 ${
        active
          ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200"
          : "text-slate-600 hover:bg-slate-100/90 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-100"
      }`}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramQ = searchParams.get("q") ?? "";
  const isHome = pathname === "/";
  const [value, setValue] = useState(paramQ);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Re-read auth state whenever it might change
  const syncUser = useCallback(() => {
    setUserEmail(readUserEmail());
  }, []);

  useEffect(() => {
    syncUser();
  }, [syncUser]);

  // React to auth changes from the same tab
  useEffect(() => {
    const onAuthChanged = () => syncUser();
    window.addEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
    // React to auth changes from other tabs
    window.addEventListener("storage", onAuthChanged);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
      window.removeEventListener("storage", onAuthChanged);
    };
  }, [syncUser]);

  // Fallback: re-check on every route change (covers redirect-after-login)
  useEffect(() => {
    syncUser();
  }, [pathname, syncUser]);

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

  const onLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("krypt:token");
      localStorage.removeItem("krypt:user");
      window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    }
    setUserEmail(null);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-sm shadow-slate-200/30 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#0d1119]/95 dark:shadow-none">
      <div className="mx-auto max-w-[1600px] px-3 sm:px-4 md:px-5">
        <div className="flex min-h-[52px] items-center gap-2 py-1.5 sm:min-h-14 sm:gap-3 sm:py-0">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2"
            aria-label="Krypt Home"
          >
            <Image
              src="/favicon.svg"
              alt=""
              width={28}
              height={28}
              unoptimized
              className="h-7 w-7 shrink-0 rounded-md object-cover shadow-sm"
              priority
            />
            <span className="text-[15px] font-semibold tracking-tight text-slate-800 dark:text-slate-100">
              Krypt
            </span>
          </Link>

          <nav
            className="hidden shrink-0 items-center gap-0.5 md:flex"
            aria-label="Primary"
          >
            {PRIMARY_NAV.map(({ href, label }) => (
              <NavPill key={href} href={href} label={label} />
            ))}
          </nav>

          <div className="min-w-0 max-w-md flex-1 md:max-w-xl md:pl-1 lg:pl-2">
            <label htmlFor="global-search" className="sr-only">
              Search
            </label>
            <input
              id="global-search"
              type="search"
              autoComplete="off"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search"
              className="w-full rounded-lg border border-slate-200/90 bg-slate-100/90 py-1.5 pl-2.5 pr-2.5 text-sm text-slate-800 ring-emerald-500/20 transition placeholder:text-slate-400 focus:border-emerald-500/50 focus:bg-white focus:outline-none focus:ring-2 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500/40 dark:focus:bg-slate-900 sm:pl-3 sm:pr-3"
              aria-label="Search coins by name or symbol"
            />
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {userEmail ? (
              <>
                <span className="hidden max-w-[180px] truncate text-xs text-slate-500 dark:text-slate-400 sm:inline">
                  {userEmail}
                </span>
                <button
                  type="button"
                  onClick={onLogout}
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Login
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>

        <nav
          className="flex border-t border-slate-200/80 py-0.5 dark:border-slate-800/80 md:hidden"
          aria-label="Primary"
        >
          {PRIMARY_NAV.map(({ href, label }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`min-h-[40px] flex-1 py-2 text-center text-xs font-medium transition-colors ${
                  active
                    ? "border-b-2 border-emerald-600 text-slate-900 dark:border-emerald-500 dark:text-slate-100"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}