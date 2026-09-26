import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import type { DonationFormValues } from "../donation.types";
import { validateDonation } from "../donation.schema";
import { fieldClass, Notice, primaryClass } from "../../../shared/ui/Elements";
import { toAppError } from "../../../shared/errors/appError";

export default function DonationForm({
  initialValues,
  submitLabel,
  onSubmit,
}: {
  initialValues: DonationFormValues;
  submitLabel: string;
  onSubmit: (values: DonationFormValues) => Promise<void>;
}) {
  const [form, setForm] = useState(initialValues);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function change<K extends keyof DonationFormValues>(
    key: K,
    value: DonationFormValues[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateDonation(form);
    if (validation) {
      setError(validation);
      return;
    }
    setError("");
    setPending(true);
    try {
      await onSubmit(form);
    } catch (cause) {
      setError(toAppError(cause).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={(event) => void submit(event)}
      className="border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-8 xl:p-10"
    >
      <div className="mb-8 flex items-center justify-between border-b border-stone-200 pb-6 dark:border-stone-800">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-forest-600 dark:text-forest-500">
            Listing details
          </p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl">
            Make it easy to collect
          </h2>
        </div>
        <span className="hidden rounded-full bg-forest-50 px-4 py-2 text-xs font-bold text-forest-700 dark:bg-forest-900 dark:text-forest-100 sm:block">
          Photo optional
        </span>
      </div>
      <div className="space-y-6">
        <label className="block text-sm font-semibold">
          What are you sharing?
          <input
            required
            minLength={3}
            maxLength={100}
            className={`${fieldClass} mt-2`}
            placeholder="Fresh vegetables"
            value={form.title}
            onChange={(event) => change("title", event.target.value)}
          />
        </label>
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            Category
            <select
              className={`${fieldClass} mt-2`}
              value={form.category}
              onChange={(event) =>
                change(
                  "category",
                  event.target.value as DonationFormValues["category"],
                )
              }
            >
              <option value="Food">Food</option>
              <option value="Essentials">Essentials</option>
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Quantity
            <input
              required
              maxLength={80}
              className={`${fieldClass} mt-2`}
              placeholder="3 boxes"
              value={form.quantity}
              onChange={(event) => change("quantity", event.target.value)}
            />
          </label>
        </div>
        <label className="block text-sm font-semibold">
          Pickup area
          <input
            required
            minLength={2}
            maxLength={120}
            className={`${fieldClass} mt-2`}
            placeholder="Westlands, Nairobi"
            value={form.location}
            onChange={(event) => change("location", event.target.value)}
          />
          <span className="mt-2 block text-xs font-normal text-stone-500 dark:text-stone-400">
            Share a general area. Arrange the exact handoff privately.
          </span>
        </label>
        <label className="block text-sm font-semibold">
          Description
          <textarea
            required
            minLength={10}
            rows={6}
            maxLength={1000}
            className={`${fieldClass} mt-2 resize-y`}
            placeholder="Describe the items, condition, and anything useful for collection."
            value={form.description}
            onChange={(event) => change("description", event.target.value)}
          />
          <span className="mt-2 block text-right text-xs font-normal text-stone-500 dark:text-stone-400">
            {form.description.length}/1000
          </span>
        </label>
        <label className="block text-sm font-semibold">
          Image URL <span className="font-normal">(optional)</span>
          <input
            type="url"
            maxLength={2048}
            className={`${fieldClass} mt-2`}
            placeholder="https://example.org/images/donation.jpg"
            value={form.imageUrl ?? ""}
            onChange={(event) => change("imageUrl", event.target.value)}
          />
          <span className="mt-2 block text-xs font-normal text-stone-500 dark:text-stone-400">
            Paste a direct image link that matches your items.
          </span>
        </label>
        {error && <Notice error>{error}</Notice>}
        <div className="flex flex-col gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Your listing will be visible to the community.
          </p>
          <button disabled={pending} className={primaryClass} type="submit">
            {pending ? "Saving…" : submitLabel}
            {!pending && <ArrowRight size={17} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </form>
  );
}
