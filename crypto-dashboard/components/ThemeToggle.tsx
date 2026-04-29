"use client";

import { useTheme } from "next-themes";
import { startTransition, useEffect, useState } from "react";

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-[18px] w-[18px]"
      aria-hidden
    >
      <path d="M12 2.25a0.75 0.75 0 0 1 0.75 0.75v2.25a0.75 0.75 0 0 1-1.5 0V3a0.75 0.75 0 0 1 0.75-0.75ZM7.5 12a4.5 4.5 0 1 1 9 0a4.5 4.5 0 0 1-9 0ZM18.75 8.25a0.75 0.75 0 0 0-1.06-1.06l-1.72 1.72a0.75 0.75 0 1 0 1.06 1.06l1.72-1.72ZM19.5 12a0.75 0.75 0 0 0-0.75-0.75h-2.25a0.75 0.75 0 0 0 0 1.5h2.25A0.75 0.75 0 0 0 19.5 12ZM17.19 16.19a0.75 0.75 0 0 0 1.06 0l1.72-1.72a0.75 0.75 0 1 0-1.06-1.06l-1.72 1.72a0.75 0.75 0 0 0 0 1.06ZM12 18.75a0.75 0.75 0 0 0-0.75 0.75V21a0.75 0.75 0 0 0 1.5 0v-1.5a0.75 0.75 0 0 0-0.75-0.75ZM4.5 12a0.75 0.75 0 0 0 0.75 0.75H7.5a0.75 0.75 0 0 0 0-1.5H5.25A0.75 0.75 0 0 0 4.5 12ZM6.31 5.31a0.75 0.75 0 0 0-1.06 1.06l1.72 1.72a0.75 0.75 0 0 0 1.06-1.06L6.31 5.31Z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-[18px] w-[18px]"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return (
      <div
        className="h-9 w-9 shrink-0 rounded-lg border border-slate-200/90 bg-slate-100/80 dark:border-slate-600 dark:bg-slate-800/80"
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200/90 bg-white text-amber-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800/90 dark:text-amber-200/90 dark:shadow-none dark:hover:border-slate-500 dark:hover:bg-slate-700/80"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
