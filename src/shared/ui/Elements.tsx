import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export const fieldClass =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3.5 text-base text-stone-900 placeholder:text-stone-400 focus:border-pink-600 focus:ring-2 focus:ring-pink-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:focus:ring-pink-900";
export const primaryClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-pink-700 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-pink-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-pink-300 dark:text-pink-950 dark:hover:bg-pink-200";
export const secondaryClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-pink-200 bg-white px-6 py-3.5 text-sm font-semibold text-pink-800 transition-colors hover:bg-pink-50 dark:border-pink-800 dark:bg-stone-900 dark:text-pink-200 dark:hover:bg-pink-950";

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
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-pink-600 dark:text-pink-300">
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
    <div className="rounded-3xl border border-stone-200 bg-white px-6 py-12 text-center dark:border-stone-800 dark:bg-stone-900 sm:px-10">
      <div
        className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-pink-100 text-xl text-pink-700 dark:bg-pink-900 dark:text-pink-100"
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
      className={`rounded-2xl border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200" : "border-pink-100 bg-pink-50 text-pink-800 dark:border-pink-700 dark:bg-pink-900 dark:text-pink-100"}`}
    >
      {children}
    </p>
  );
}
