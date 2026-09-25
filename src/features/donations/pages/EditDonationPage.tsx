import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../app/authContext";
import { firebaseConfigured } from "../../../shared/firebase/client";
import { toAppError } from "../../../shared/errors/appError";
import { EmptyState, Notice, PageHeader } from "../../../shared/ui/Elements";
import { updateDonation } from "../api/donations.api";
import DonationForm from "../components/DonationForm";
import type { DonationFormValues } from "../donation.types";
import { donationsKeys } from "../state/donations.keys";
import { useDonation } from "../state/useDonations";

export default function EditDonationPage() {
  const { donationId } = useParams();
  const { user } = useAuth();
  const { data: donation, isPending, error } = useDonation(donationId);
  const client = useQueryClient();
  const navigate = useNavigate();

  async function submit(values: DonationFormValues) {
    if (!user || !donation) throw new Error("Donation is unavailable.");
    await updateDonation(donation.id, user.uid, values);
    await client.invalidateQueries({ queryKey: donationsKeys.all });
    navigate(`/donations/${donation.id}`, {
      state: { success: "Your donation details were updated." },
    });
  }

  return (
    <div className="w-full px-4 py-12 sm:px-8 lg:px-12 lg:py-16 2xl:px-20">
      <Link
        to={donation ? `/donations/${donation.id}` : "/dashboard"}
        className="mb-9 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-forest-700 dark:text-stone-300 dark:hover:text-forest-400"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to listing
      </Link>
      <PageHeader
        eyebrow="Your listing"
        title="Edit donation"
        description="Keep the details accurate so an organization knows what to expect."
      />
      {!firebaseConfigured ? (
        <Notice error>
          Firebase is not configured. Add the public settings to .env.
        </Notice>
      ) : isPending ? (
        <div
          role="status"
          className="h-96 bg-stone-200 motion-safe:animate-pulse dark:bg-stone-800"
        >
          <span className="sr-only">Loading donation</span>
        </div>
      ) : error ? (
        <Notice error>{toAppError(error).message}</Notice>
      ) : !donation ? (
        <EmptyState
          title="Donation not found"
          description="This listing may have been removed."
          action="Go to dashboard"
          href="/dashboard"
        />
      ) : donation.donorId !== user?.uid || donation.status !== "available" ? (
        <EmptyState
          title="This listing cannot be edited"
          description="Only the donor can edit a listing, and only while it is available."
          action="View listing"
          href={`/donations/${donation.id}`}
        />
      ) : (
        <div className="grid gap-8 xl:grid-cols-12 xl:gap-14">
          <aside className="xl:col-span-4">
            <div className="border-l-4 border-forest-600 pl-6">
              <p className="font-display text-2xl leading-snug sm:text-3xl">
                Keep your community in the loop.
              </p>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                Update the amount or description before an organization requests
                the donation. Your original posting date and donor details stay
                with the listing.
              </p>
            </div>
          </aside>
          <div className="xl:col-span-8">
            <DonationForm
              key={donation.id}
              initialValues={donation}
              submitLabel="Save changes"
              onSubmit={submit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
