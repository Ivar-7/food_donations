import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MapPin,
  Package,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../app/authContext";
import RequestDonationButton from "../../orders/components/RequestDonationButton";
import { firebaseConfigured } from "../../../shared/firebase/client";
import { toAppError } from "../../../shared/errors/appError";
import {
  EmptyState,
  Notice,
  primaryClass,
  secondaryClass,
} from "../../../shared/ui/Elements";
import { deleteDonation } from "../api/donations.api";
import { donationsKeys } from "../state/donations.keys";
import { useDonation } from "../state/useDonations";

const statusText = {
  available: "Available",
  requested: "Requested",
  pickup: "Pickup in progress",
  received: "Received",
};

export default function DonationDetailPage() {
  const { donationId } = useParams();
  const { user } = useAuth();
  const { data: donation, isPending, error } = useDonation(donationId);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const client = useQueryClient();
  const success = (location.state as { success?: string } | null)?.success;
  const isOwner = Boolean(user && donation?.donorId === user.uid);
  const editable = isOwner && donation?.status === "available";

  async function remove() {
    if (!user || !donation) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteDonation(donation.id, user.uid);
      client.removeQueries({ queryKey: donationsKeys.detail(donation.id) });
      await client.invalidateQueries({ queryKey: donationsKeys.all });
      navigate("/dashboard", {
        state: { success: "Your donation was removed." },
      });
    } catch (cause) {
      setDeleteError(toAppError(cause).message);
      setConfirmDelete(false);
      await client.invalidateQueries({
        queryKey: donationsKeys.detail(donation.id),
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="w-full px-4 py-10 sm:px-8 lg:px-12 lg:py-14 2xl:px-20">
      <Link
        to="/donations"
        className="mb-9 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-forest-700 dark:text-stone-300 dark:hover:text-forest-400"
      >
        <ArrowLeft size={16} aria-hidden="true" /> All donations
      </Link>
      {!firebaseConfigured ? (
        <Notice error>
          Firebase is not configured. Add the public settings to .env.
        </Notice>
      ) : isPending ? (
        <div
          role="status"
          className="grid gap-8 motion-safe:animate-pulse lg:grid-cols-12"
        >
          <div className="h-96 bg-stone-200 dark:bg-stone-800 lg:col-span-8" />
          <div className="h-64 bg-stone-200 dark:bg-stone-800 lg:col-span-4" />
          <span className="sr-only">Loading donation</span>
        </div>
      ) : error ? (
        <Notice error>{toAppError(error).message}</Notice>
      ) : !donation ? (
        <EmptyState
          title="Donation not found"
          description="This listing may have been removed. Explore what is currently available."
          action="Explore donations"
          href="/donations"
        />
      ) : (
        <>
          {success && (
            <div className="mb-7">
              <Notice>{success}</Notice>
            </div>
          )}
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <article className="lg:col-span-8">
              {donation.imageUrl && (
                <img
                  src={donation.imageUrl}
                  alt={`${donation.title} donation`}
                  className="mb-8 max-h-96 w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="border-b border-stone-200 pb-8 dark:border-stone-800">
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-forest-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-forest-700 dark:bg-forest-900 dark:text-forest-100">
                    {donation.category}
                  </span>
                  {donation.donorId === "foodbridge-seed-donor" && (
                    <span className="rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-amber-900 dark:bg-amber-950 dark:text-amber-100">
                      Sample listing
                    </span>
                  )}
                  <span className="rounded-full border border-stone-300 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-stone-600 dark:border-stone-700 dark:text-stone-300">
                    {statusText[donation.status]}
                  </span>
                </div>
                <h1 className="font-display text-5xl leading-tight tracking-tight sm:text-6xl xl:text-7xl">
                  {donation.title}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">
                  {donation.description}
                </p>
              </div>
              <div className="grid gap-6 border-b border-stone-200 py-8 sm:grid-cols-2 dark:border-stone-800">
                <div className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-700 dark:bg-forest-900 dark:text-forest-100">
                    <Package size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
                      Quantity
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {donation.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-700 dark:bg-forest-900 dark:text-forest-100">
                    <MapPin size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
                      Pickup area
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {donation.location}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-3 py-7 text-sm text-stone-500 dark:text-stone-400">
                <span className="inline-flex items-center gap-2">
                  <UserRound size={17} aria-hidden="true" /> Shared by{" "}
                  {donation.donorName}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={17} aria-hidden="true" />{" "}
                  {new Date(donation.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </article>
            <aside className="lg:col-span-4">
              <div className="border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-forest-600 dark:text-forest-500">
                  Next step
                </p>
                <h2 className="mt-3 font-display text-2xl sm:text-3xl">
                  {donation.status === "available"
                    ? "Ready to be shared"
                    : "On its way"}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                  {donation.status === "available"
                    ? "An approved organization can request this donation and arrange collection with the donor."
                    : "This donation has been requested. Follow its handoff from the order page."}
                </p>
                {isOwner && donation.orderId && (
                  <Link
                    className={`${primaryClass} mt-6 w-full`}
                    to={`/orders/${donation.orderId}`}
                  >
                    View order <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                )}
                {editable && (
                  <div className="mt-6 flex flex-col gap-3">
                    <Link
                      className={secondaryClass}
                      to={`/donations/${donation.id}/edit`}
                    >
                      <Pencil size={16} aria-hidden="true" /> Edit listing
                    </Link>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-6 py-3.5 text-sm font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
                    >
                      <Trash2 size={16} aria-hidden="true" /> Remove listing
                    </button>
                  </div>
                )}
                {isOwner &&
                  donation.status !== "available" &&
                  !donation.orderId && (
                    <p className="mt-5 text-sm text-stone-500 dark:text-stone-400">
                      This listing can no longer be edited.
                    </p>
                  )}
                {donation.status === "available" && (
                  <div className="mt-6 border-t border-stone-200 pt-6 dark:border-stone-800">
                    <RequestDonationButton donation={donation} />
                  </div>
                )}
              </div>
              {deleteError && (
                <div className="mt-4">
                  <Notice error>{deleteError}</Notice>
                </div>
              )}
              {confirmDelete && (
                <div className="mt-4 border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950">
                  <p className="font-semibold text-red-900 dark:text-red-100">
                    Remove this listing?
                  </p>
                  <p className="mt-2 text-sm text-red-800 dark:text-red-200">
                    People will no longer be able to find it.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={() => void remove()}
                      className="rounded-lg bg-red-700 px-5 py-3 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50"
                    >
                      {deleting ? "Removing…" : "Yes, remove it"}
                    </button>
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={() => setConfirmDelete(false)}
                      className="rounded-lg px-5 py-3 text-sm font-semibold text-red-800 dark:text-red-200"
                    >
                      Keep listing
                    </button>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
