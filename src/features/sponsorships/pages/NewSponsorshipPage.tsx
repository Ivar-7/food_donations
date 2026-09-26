import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/authContext";
import { toAppError } from "../../../shared/errors/appError";
import {
  fieldClass,
  Notice,
  PageHeader,
  primaryClass,
} from "../../../shared/ui/Elements";
import { createSponsorship } from "../api/sponsorships.api";
import { validateSponsorship } from "../sponsorship.schema";
import { sponsorshipsKeys } from "../state/sponsorships.keys";

export default function NewSponsorshipPage() {
  const { user, profile, profileLoading } = useAuth();
  const client = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    unit: "",
    targetQuantity: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const targetQuantity = Number(form.targetQuantity);
    const validation = validateSponsorship({ ...form, targetQuantity });
    if (validation) {
      setError(validation);
      return;
    }
    if (!user || !profile?.organizationId) return;
    setPending(true);
    setError("");
    try {
      const id = await createSponsorship({
        ...form,
        targetQuantity,
        organizationId: profile.organizationId,
        ownerUserId: user.uid,
      });
      await client.invalidateQueries({ queryKey: sponsorshipsKeys.all });
      navigate(`/sponsorships/${id}`, {
        state: { success: "Your community need is now visible." },
      });
    } catch (cause) {
      setError(toAppError(cause).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="w-full px-4 py-12 sm:px-8 lg:px-12 lg:py-16 2xl:px-20">
      <PageHeader
        eyebrow="For approved organizations"
        title="Post a community need"
        description="Ask for specific items and a clear quantity. Neighbors can pledge what they can provide."
      />
      {profileLoading ? (
        <p role="status">Checking your organization…</p>
      ) : !profile?.organizationId ? (
        <Notice error>
          Only approved organizations can post a need.{" "}
          <Link to="/organizations/apply" className="font-bold underline">
            Apply as an organization
          </Link>
          .
        </Notice>
      ) : (
        <form
          onSubmit={(event) => void submit(event)}
          className="max-w-4xl space-y-5 border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 sm:p-8 lg:p-10"
        >
          <label className="block text-sm font-semibold">
            What do you need?
            <input
              required
              maxLength={100}
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              className={`${fieldClass} mt-2`}
              placeholder="Pantry staples for weekly meals"
            />
          </label>
          <label className="block text-sm font-semibold">
            Why is it needed?
            <textarea
              required
              rows={5}
              maxLength={1000}
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              className={`${fieldClass} mt-2`}
              placeholder="Tell the community how these items will be used."
            />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Unit
              <input
                required
                maxLength={40}
                value={form.unit}
                onChange={(event) =>
                  setForm({ ...form, unit: event.target.value })
                }
                className={`${fieldClass} mt-2`}
                placeholder="bags, boxes, or kits"
              />
            </label>
            <label className="block text-sm font-semibold">
              Target quantity
              <input
                type="number"
                min={1}
                max={10000}
                step={1}
                required
                value={form.targetQuantity}
                onChange={(event) =>
                  setForm({ ...form, targetQuantity: event.target.value })
                }
                className={`${fieldClass} mt-2`}
                placeholder="20"
              />
            </label>
          </div>
          <label className="block text-sm font-semibold">
            Image URL <span className="font-normal">(optional)</span>
            <input
              type="url"
              maxLength={2048}
              value={form.imageUrl}
              onChange={(event) =>
                setForm({ ...form, imageUrl: event.target.value })
              }
              className={`${fieldClass} mt-2`}
              placeholder="https://example.org/images/needed-items.jpg"
            />
          </label>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Pledges are in-kind commitments. FoodBridge does not handle payments
            or delivery.
          </p>
          {error && <Notice error>{error}</Notice>}
          <button type="submit" disabled={pending} className={primaryClass}>
            {pending ? "Publishing…" : "Publish need"}
          </button>
        </form>
      )}
    </div>
  );
}
