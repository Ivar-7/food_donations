import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, PackageCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../app/authContext";
import { donationsKeys } from "../../donations/state/donations.keys";
import { toAppError } from "../../../shared/errors/appError";
import {
  EmptyState,
  Notice,
  PageHeader,
  primaryClass,
} from "../../../shared/ui/Elements";
import { confirmReceipt, markHandoff } from "../api/orders.api";
import { ordersKeys } from "../state/orders.keys";
import { useOrder } from "../state/useOrders";

const steps = [
  {
    status: "requested",
    label: "Requested",
    description: "The organization has reserved this donation.",
  },
  {
    status: "pickup",
    label: "Handed over",
    description: "The donor has confirmed the handoff.",
  },
  {
    status: "received",
    label: "Received",
    description: "The organization has confirmed receipt.",
  },
] as const;

export default function OrderPage() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const { data: order, isPending, error } = useOrder(orderId);
  const client = useQueryClient();
  const [pending, setPending] = useState(false);
  const [actionError, setActionError] = useState("");
  const [success, setSuccess] = useState("");

  async function advance() {
    if (!order || !user) return;
    setPending(true);
    setActionError("");
    setSuccess("");
    try {
      if (order.status === "requested") await markHandoff(order.id, user.uid);
      else if (order.status === "pickup")
        await confirmReceipt(order.id, user.uid);
      await Promise.all([
        client.invalidateQueries({ queryKey: ordersKeys.all }),
        client.invalidateQueries({ queryKey: donationsKeys.all }),
      ]);
      setSuccess(
        order.status === "requested"
          ? "Handoff confirmed. The organization can now confirm receipt."
          : "Receipt confirmed. This request is complete.",
      );
    } catch (cause) {
      setActionError(toAppError(cause).message);
    } finally {
      setPending(false);
    }
  }

  const canHandoff =
    order?.status === "requested" && order.donorId === user?.uid;
  const canReceive =
    order?.status === "pickup" && order.requestedBy === user?.uid;
  const currentStep = steps.findIndex((step) => step.status === order?.status);

  return (
    <div className="w-full px-4 py-12 sm:px-8 lg:px-12 lg:py-16 2xl:px-20">
      <PageHeader
        eyebrow="Donation handoff"
        title={order?.donationTitle ?? "Request details"}
        description="Keep both sides in sync from reservation to receipt."
        action={
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-sm font-bold text-pink-700 dark:text-pink-300"
          >
            <ArrowLeft size={16} /> All requests
          </Link>
        }
      />
      {isPending ? (
        <p role="status">Loading request…</p>
      ) : error ? (
        <Notice error>{toAppError(error).message}</Notice>
      ) : !order ? (
        <EmptyState
          title="Request not found"
          description="This request may have been removed or the link is incorrect."
          action="View your requests"
          href="/orders"
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-12">
          <section className="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 sm:p-8 lg:col-span-7">
            <div className="flex items-center gap-3">
              <PackageCheck
                size={25}
                className="text-pink-700 dark:text-pink-300"
              />
              <h2 className="font-display text-3xl">Handoff progress</h2>
            </div>
            <div className="mt-8 space-y-0">
              {steps.map((step, index) => (
                <div key={step.status} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex size-9 items-center justify-center rounded-full border text-sm font-bold ${index <= currentStep ? "border-pink-700 bg-pink-700 text-white" : "border-stone-300 text-stone-500 dark:border-stone-700 dark:text-stone-400"}`}
                    >
                      {index < currentStep ? <Check size={17} /> : index + 1}
                    </span>
                    {index < steps.length - 1 && (
                      <span className="h-14 w-px bg-stone-200 dark:bg-stone-700" />
                    )}
                  </div>
                  <div className="pt-1">
                    <p className="font-semibold">{step.label}</p>
                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {(canHandoff || canReceive) && (
              <div className="mt-7 border-t border-stone-200 pt-7 dark:border-stone-800">
                <p className="mb-4 text-sm text-stone-600 dark:text-stone-400">
                  {canHandoff
                    ? "Confirm only after the donation has been handed to the organization."
                    : "Confirm only after your organization has received the donation."}
                </p>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => void advance()}
                  className={primaryClass}
                >
                  {pending
                    ? "Saving…"
                    : canHandoff
                      ? "Confirm handoff"
                      : "Confirm receipt"}
                </button>
              </div>
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
          </section>
          <aside className="space-y-6 lg:col-span-5">
            <div className="border border-stone-200 bg-pink-50 p-6 dark:border-pink-800 dark:bg-pink-900 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-pink-700 dark:text-pink-100">
                Pickup reference
              </p>
              <p className="mt-3 font-display text-5xl tracking-widest text-pink-950 dark:text-white">
                {order.pickupCode}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                Share this reference when coordinating the handoff. It
                identifies this request; it is not a payment or delivery code.
              </p>
            </div>
            <div className="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 sm:p-8">
              <h2 className="font-display text-2xl">At a glance</h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-stone-500 dark:text-stone-400">
                    Organization
                  </dt>
                  <dd className="mt-1 font-semibold">
                    {order.organizationName}
                  </dd>
                </div>
                <div>
                  <dt className="text-stone-500 dark:text-stone-400">
                    Requested
                  </dt>
                  <dd className="mt-1 font-semibold">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-stone-500 dark:text-stone-400">Status</dt>
                  <dd className="mt-1 font-semibold capitalize">
                    {order.status}
                  </dd>
                </div>
              </dl>
              <Link
                to={`/donations/${order.donationId}`}
                className="mt-6 inline-block text-sm font-bold text-pink-700 dark:text-pink-300"
              >
                View donation
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
