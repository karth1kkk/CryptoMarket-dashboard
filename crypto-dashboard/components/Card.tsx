import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article";
  "aria-label"?: string;
};

export function Card({
  children,
  className = "",
  as: Tag = "div",
  "aria-label": ariaLabel,
}: CardProps) {
  return (
    <Tag
      className={`rounded-xl border border-slate-200/90 bg-white shadow-sm shadow-slate-200/40 dark:border-slate-800/80 dark:bg-[#131c2a] dark:shadow-sm dark:shadow-black/20 ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-b border-slate-200/80 px-4 py-2.5 text-sm font-medium text-slate-700 dark:border-slate-700/60 dark:text-slate-200 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
