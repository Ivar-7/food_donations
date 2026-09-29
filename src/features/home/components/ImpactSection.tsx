import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { firebaseConfigured } from "../../../shared/firebase/client";
import { toAppError } from "../../../shared/errors/appError";
import { Notice } from "../../../shared/ui/Elements";
import { useImpact } from "../state/useImpact";

export default function ImpactSection() {
  const { data, isPending, error, refetch } = useImpact();
  const totals = data
    ? [
        { value: data.availableDonations, label: "Available to collect" },
        { value: data.completedHandoffs, label: "Handoffs completed" },
        { value: data.partnerOrganizations, label: "Approved partners" },
      ]
    : [];

  return (
    <section className="border-y border-stone-200 bg-pink-50 px-4 py-16 sm:px-8 lg:px-12 lg:py-20 2xl:px-20 dark:border-pink-800 dark:bg-pink-900">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p className="text-xs font-bold uppercase tracking-widest text-pink-700 dark:text-pink-300">
            The community in motion
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            Sharing adds up.
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-stone-600 dark:text-stone-300">
            A live look at what is available, what has reached a new home, and
            the partners helping it happen.
          </p>
          <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">
            Totals reflect the listings and handoffs recorded on Okoa Food.
          </p>
        </div>
        <div className="lg:col-span-8">
          {!firebaseConfigured ? (
            <Notice error>
              Firebase is not configured. Impact totals are unavailable.
            </Notice>
          ) : isPending ? (
            <div role="status" className="grid gap-6 sm:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="space-y-4 border-t border-pink-200 pt-5 dark:border-pink-700"
                >
                  <div className="h-14 w-24 bg-pink-100 motion-safe:animate-pulse dark:bg-pink-800" />
                  <div className="h-4 w-36 bg-pink-100 motion-safe:animate-pulse dark:bg-pink-800" />
                </div>
              ))}
              <span className="sr-only">Loading impact totals</span>
            </div>
          ) : error ? (
            <div className="space-y-3">
              <Notice error>{toAppError(error).message}</Notice>
              <button
                type="button"
                onClick={() => void refetch()}
                className="text-sm font-bold text-pink-700 underline dark:text-pink-300"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <dl className="grid gap-7 sm:grid-cols-3">
                {totals.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col border-t border-pink-200 pt-5 dark:border-pink-700"
                  >
                    <dt className="order-2 mt-4 text-sm font-semibold text-stone-600 dark:text-stone-300">
                      {item.label}
                    </dt>
                    <dd className="order-1 font-display text-5xl leading-none text-pink-950 dark:text-stone-50 sm:text-6xl">
                      {item.value.toLocaleString()}
                    </dd>
                  </div>
                ))}
              </dl>
              {totals.every((item) => item.value === 0) && (
                <p className="mt-8 text-sm text-stone-600 dark:text-stone-300">
                  The first shared listing starts here.{" "}
                  <Link
                    to="/donations/new"
                    className="inline-flex items-center gap-1 font-bold text-pink-700 underline dark:text-pink-300"
                  >
                    Share something useful{" "}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
