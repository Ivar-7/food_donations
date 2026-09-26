import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, CalendarDays, Mail, MapPin } from "lucide-react";
import { useAuth } from "../../../app/authContext";
import {
  ApplicationConflictError,
  reviewOrganizationApplication,
} from "../api/organizations.api";
import { organizationsKeys } from "../state/organizations.keys";
import { usePendingApplications } from "../state/useOrganizations";
import { toAppError } from "../../../shared/errors/appError";
import {
  EmptyState,
  Notice,
  PageHeader,
  primaryClass,
  secondaryClass,
} from "../../../shared/ui/Elements";

export default function AdminApplicationsPage() {
  const { user, profile, profileLoading } = useAuth();
  const isAdmin = profile?.role === "admin";
  const applications = usePendingApplications(isAdmin);
  const client = useQueryClient();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function review(
    applicationId: string,
    decision: "approved" | "rejected",
  ) {
    if (!user || !isAdmin) return;
    setBusyId(applicationId);
    setError("");
    setSuccess("");
    try {
      await reviewOrganizationApplication(applicationId, user.uid, decision);
      await Promise.all([
        client.invalidateQueries({
          queryKey: organizationsKeys.pendingApplications,
        }),
        client.invalidateQueries({ queryKey: organizationsKeys.all }),
      ]);
      setSuccess(`Application ${decision}.`);
    } catch (cause) {
      setError(
        cause instanceof ApplicationConflictError
          ? cause.message
          : toAppError(cause).message,
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="w-full px-4 py-12 sm:px-8 lg:px-12 lg:py-16 2xl:px-20">
      <PageHeader
        eyebrow="Partner administration"
        title="Organization applications"
        description="Review shelters and NGOs waiting to join the Okoa Food community."
      />
      {error && (
        <div className="mb-6">
          <Notice error>{error}</Notice>
        </div>
      )}
      {success && (
        <div className="mb-6">
          <Notice>{success}</Notice>
        </div>
      )}
      {profileLoading ? (
        <p role="status">Checking administrator access…</p>
      ) : !isAdmin ? (
        <Notice error>
          Only administrators can review organization applications.
        </Notice>
      ) : applications.isPending ? (
        <p role="status">Loading pending applications…</p>
      ) : applications.error ? (
        <Notice error>{toAppError(applications.error).message}</Notice>
      ) : applications.data?.length ? (
        <div className="space-y-6">
          <div className="border-b border-stone-200 pb-4 text-sm font-semibold text-stone-600 dark:border-stone-800 dark:text-stone-400">
            {applications.data.length} pending{" "}
            {applications.data.length === 1 ? "application" : "applications"}
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            {applications.data.map((item) => (
              <article
                key={item.id}
                className="flex flex-col border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
              >
                <div className="flex-1 p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex size-12 items-center justify-center rounded-full bg-forest-100 text-forest-700 dark:bg-forest-900 dark:text-forest-100">
                      <Building2 size={23} aria-hidden="true" />
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-900 dark:text-amber-100">
                      Pending review
                    </span>
                  </div>
                  <p className="mt-6 text-xs font-bold uppercase tracking-widest text-forest-700 dark:text-forest-400">
                    {item.type}
                  </p>
                  <h2 className="mt-1 font-display text-2xl sm:text-3xl">
                    {item.name}
                  </h2>
                  <p className="mt-4 leading-relaxed text-stone-600 dark:text-stone-400">
                    {item.description}
                  </p>
                  <div className="mt-6 grid gap-3 border-t border-stone-200 pt-6 text-sm text-stone-600 dark:border-stone-800 dark:text-stone-400 sm:grid-cols-2">
                    <p className="flex min-w-0 items-center gap-2">
                      <MapPin
                        size={16}
                        className="shrink-0"
                        aria-hidden="true"
                      />
                      {item.location}
                    </p>
                    <p className="flex min-w-0 items-center gap-2 break-all">
                      <Mail size={16} className="shrink-0" aria-hidden="true" />
                      {item.contactEmail}
                    </p>
                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} aria-hidden="true" />
                      Applied {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 border-t border-stone-200 bg-stone-50 p-5 dark:border-stone-800 dark:bg-stone-950 sm:flex-row sm:justify-end sm:p-6">
                  <button
                    type="button"
                    disabled={busyId !== null}
                    onClick={() => void review(item.id, "rejected")}
                    className={secondaryClass}
                  >
                    {busyId === item.id ? "Saving…" : "Decline"}
                  </button>
                  <button
                    type="button"
                    disabled={busyId !== null}
                    onClick={() => void review(item.id, "approved")}
                    className={primaryClass}
                  >
                    {busyId === item.id ? "Saving…" : "Approve partner"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          title="All caught up"
          description="New organization applications will appear here for review."
        />
      )}
    </div>
  );
}
