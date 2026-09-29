import {
  ArrowUpRight,
  Bell,
  Gift,
  HandHeart,
  HeartHandshake,
  PackageCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { Donation } from "../../donations/donation.types";
import type { Order } from "../../orders/order.types";
import type { Notification } from "../../notifications/notification.types";
import { primaryClass, secondaryClass } from "../../../shared/ui/Elements";

export default function DashboardOverview({
  donations,
  orders,
  notifications,
  organizationId,
  loading,
  failed,
}: {
  donations: Donation[];
  orders: Order[];
  notifications: Notification[];
  organizationId?: string;
  loading: boolean;
  failed: boolean;
}) {
  const stats = [
    {
      label: "Donations shared",
      value: donations.length,
      icon: Gift,
      href: "#your-donations",
      detail: "Food & essentials",
    },
    {
      label: "Active requests",
      value: orders.filter((item) => item.status !== "received").length,
      icon: HeartHandshake,
      href: "/orders",
      detail: "Keep kindness moving",
    },
    {
      label: "Completed handoffs",
      value: orders.filter((item) => item.status === "received").length,
      icon: PackageCheck,
      href: "/orders",
      detail: "Shared with care",
    },
    {
      label: "Unread updates",
      value: notifications.filter((item) => item.readAt === null).length,
      icon: Bell,
      href: "/notifications",
      detail: "Your community activity",
    },
  ];
  return (
    <>
      <div
        className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-busy={loading}
      >
        {stats.map(({ label, value, icon: Icon, href, detail }) => (
          <Link
            key={label}
            to={href}
            className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300">
                <Icon size={21} aria-hidden="true" />
              </span>
              <ArrowUpRight
                size={16}
                className="text-stone-400"
                aria-hidden="true"
              />
            </div>
            <p className="mt-5 text-4xl font-bold tracking-tight">
              {loading ? "…" : failed ? "—" : value}
            </p>
            <p className="mt-2 text-sm font-semibold">{label}</p>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
              {detail}
            </p>
          </Link>
        ))}
      </div>
      <section className="mb-8 flex flex-col gap-6 rounded-3xl bg-pink-100/70 p-6 dark:bg-pink-900/30 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <span className="hidden size-14 shrink-0 items-center justify-center rounded-full bg-white text-pink-600 dark:bg-pink-950 dark:text-pink-300 sm:flex">
            <HandHeart size={28} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-pink-700 dark:text-pink-300">
              A little kindness, a big difference
            </p>
            <h2 className="mt-2 font-display text-3xl">
              What will you share today?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              Share a meal, support a community need or help your organization
              find useful supplies. Your next small step starts here.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link to="/donations/new" className={primaryClass}>
            Share a donation
            <ArrowUpRight size={16} />
          </Link>
          <Link
            to={organizationId ? "/sponsorships/new" : "/sponsorships"}
            className={secondaryClass}
          >
            {organizationId ? "Post a need" : "Support a need"}
          </Link>
        </div>
      </section>
    </>
  );
}
