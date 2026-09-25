import type { Donation } from "../donation.types";
import { Carrot, MapPin, Package } from "lucide-react";

export default function DonationCard({ donation }: { donation: Donation }) {
  return (
    <article className="flex h-full flex-col overflow-hidden border border-stone-200 bg-white transition-shadow hover:shadow-lg dark:border-stone-800 dark:bg-stone-900">
      <div
        className={`flex h-36 items-center justify-between px-6 ${donation.category === "Food" ? "bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100" : "bg-forest-50 text-forest-800 dark:bg-forest-900 dark:text-forest-100"}`}
        aria-hidden="true"
      >
        <span className="font-display text-3xl">
          {donation.category === "Food" ? "Good food" : "Essentials"}
        </span>
        {donation.category === "Food" ? (
          <Carrot size={48} strokeWidth={1.3} />
        ) : (
          <Package size={48} strokeWidth={1.3} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-forest-100 px-3 py-1 text-xs font-bold text-forest-700 dark:bg-forest-900 dark:text-forest-100">
            {donation.category}
          </span>
          <span className="text-xs text-stone-500">
            {new Date(donation.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h3 className="mt-4 font-display text-2xl">{donation.title}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-stone-600 dark:text-stone-400">
          {donation.description}
        </p>
        <div className="mt-5 border-t border-stone-100 pt-4 text-sm text-stone-600 dark:border-stone-800 dark:text-stone-300">
          <p className="flex items-center gap-2">
            <MapPin size={16} aria-hidden="true" /> {donation.location}
          </p>
          <p className="mt-2 flex items-center gap-2">
            <Package size={16} aria-hidden="true" /> {donation.quantity}
          </p>
        </div>
      </div>
    </article>
  );
}
