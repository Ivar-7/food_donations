import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, HeartHandshake } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../../app/authContext";
import { toAppError } from "../../../shared/errors/appError";
import {
  EmptyState,
  fieldClass,
  Notice,
  PageHeader,
  primaryClass,
} from "../../../shared/ui/Elements";
import { pledgeToSponsorship } from "../api/sponsorships.api";
import { sponsorshipsKeys } from "../state/sponsorships.keys";
import { useMyPledge, useSponsorship } from "../state/useSponsorships";

export default function SponsorshipPage() {
  const { sponsorshipId } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const { data: item, isPending, error } = useSponsorship(sponsorshipId);
  const pledge = useMyPledge(sponsorshipId, user?.uid);
  const client = useQueryClient();
  const [quantity, setQuantity] = useState("");
  const [pending, setPending] = useState(false);
  const [actionError, setActionError] = useState("");
  const [success, setSuccess] = useState(
    (location.state as { success?: string } | null)?.success ?? "",
  );

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!item || !user) return;
    const amount = Number(quantity);
    const remaining = item.targetQuantity - item.pledgedQuantity;
    if (!Number.isInteger(amount) || amount < 1 || amount > remaining) {
      setActionError(`Enter a whole number from 1 to ${remaining}.`);
      return;
    }
    setPending(true);
    setActionError("");
    setSuccess("");
    try {
      await pledgeToSponsorship(item.id, user.uid, amount);
      await client.invalidateQueries({ queryKey: sponsorshipsKeys.all });
      setSuccess(
        "Your pledge has been recorded. Please coordinate the handoff with the organization outside FoodBridge.",
      );
    } catch (cause) {
      setActionError(toAppError(cause).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="w-full px-4 py-12 sm:px-8 lg:px-12 lg:py-16 2xl:px-20">
      <PageHeader
        eyebrow="Community need"
        title={item?.title ?? "Need details"}
        description={
          item ? `Posted by ${item.organizationName}` : "See how you can help."
        }
        action={
          <Link
            to="/sponsorships"
            className="inline-flex items-center gap-2 text-sm font-bold text-forest-700 dark:text-forest-500"
          >
            <ArrowLeft size={16} /> All needs
          </Link>
        }
      />
      {isPending ? (
        <p role="status">Loading need…</p>
      ) : error ? (
        <Notice error>{toAppError(error).message}</Notice>
      ) : !item ? (
        <EmptyState
          title="Need not found"
          description="This need may have been removed or the link is incorrect."
          action="View community needs"
          href="/sponsorships"
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-12">
          <section className="border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 sm:p-8 lg:col-span-7">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={`${item.title} supplies`}
                className="mb-6 max-h-96 w-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="flex size-14 items-center justify-center rounded-full bg-forest-100 text-forest-700 dark:bg-forest-900 dark:text-forest-100">
              <HeartHandshake size={27} strokeWidth={1.6} />
            </div>
            <h2 className="mt-6 font-display text-3xl">
              What the organization needs
            </h2>
            <p className="mt-4 whitespace-pre-wrap leading-relaxed text-stone-600 dark:text-stone-300">
              {item.description}
            </p>
            <div className="mt-8 border-t border-stone-200 pt-6 dark:border-stone-800">
              <p className="text-xs font-bold uppercase tracking-widest text-forest-600 dark:text-forest-500">
                Progress
              </p>
              <p className="mt-2 font-display text-3xl">
                {item.pledgedQuantity} of {item.targetQuantity} {item.unit}
              </p>
              <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                {item.status === "fulfilled"
                  ? "This need is fully pledged."
                  : `${item.targetQuantity - item.pledgedQuantity} ${item.unit} still needed.`}
              </p>
            </div>
          </section>
          <aside className="lg:col-span-5">
            <div className="border border-stone-200 bg-forest-50 p-6 dark:border-forest-800 dark:bg-forest-900 sm:p-8">
              <h2 className="font-display text-3xl">Make a pledge</h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                Commit only to items you can provide. FoodBridge records the
                pledge but does not process payments or arrange delivery.
              </p>
              {item.ownerUserId === "foodbridge-seed-organization" ? (
                <Notice>
                  This is a sample need for exploring FoodBridge. It cannot
                  receive pledges.
                </Notice>
              ) : !user ? (
                <Link
                  to="/login"
                  state={{ from: `/sponsorships/${item.id}` }}
                  className={`${primaryClass} mt-6`}
                >
                  Log in to pledge
                </Link>
              ) : item.ownerUserId === user.uid ? (
                <Notice>This is your organization’s need.</Notice>
              ) : item.status === "fulfilled" ? (
                <div className="mt-6">
                  <Notice>This need is fully pledged.</Notice>
                </div>
              ) : pledge.isPending ? (
                <p role="status" className="mt-6 text-sm">
                  Checking your pledge…
                </p>
              ) : pledge.error ? (
                <div className="mt-6">
                  <Notice error>{toAppError(pledge.error).message}</Notice>
                </div>
              ) : pledge.data ? (
                <div className="mt-6">
                  <Notice>
                    You pledged {pledge.data.quantity} {item.unit}. Thank you
                    for helping.
                  </Notice>
                </div>
              ) : (
                <form
                  onSubmit={(event) => void submit(event)}
                  className="mt-6 space-y-4"
                >
                  <label className="block text-sm font-semibold">
                    How many {item.unit} can you provide?
                    <input
                      type="number"
                      min={1}
                      max={item.targetQuantity - item.pledgedQuantity}
                      step={1}
                      required
                      value={quantity}
                      onChange={(event) => setQuantity(event.target.value)}
                      className={`${fieldClass} mt-2`}
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={pending}
                    className={primaryClass}
                  >
                    {pending ? "Saving pledge…" : "Record pledge"}
                  </button>
                </form>
              )}
              {actionError && (
                <div className="mt-4">
                  <Notice error>{actionError}</Notice>
                </div>
              )}
              {success && (
                <div className="mt-4">
                  <Notice>{success}</Notice>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
