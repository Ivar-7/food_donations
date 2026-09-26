import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/authContext";
import type { Donation } from "../../donations/donation.types";
import { donationsKeys } from "../../donations/state/donations.keys";
import { toAppError } from "../../../shared/errors/appError";
import {
  Notice,
  primaryClass,
  secondaryClass,
} from "../../../shared/ui/Elements";
import { requestDonation } from "../api/orders.api";
import { ordersKeys } from "../state/orders.keys";

export default function RequestDonationButton({
  donation,
}: {
  donation: Donation;
}) {
  const { user, profile, profileLoading } = useAuth();
  const navigate = useNavigate();
  const client = useQueryClient();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function request() {
    if (!user || !profile?.organizationId) return;
    setPending(true);
    setError("");
    try {
      const orderId = await requestDonation(
        donation.id,
        user.uid,
        profile.organizationId,
      );
      await Promise.all([
        client.invalidateQueries({ queryKey: donationsKeys.all }),
        client.invalidateQueries({ queryKey: ordersKeys.all }),
      ]);
      navigate(`/orders/${orderId}`);
    } catch (cause) {
      setError(toAppError(cause).message);
    } finally {
      setPending(false);
    }
  }

  if (donation.status !== "available") return null;
  if (donation.donorId === "foodbridge-seed-donor")
    return (
      <p className="text-sm text-stone-600 dark:text-stone-400">
        This is a sample listing for exploring Okoa Food. It cannot be
        requested.
      </p>
    );
  if (profileLoading)
    return (
      <p role="status" className="text-sm text-stone-500 dark:text-stone-400">
        Checking your organization…
      </p>
    );
  if (!user)
    return (
      <Link
        to="/login"
        state={{ from: `/donations/${donation.id}` }}
        className={primaryClass}
      >
        Log in to request <ArrowUpRight size={16} />
      </Link>
    );
  if (donation.donorId === user.uid)
    return (
      <p className="text-sm text-stone-500 dark:text-stone-400">
        This is your donation listing.
      </p>
    );
  if (!profile?.organizationId)
    return (
      <div className="space-y-3">
        <p className="text-sm text-stone-600 dark:text-stone-400">
          Only approved organizations can request a donation.
        </p>
        <Link to="/organizations/apply" className={secondaryClass}>
          Apply as an organization
        </Link>
      </div>
    );
  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={pending}
        onClick={() => void request()}
        className={primaryClass}
      >
        {pending ? "Requesting…" : "Request for your organization"}{" "}
        {!pending && <ArrowUpRight size={16} />}
      </button>
      {error && <Notice error>{error}</Notice>}
    </div>
  );
}
