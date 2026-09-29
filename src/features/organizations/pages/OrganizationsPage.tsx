import { Link } from "react-router-dom";
import { Building2, MapPin } from "lucide-react";
import { useOrganizations } from "../state/useOrganizations";
import { firebaseConfigured } from "../../../shared/firebase/client";
import { toAppError } from "../../../shared/errors/appError";
import {
  EmptyState,
  Notice,
  PageHeader,
  primaryClass,
} from "../../../shared/ui/Elements";

export default function OrganizationsPage() {
  const { data, isPending, error } = useOrganizations();
  return (
    <div className="w-full px-4 py-12 sm:px-8 lg:px-12 lg:py-16 2xl:px-20">
      <PageHeader
        eyebrow="Our community partners"
        title="Organizations"
        description="Meet shelters, community kitchens and NGOs working to put shared resources to good use."
        action={
          <Link to="/organizations/apply" className={primaryClass}>
            Register your organization
          </Link>
        }
      />
      {!firebaseConfigured ? (
        <Notice error>
          Firebase is not configured. Copy .env.example to .env and restart the
          dev server.
        </Notice>
      ) : isPending ? (
        <p role="status">Loading organizations…</p>
      ) : error ? (
        <Notice error>{toAppError(error).message}</Notice>
      ) : data?.length ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {data.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-3xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={`${item.name} community work`}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="p-7">
                {!item.imageUrl && (
                  <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-100">
                    <Building2 size={26} strokeWidth={1.6} aria-hidden="true" />
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-pink-600 dark:text-pink-300">
                    {item.type}
                  </span>
                </div>
                <h2 className="mt-2 font-display text-2xl">{item.name}</h2>
                <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
                  {item.description}
                </p>
                <p className="mt-5 flex items-center gap-2 text-sm font-medium text-stone-500 dark:text-stone-400">
                  <MapPin size={16} aria-hidden="true" /> {item.location}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No organizations listed yet"
          description="Approved shelters and NGOs will appear here. If you represent one, apply to join."
          action="Apply now"
          href="/organizations/apply"
        />
      )}
    </div>
  );
}
