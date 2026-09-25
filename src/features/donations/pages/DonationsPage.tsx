import { useState } from "react";
import { Link } from "react-router-dom";
import DonationCard from "../components/DonationCard";
import { useAvailableDonations } from "../state/useDonations";
import { firebaseConfigured } from "../../../shared/firebase/client";
import {
  EmptyState,
  PageHeader,
  primaryClass,
  Notice,
} from "../../../shared/ui/Elements";
import { toAppError } from "../../../shared/errors/appError";

export default function DonationsPage() {
  const [category, setCategory] = useState<"All" | "Food" | "Essentials">(
    "All",
  );
  const { data, isPending, error, refetch } = useAvailableDonations();
  const visible =
    data?.filter((item) => category === "All" || item.category === category) ??
    [];
  return (
    <div className="w-full px-4 py-12 sm:px-8 lg:px-12 lg:py-16 2xl:px-20">
      <PageHeader
        eyebrow="Community listings"
        title="Available donations"
        description="Find food and useful supplies shared nearby. Approved organizations can request a listing and coordinate collection."
        action={
          <Link className={primaryClass} to="/donations/new">
            Post a donation
          </Link>
        }
      />
      <div
        className="mb-7 flex gap-2"
        role="group"
        aria-label="Filter donations"
      >
        {(["All", "Food", "Essentials"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setCategory(value)}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${category === value ? "bg-forest-700 text-white" : "border border-stone-200 bg-white text-stone-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"}`}
          >
            {value}
          </button>
        ))}
      </div>
      {!firebaseConfigured ? (
        <Notice error>
          Firebase is not configured. Copy .env.example to .env and restart the
          dev server.
        </Notice>
      ) : isPending ? (
        <div
          role="status"
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-80 bg-stone-200 motion-safe:animate-pulse dark:bg-stone-800"
            />
          ))}
          <span className="sr-only">Loading donations</span>
        </div>
      ) : error ? (
        <div className="space-y-4">
          <Notice error>{toAppError(error).message}</Notice>
          <button
            type="button"
            onClick={() => void refetch()}
            className="text-sm font-bold text-forest-700 underline dark:text-forest-500"
          >
            Try again
          </button>
        </div>
      ) : visible.length ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visible.map((item) => (
            <DonationCard key={item.id} donation={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            data?.length
              ? "No matches in this category"
              : "No donations here yet"
          }
          description={
            data?.length
              ? "Try another category to see more listings."
              : "As neighbors share food and supplies, their listings will appear here."
          }
          action={data?.length ? undefined : "Post the first donation"}
          href={data?.length ? undefined : "/donations/new"}
        />
      )}
    </div>
  );
}
