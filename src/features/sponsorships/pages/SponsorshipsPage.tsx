import { useState } from "react";
import { ArrowUpRight, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../app/authContext";
import { toAppError } from "../../../shared/errors/appError";
import {
  EmptyState,
  Notice,
  PageHeader,
  primaryClass,
} from "../../../shared/ui/Elements";
import { useSponsorships } from "../state/useSponsorships";

export default function SponsorshipsPage() {
  const { profile } = useAuth();
  const { data, isPending, error } = useSponsorships();
  const [filter, setFilter] = useState<"open" | "all">("open");
  const visible =
    data?.filter((item) => filter === "all" || item.status === "open") ?? [];

  return (
    <div className="w-full px-4 py-12 sm:px-8 lg:px-12 lg:py-16 2xl:px-20">
      <PageHeader
        eyebrow="In-kind support"
        title="Community needs"
        description="Approved organizations share specific needs. Pledge items you can provide and help them reach their target."
        action={
          profile?.organizationId ? (
            <Link to="/sponsorships/new" className={primaryClass}>
              Post a need <ArrowUpRight size={16} />
            </Link>
          ) : undefined
        }
      />
      <div className="mb-8 flex gap-2" role="group" aria-label="Filter needs">
        <button
          type="button"
          onClick={() => setFilter("open")}
          className={`rounded-full px-5 py-2 text-sm font-semibold ${filter === "open" ? "bg-forest-700 text-white" : "border border-stone-300 text-stone-600 dark:border-stone-700 dark:text-stone-300"}`}
        >
          Open needs
        </button>
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-5 py-2 text-sm font-semibold ${filter === "all" ? "bg-forest-700 text-white" : "border border-stone-300 text-stone-600 dark:border-stone-700 dark:text-stone-300"}`}
        >
          All needs
        </button>
      </div>
      {isPending ? (
        <p role="status">Loading community needs…</p>
      ) : error ? (
        <Notice error>{toAppError(error).message}</Notice>
      ) : visible.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visible.map((item) => (
            <Link
              key={item.id}
              to={`/sponsorships/${item.id}`}
              className="flex h-full flex-col border border-stone-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-stone-800 dark:bg-stone-900"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-12 items-center justify-center rounded-full bg-forest-100 text-forest-700 dark:bg-forest-900 dark:text-forest-100">
                  <HeartHandshake size={22} strokeWidth={1.7} />
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "open" ? "bg-forest-100 text-forest-800 dark:bg-forest-900 dark:text-forest-100" : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300"}`}
                >
                  {item.status === "open" ? "Open" : "Fulfilled"}
                </span>
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-widest text-forest-600 dark:text-forest-500">
                {item.organizationName}
              </p>
              <h2 className="mt-2 font-display text-2xl">{item.title}</h2>
              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                {item.description}
              </p>
              <div className="mt-6 border-t border-stone-200 pt-4 text-sm font-semibold dark:border-stone-800">
                {item.pledgedQuantity} of {item.targetQuantity} {item.unit}{" "}
                pledged
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-forest-700 dark:text-forest-500">
                View need <ArrowUpRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            filter === "open"
              ? "No open needs right now"
              : "No needs have been posted yet"
          }
          description="When organizations post an in-kind need, it will appear here."
          action="Explore organizations"
          href="/organizations"
        />
      )}
    </div>
  );
}
