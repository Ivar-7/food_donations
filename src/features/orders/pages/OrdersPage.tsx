import { ArrowUpRight, PackageCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../app/authContext";
import { toAppError } from "../../../shared/errors/appError";
import { EmptyState, Notice, PageHeader } from "../../../shared/ui/Elements";
import { useMyOrders } from "../state/useOrders";
import type { Order } from "../order.types";

function OrderList({ title, items }: { title: string; items: Order[] }) {
  return (
    <section>
      <h2 className="mb-4 font-display text-2xl">{title}</h2>
      {items.length ? (
        <div className="space-y-3">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/orders/${item.id}`}
              className="flex items-center justify-between gap-4 border border-stone-200 bg-white p-5 transition-colors hover:border-forest-500 dark:border-stone-800 dark:bg-stone-900"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">{item.donationTitle}</p>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                  {item.organizationName} ·{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="rounded-full bg-forest-100 px-3 py-1 text-xs font-semibold capitalize text-forest-800 dark:bg-forest-900 dark:text-forest-100">
                  {item.status}
                </span>
                <ArrowUpRight
                  size={17}
                  className="text-forest-700 dark:text-forest-500"
                  aria-hidden="true"
                />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="border border-stone-200 bg-white p-6 text-sm text-stone-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400">
          Nothing here yet.
        </p>
      )}
    </section>
  );
}

export default function OrdersPage() {
  const { user } = useAuth();
  const { data, isPending, error } = useMyOrders(user?.uid);
  return (
    <div className="w-full px-4 py-12 sm:px-8 lg:px-12 lg:py-16 2xl:px-20">
      <PageHeader
        eyebrow="Handoffs"
        title="Your requests"
        description="Follow each donation from request through pickup and receipt."
      />
      {isPending ? (
        <p role="status">Loading requests…</p>
      ) : error ? (
        <Notice error>{toAppError(error).message}</Notice>
      ) : data?.length ? (
        <div className="grid gap-10 xl:grid-cols-2">
          <OrderList
            title="Donations you shared"
            items={data.filter((item) => item.donorId === user?.uid)}
          />
          <OrderList
            title="Requests for your organization"
            items={data.filter((item) => item.requestedBy === user?.uid)}
          />
        </div>
      ) : (
        <EmptyState
          title="No requests yet"
          description="When an approved organization requests a donation, you will see the handoff here."
          action="Explore donations"
          href="/donations"
        />
      )}
      <div className="mt-10 flex items-center gap-3 border-t border-stone-200 pt-6 text-sm text-stone-500 dark:border-stone-800 dark:text-stone-400">
        <PackageCheck size={18} aria-hidden="true" /> Every request has a pickup
        reference for the handoff.
      </div>
    </div>
  );
}
