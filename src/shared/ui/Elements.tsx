import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export const fieldClass =
  "w-full rounded-lg border border-stone-300 bg-white px-4 py-3.5 text-base text-stone-900 placeholder:text-stone-400 focus:border-forest-600 focus:ring-2 focus:ring-forest-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:focus:ring-forest-900";
export const primaryClass =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-forest-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-forest-500 dark:text-forest-950 dark:hover:bg-forest-100";
export const secondaryClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-stone-300 bg-transparent px-6 py-3.5 text-sm font-semibold text-stone-800 transition-colors hover:bg-stone-100 dark:border-stone-600 dark:text-stone-100 dark:hover:bg-stone-800";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-5 border-b border-stone-200 pb-8 sm:flex-row sm:items-end sm:justify-between dark:border-stone-800">
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-forest-600 dark:text-forest-500">
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-stone-600 dark:text-stone-400">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  href,
}: {
  title: string;
  description: string;
  action?: string;
  href?: string;
}) {
  return (
    <div className="border border-stone-200 bg-white px-6 py-12 text-center dark:border-stone-800 dark:bg-stone-900 sm:px-10">
      <div
        className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-forest-100 text-xl text-forest-700 dark:bg-forest-900 dark:text-forest-100"
        aria-hidden="true"
      >
        ✳
      </div>
      <h2 className="font-display text-2xl">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-stone-600 dark:text-stone-400">
        {description}
      </p>
      {action && href && (
        <Link className={`${primaryClass} mt-5`} to={href}>
          {action}
        </Link>
      )}
    </div>
  );
}

export function Notice({
  children,
  error = false,
}: {
  children: ReactNode;
  error?: boolean;
}) {
  return (
    <p
      role={error ? "alert" : "status"}
      className={`rounded-lg border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200" : "border-forest-100 bg-forest-50 text-forest-800 dark:border-forest-700 dark:bg-forest-900 dark:text-forest-100"}`}
    >
      {children}
    </p>
  );
}
