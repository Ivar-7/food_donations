import { ArrowUpRight, Bell, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../app/authContext";
import { toAppError } from "../../../shared/errors/appError";
import { Notice, secondaryClass } from "../../../shared/ui/Elements";
import {
  notificationLink,
  notificationText,
} from "../../notifications/notification.schema";
import { useNotifications } from "../../notifications/state/useNotifications";
import { useMyOrders } from "../../orders/state/useOrders";

export default function DashboardActivity() {
  const { user } = useAuth();
  const orders = useMyOrders(user?.uid);
  const notifications = useNotifications(user?.uid);
  const actions =
    orders.data?.filter(
      (item) =>
        (item.donorId === user?.uid && item.status === "requested") ||
        (item.requestedBy === user?.uid && item.status === "pickup"),
    ) ?? [];
  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl">Your next steps</h2>
        <Clock3 size={20} className="text-pink-600 dark:text-pink-300" />
      </div>
      {orders.isPending ? (
        <p role="status" className="mt-5 text-sm">
          Loading requests…
        </p>
      ) : orders.error ? (
        <div className="mt-5">
          <Notice error>{toAppError(orders.error).message}</Notice>
        </div>
      ) : actions.length ? (
        <div className="mt-5 space-y-3">
          {actions.slice(0, 3).map((item) => (
            <Link
              key={item.id}
              to={`/orders/${item.id}`}
              className="block rounded-2xl bg-pink-50 p-4 dark:bg-pink-950/50"
            >
              <p className="text-sm font-semibold">{item.donationTitle}</p>
              <p className="mt-1 text-xs text-stone-600 dark:text-stone-300">
                {item.status === "requested"
                  ? "Coordinate pickup and confirm the handoff"
                  : "Confirm your organization received these items"}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
          You’re all caught up. New requests that need your attention will
          appear here.
        </p>
      )}
      <Link to="/orders" className={`${secondaryClass} mt-5`}>
        View all requests
        <ArrowUpRight size={15} />
      </Link>
      <div className="mt-7 border-t border-stone-200 pt-6 dark:border-stone-800">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl">Recent activity</h3>
          <Bell size={19} className="text-pink-600 dark:text-pink-300" />
        </div>
        {notifications.isPending ? (
          <p role="status" className="mt-4 text-sm">
            Loading activity…
          </p>
        ) : notifications.error ? (
          <div className="mt-4">
            <Notice error>{toAppError(notifications.error).message}</Notice>
          </div>
        ) : notifications.data?.length ? (
          <ul className="mt-4 space-y-4">
            {notifications.data.slice(0, 4).map((item) => (
              <li key={item.id}>
                <Link
                  to={notificationLink(item)}
                  className="block rounded-xl p-2 hover:bg-pink-50 dark:hover:bg-pink-950"
                >
                  <p className="text-sm font-semibold">
                    {notificationText(item)}
                  </p>
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">
            As you share and support others, your updates will appear here.
          </p>
        )}
        <Link
          to="/notifications"
          className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-pink-700 dark:text-pink-300"
        >
          All updates
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  );
}
