import { ArrowRight, ArrowUpRight, Heart, Leaf, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import communityTable from "../../../assets/community-table.webp";
import { useAvailableDonations } from "../../donations/state/useDonations";
import DonationCard from "../../donations/components/DonationCard";
import { firebaseConfigured } from "../../../shared/firebase/client";
import { toAppError } from "../../../shared/errors/appError";
import {
  EmptyState,
  Notice,
  primaryClass,
  secondaryClass,
} from "../../../shared/ui/Elements";

const steps = [
  {
    number: "01",
    title: "Share what you have",
    description:
      "List good food or useful essentials with a pickup area and the details people need.",
  },
  {
    number: "02",
    title: "Make it discoverable",
    description:
      "Your listing becomes visible to local community members and organizations.",
  },
  {
    number: "03",
    title: "Keep good things moving",
    description:
      "Help valuable resources stay in use and support the places doing good work nearby.",
  },
];

export default function HomePage() {
  const { data, isPending, error } = useAvailableDonations();

  return (
    <>
      <section className="bg-stone-100 dark:bg-forest-950">
        <div className="grid min-h-screen lg:min-h-0 lg:grid-cols-12">
          <div className="flex flex-col justify-center px-4 pb-14 pt-16 sm:px-8 sm:py-20 lg:col-span-5 lg:px-12 lg:py-28 2xl:px-20">
            <div className="mb-8 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-forest-700 dark:text-forest-500">
              <span className="h-px w-8 bg-forest-700 dark:bg-forest-500" />
              Good food deserves a second table
            </div>
            <h1 className="max-w-2xl font-display text-5xl leading-none tracking-tight text-forest-950 dark:text-stone-50 sm:text-6xl xl:text-7xl 2xl:text-8xl">
              More to share.
              <br />
              <span className="italic text-forest-600 dark:text-forest-500">
                Less to waste.
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-stone-600 dark:text-stone-300 sm:text-lg">
              Bring your surplus food and essentials to a community that can use
              them. FoodBridge makes it simple to share what you have and
              discover what is nearby.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/donations/new" className={primaryClass}>
                Share a donation <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
              <Link to="/donations" className={secondaryClass}>
                Explore donations <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-stone-300 pt-6 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
              <span className="flex items-center gap-2">
                <Leaf size={16} className="text-forest-600" /> Less waste
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-forest-600" /> Local sharing
              </span>
              <span className="flex items-center gap-2">
                <Heart size={16} className="text-forest-600" /> More care
              </span>
            </div>
          </div>
          <div className="relative min-h-80 overflow-hidden sm:min-h-96 lg:col-span-7 lg:min-h-screen">
            <img
              src={communityTable}
              alt="Neighbors sharing a bag of fresh food at a community table"
              className="absolute inset-0 h-full w-full object-cover object-center"
              fetchPriority="high"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-950/80 to-transparent px-6 pb-7 pt-24 text-white sm:px-10">
              <p className="text-xs font-bold uppercase tracking-widest text-white/80">
                A better path for what we have
              </p>
              <p className="mt-2 max-w-md font-display text-2xl sm:text-3xl">
                From one table to another.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-10 border-b border-stone-200 px-4 py-20 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-12 lg:py-28 2xl:px-20 dark:border-stone-800">
        <div className="lg:col-span-5">
          <p className="text-xs font-bold uppercase tracking-widest text-forest-600 dark:text-forest-500">
            The idea is simple
          </p>
          <h2 className="mt-5 max-w-xl font-display text-4xl leading-tight tracking-tight sm:text-5xl xl:text-6xl">
            Sharing starts with what is already here.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-stone-600 dark:text-stone-400">
            A spare box of produce. Extra pantry staples. Useful supplies. Small
            contributions can go further when neighbors know where to find them.
          </p>
          <Link
            to="/about"
            className="mt-7 inline-flex items-center gap-2 border-b border-forest-700 pb-1 text-sm font-bold text-forest-700 dark:border-forest-500 dark:text-forest-500"
          >
            How FoodBridge works <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="lg:col-span-7">
          {steps.map((step) => (
            <div
              key={step.number}
              className="grid gap-4 border-t border-stone-200 py-6 sm:grid-cols-12 sm:gap-8 dark:border-stone-800"
            >
              <span className="text-sm font-bold text-forest-600 dark:text-forest-500 sm:col-span-2">
                {step.number}
              </span>
              <div className="sm:col-span-10">
                <h3 className="font-display text-2xl tracking-tight sm:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xl leading-relaxed text-stone-600 dark:text-stone-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-8 lg:px-12 lg:py-28 2xl:px-20 dark:bg-stone-900">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-forest-600 dark:text-forest-500">
              Community board
            </p>
            <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
              Recently shared
            </h2>
            <p className="mt-3 text-stone-600 dark:text-stone-400">
              See what neighbors have made available.
            </p>
          </div>
          <Link
            to="/donations"
            className="inline-flex items-center gap-2 text-sm font-bold text-forest-700 dark:text-forest-500"
          >
            View all donations <ArrowUpRight size={17} />
          </Link>
        </div>
        {!firebaseConfigured ? (
          <Notice error>
            Firebase is not configured. Add the public configuration to .env to
            load listings.
          </Notice>
        ) : isPending ? (
          <div
            role="status"
            className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse bg-stone-100 dark:bg-stone-800"
              />
            ))}
            <span className="sr-only">Loading donations</span>
          </div>
        ) : error ? (
          <Notice error>{toAppError(error).message}</Notice>
        ) : data?.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {data.slice(0, 3).map((item) => (
              <DonationCard key={item.id} donation={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="The board is ready for its first listing"
            description="Share something useful and help this community get started."
            action="Post a donation"
            href="/donations/new"
          />
        )}
      </section>

      <section className="bg-forest-800 px-4 py-16 text-white sm:px-8 lg:px-12 lg:py-20 2xl:px-20 dark:bg-forest-900">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-forest-100">
              Bring something to the table
            </p>
            <h2 className="mt-4 max-w-4xl font-display text-4xl leading-tight sm:text-5xl xl:text-6xl">
              A little shared can mean a lot.
            </h2>
          </div>
          <Link
            to="/signup"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-bold text-forest-800 transition-colors hover:bg-forest-50 dark:bg-forest-100"
          >
            Get started <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
