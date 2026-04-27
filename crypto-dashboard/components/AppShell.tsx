import { Suspense, type ReactNode } from "react";
import { Navbar } from "./Navbar";

function NavFallback() {
  return (
    <div
      className="min-h-14 border-b border-slate-200/90 bg-white dark:border-slate-800/90 dark:bg-[#0d1119]/95"
      aria-hidden
    />
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <Suspense fallback={<NavFallback />}>
        <Navbar />
      </Suspense>
      <div className="mx-auto w-full max-w-[1600px] min-w-0 flex-1 overflow-x-hidden px-3 py-4 sm:px-4 md:px-6 md:py-5">
        {children}
      </div>
    </div>
  );
}
