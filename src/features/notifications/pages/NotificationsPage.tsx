import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, Check, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../app/authContext";
import { toAppError } from "../../../shared/errors/appError";
import { EmptyState, Notice, PageHeader } from "../../../shared/ui/Elements";
import { markNotificationRead } from "../api/notifications.api";
import { notificationLink, notificationText } from "../notification.schema";
import { notificationsKeys } from "../state/notifications.keys";
import { useNotifications } from "../state/useNotifications";

export default function NotificationsPage() {
  const { user } = useAuth();
  const { data, isPending, error } = useNotifications(user?.uid);
  const client = useQueryClient();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const visible =
    data?.filter((item) => filter === "all" || item.readAt === null) ?? [];

  async function markRead(id: string) {
    setPendingId(id);
    setActionError("");
    try {
      await markNotificationRead(id);
      await client.invalidateQueries({ queryKey: notificationsKeys.all });
    } catch (cause) {
      setActionError(toAppError(cause).message);
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="w-full px-4 py-12 sm:px-8 lg:px-12 lg:py-16 2xl:px-20">
      <PageHeader
        eyebrow="Updates"
        title="Notifications"
        description="The latest activity on your applications, requests, and pledges."
      />
      <div
        className="mb-7 flex gap-2"
        role="group"
        aria-label="Filter notifications"
      >
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-5 py-2 text-sm font-semibold ${filter === "all" ? "bg-pink-700 text-white" : "border border-stone-300 text-stone-600 dark:border-stone-700 dark:text-stone-300"}`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={`rounded-full px-5 py-2 text-sm font-semibold ${filter === "unread" ? "bg-pink-700 text-white" : "border border-stone-300 text-stone-600 dark:border-stone-700 dark:text-stone-300"}`}
        >
          Unread
        </button>
      </div>
      {actionError && (
        <div className="mb-5">
          <Notice error>{actionError}</Notice>
        </div>
      )}
      {isPending ? (
        <p role="status">Loading notifications…</p>
      ) : error ? (
        <Notice error>{toAppError(error).message}</Notice>
      ) : visible.length ? (
        <div className="max-w-4xl space-y-3">
          {visible.map((item) => (
            <article
              key={item.id}
              className={`flex flex-col gap-4 border p-5 sm:flex-row sm:items-center sm:justify-between ${item.readAt === null ? "border-pink-200 bg-pink-50 dark:border-pink-800 dark:bg-pink-900" : "border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"}`}
            >
              <div className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-pink-700 dark:bg-stone-800 dark:text-pink-100">
                  <Bell size={18} />
                </span>
                <div>
                  <p className="font-semibold">{notificationText(item)}</p>
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-4 pl-14 sm:pl-0">
                <Link
                  to={notificationLink(item)}
                  className="inline-flex items-center gap-1 text-sm font-bold text-pink-700 dark:text-pink-300"
                >
                  View <ArrowUpRight size={15} />
                </Link>
                {item.readAt === null && (
                  <button
                    type="button"
                    disabled={pendingId === item.id}
                    onClick={() => void markRead(item.id)}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-stone-600 hover:text-pink-700 disabled:opacity-50 dark:text-stone-300 dark:hover:text-pink-500"
                  >
                    <Check size={15} />{" "}
                    {pendingId === item.id ? "Saving…" : "Mark read"}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            filter === "unread"
              ? "You're all caught up"
              : "No notifications yet"
          }
          description="Updates about your community activity will appear here."
          action="View dashboard"
          href="/dashboard"
        />
      )}
    </div>
  );
}
