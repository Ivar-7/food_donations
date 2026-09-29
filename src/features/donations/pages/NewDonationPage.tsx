import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MapPin, PackageCheck } from "lucide-react";
import { useAuth } from "../../../app/authContext";
import { createDonation } from "../api/donations.api";
import { donationsKeys } from "../state/donations.keys";
import type { DonationFormValues } from "../donation.types";
import DonationForm from "../components/DonationForm";
import { PageHeader } from "../../../shared/ui/Elements";

const emptyDonationForm: DonationFormValues = {
  title: "",
  category: "Food",
  quantity: "",
  location: "",
  description: "",
};

export default function NewDonationPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const client = useQueryClient();

  async function submit(values: DonationFormValues) {
    if (!user) throw new Error("Sign in to post a donation.");
    const id = await createDonation(
      values,
      user.uid,
      profile?.username ?? user.displayName ?? "Community donor",
    );
    await client.invalidateQueries({ queryKey: donationsKeys.all });
    navigate(`/donations/${id}`, {
      state: { success: "Your donation is now listed." },
    });
  }

  return (
    <div className="w-full px-4 py-12 sm:px-8 lg:px-12 lg:py-16 2xl:px-20">
      <Link
        to="/donations"
        className="mb-9 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-pink-700 dark:text-stone-300 dark:hover:text-pink-400"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to donations
      </Link>
      <PageHeader
        eyebrow="Share with your community"
        title="Post a donation"
        description="Give local organizations the details they need to plan a pickup."
      />
      <div className="grid gap-8 xl:grid-cols-12 xl:gap-14">
        <aside className="xl:col-span-4">
          <div className="border-l-4 border-pink-600 pl-6">
            <p className="font-display text-2xl leading-snug sm:text-3xl">
              A clear listing helps good things reach the right place faster.
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              Be specific about the amount, condition, and general pickup area.
              You can edit or remove your listing until an organization requests
              it.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="flex gap-3 border-t border-stone-200 pt-4 dark:border-stone-800">
              <PackageCheck
                className="shrink-0 text-pink-600 dark:text-pink-300"
                size={20}
                aria-hidden="true"
              />
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Include what someone will collect and how much is available.
              </p>
            </div>
            <div className="flex gap-3 border-t border-stone-200 pt-4 dark:border-stone-800">
              <MapPin
                className="shrink-0 text-pink-600 dark:text-pink-300"
                size={20}
                aria-hidden="true"
              />
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Use a neighborhood or area rather than a private address.
              </p>
            </div>
          </div>
        </aside>
        <div className="xl:col-span-8">
          <DonationForm
            initialValues={emptyDonationForm}
            submitLabel="Publish donation"
            onSubmit={submit}
          />
        </div>
      </div>
    </div>
  );
}
