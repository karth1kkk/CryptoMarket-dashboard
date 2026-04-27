import { Suspense, type ReactNode } from "react";
import { MobileNav } from "./MobileNav";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

function NavFallback() {
  return (
    <div
      className="h-14 border-b border-slate-800 bg-slate-950/90"
      aria-hidden
    />
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Suspense fallback={<NavFallback />}>
        <Navbar />
      </Suspense>
      <MobileNav />
      <div className="mx-auto flex max-w-[1600px] min-w-0">
        <Sidebar />
        <div className="min-w-0 flex-1 overflow-x-hidden px-4 py-4 md:px-5 md:py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
