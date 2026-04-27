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
      className={`rounded-lg border border-slate-700/80 bg-slate-800/80 shadow-sm shadow-black/20 ${className}`}
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
      className={`border-b border-slate-700/60 px-4 py-3 text-sm font-medium text-slate-200 ${className}`}
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
