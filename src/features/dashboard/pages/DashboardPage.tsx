import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, UserRound } from "lucide-react";
import { useAuth } from "../../../app/authContext";
import {
  useAvailableDonations,
  useMyDonations,
} from "../../donations/state/useDonations";
import { useMyApplications } from "../../organizations/state/useOrganizations";
import { useMyOrders } from "../../orders/state/useOrders";
import { useMySponsorships } from "../../sponsorships/state/useSponsorships";
import {
  EmptyState,
  Notice,
  PageHeader,
  primaryClass,
  secondaryClass,
} from "../../../shared/ui/Elements";
import { toAppError } from "../../../shared/errors/appError";
import { useNotifications } from "../../notifications/state/useNotifications";
import DonationCard from "../../donations/components/DonationCard";
import DashboardOverview from "../components/DashboardOverview";
import DashboardActivity from "../components/DashboardActivity";

export default function DashboardPage() {
  const { user, profile, profileLoading, profileError } = useAuth();
  const location = useLocation();
  const success = (location.state as { success?: string } | null)?.success;
  const donations = useMyDonations(user?.uid);
  const applications = useMyApplications(user?.uid);
  const orders = useMyOrders(user?.uid);
  const sponsorships = useMySponsorships(user?.uid);
  const available = useAvailableDonations();
  const notifications = useNotifications(user?.uid);
  return (
    <div className="w-full px-4 py-12 sm:px-8 lg:px-12 lg:py-16 2xl:px-20">
      <PageHeader
        eyebrow="Your kindness, in motion"
        title={`Welcome${profile?.username ? `, ${profile.username}` : ""}.`}
        description="Manage what you've shared, follow requests, and keep up with your community activity."
        action={
          <Link to="/donations/new" className={primaryClass}>
            Post a donation
          </Link>
        }
      />
      {success && (
        <div className="mb-6">
          <Notice>{success}</Notice>
        </div>
      )}
      {!profileLoading && !profile && (
        <div className="mb-6">
          <Notice error>
            {profileError ??
              "Your profile needs attention. Add a display name to finish setting it up."}{" "}
            <Link to="/profile" className="font-bold underline">
              Open profile
            </Link>
          </Notice>
        </div>
      )}
      <DashboardOverview
        donations={donations.data ?? []}
        orders={orders.data ?? []}
        notifications={notifications.data ?? []}
        organizationId={profile?.organizationId}
        loading={
          donations.isPending || orders.isPending || notifications.isPending
        }
        failed={Boolean(donations.error || orders.error || notifications.error)}
      />
      <div className="grid gap-7 lg:grid-cols-12">
        <section id="your-donations" className="space-y-8 lg:col-span-8">
          <div>
            <h2 className="mb-4 font-display text-2xl">Your donations</h2>
            {donations.isPending ? (
              <p>Loading your donations…</p>
            ) : donations.error ? (
              <Notice error>{toAppError(donations.error).message}</Notice>
            ) : donations.data?.length ? (
              <div className="space-y-3">
                {donations.data.map((item) => (
                  <Link
                    key={item.id}
                    to={`/donations/${item.id}`}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900"
                  >
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                        {item.quantity} · {item.location}
                      </p>
                    </div>
                    <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold capitalize text-pink-700 dark:bg-pink-900 dark:text-pink-100">
                      {item.status}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nothing shared yet"
                description="Your posted donations will appear here."
                action="Post a donation"
                href="/donations/new"
              />
            )}
          </div>
          <div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl">Around your community</h2>
              <Link
                to="/donations"
                className="inline-flex items-center gap-1 text-sm font-bold text-pink-700 dark:text-pink-300"
              >
                Explore all
                <ArrowUpRight size={16} />
              </Link>
            </div>
            {available.isPending ? (
              <p role="status">Loading nearby donations…</p>
            ) : available.error ? (
              <Notice error>{toAppError(available.error).message}</Notice>
            ) : available.data?.length ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {available.data
                  .filter((item) => item.donorId !== user?.uid)
                  .slice(0, 2)
                  .map((item) => (
                    <DonationCard key={item.id} donation={item} />
                  ))}
                {available.data.every((item) => item.donorId === user?.uid) && (
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    You’ve shared all the current listings. More community
                    donations will appear here soon.
                  </p>
                )}
              </div>
            ) : (
              <EmptyState
                title="Be the start of something kind"
                description="New food and supplies will appear here as your neighbors share."
                action="Share a donation"
                href="/donations/new"
              />
            )}
          </div>
        </section>
        <section className="lg:col-span-4">
          <DashboardActivity />
          <h2 className="mb-4 mt-7 font-display text-2xl">Quick links</h2>
          <div className="mb-7 rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
            {orders.isPending ? (
              <p
                role="status"
                className="text-sm text-stone-500 dark:text-stone-400"
              >
                Loading requests…
              </p>
            ) : orders.error ? (
              <Notice error>{toAppError(orders.error).message}</Notice>
            ) : (
              <p className="text-sm text-stone-600 dark:text-stone-300">
                {orders.data?.length ?? 0} donation{" "}
                {orders.data?.length === 1 ? "request" : "requests"}
              </p>
            )}
            <Link
              to="/orders"
              className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-pink-700 dark:text-pink-300"
            >
              View donation requests <ArrowUpRight size={16} />
            </Link>
            {profile?.organizationId && (
              <div className="mt-5 border-t border-stone-200 pt-5 dark:border-stone-800">
                {sponsorships.isPending ? (
                  <p
                    role="status"
                    className="text-sm text-stone-500 dark:text-stone-400"
                  >
                    Loading community needs…
                  </p>
                ) : sponsorships.error ? (
                  <Notice error>
                    {toAppError(sponsorships.error).message}
                  </Notice>
                ) : (
                  <p className="text-sm text-stone-600 dark:text-stone-300">
                    {sponsorships.data?.length ?? 0} posted community{" "}
                    {sponsorships.data?.length === 1 ? "need" : "needs"}
                  </p>
                )}
                <Link
                  to="/sponsorships/new"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-pink-700 dark:text-pink-300"
                >
                  Post a community need <ArrowUpRight size={16} />
                </Link>
              </div>
            )}
            {profile?.role === "admin" && (
              <Link
                to="/admin/applications"
                className="mt-5 inline-flex items-center gap-1 border-t border-stone-200 pt-5 text-sm font-bold text-pink-700 dark:border-stone-800 dark:text-pink-300"
              >
                Review applications <ArrowUpRight size={16} />
              </Link>
            )}
          </div>
          <h2 className="mb-4 font-display text-2xl">Your account</h2>
          <div className="mb-7 rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
            <div className="flex size-10 items-center justify-center rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-100">
              <UserRound size={20} />
            </div>
            <p className="mt-4 font-semibold">
              {profile?.username ?? "Your profile"}
            </p>
            <p className="mt-1 break-all text-sm text-stone-500 dark:text-stone-400">
              {user?.email}
            </p>
            <Link
              to="/profile"
              className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-pink-700 dark:text-pink-300"
            >
              View and edit profile <ArrowUpRight size={16} />
            </Link>
          </div>
          <h2 className="mb-4 font-display text-2xl">Organization</h2>
          <div className="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
            {profile?.organizationId ? (
              <>
                <p className="font-semibold">Approved partner</p>
                <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                  Your account is linked to an organization.
                </p>
                <Link
                  to="/sponsorships/new"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-pink-700 dark:text-pink-300"
                >
                  Post a need <ArrowUpRight size={16} />
                </Link>
              </>
            ) : applications.isPending ? (
              <p className="text-sm">Loading applications…</p>
            ) : applications.error ? (
              <Notice error>{toAppError(applications.error).message}</Notice>
            ) : applications.data?.length ? (
              <>
                <p className="font-semibold">{applications.data[0].name}</p>
                <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                  Application status:{" "}
                  <span className="font-semibold capitalize">
                    {applications.data[0].status}
                  </span>
                </p>
                <Link
                  to="/organizations/apply"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-pink-700 dark:text-pink-300"
                >
                  View application <ArrowUpRight size={16} />
                </Link>
              </>
            ) : (
              <>
                <p className="font-semibold">Represent a shelter or NGO?</p>
                <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                  Apply to join Okoa Food and make your organization visible to
                  donors.
                </p>
                <Link
                  to="/organizations/apply"
                  className={`${secondaryClass} mt-5`}
                >
                  Apply to join
                </Link>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
