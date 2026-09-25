import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../app/authContext";
import { createDonation } from "../api/donations.api";
import { donationsKeys } from "../state/donations.keys";
import { validateDonation } from "../donation.schema";
import { toAppError } from "../../../shared/errors/appError";
import {
  fieldClass,
  Notice,
  PageHeader,
  primaryClass,
} from "../../../shared/ui/Elements";

export default function NewDonationPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const client = useQueryClient();
  const [form, setForm] = useState({
    title: "",
    category: "Food" as "Food" | "Essentials",
    quantity: "",
    location: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    const validation = validateDonation(form);
    if (validation) {
      setError(validation);
      return;
    }
    if (!user) return;
    setPending(true);
    setError("");
    try {
      await createDonation({
        ...form,
        title: form.title.trim(),
        quantity: form.quantity.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        donorId: user.uid,
        donorName: profile?.username ?? user.displayName ?? "Community donor",
      });
      await client.invalidateQueries({ queryKey: donationsKeys.all });
      navigate("/dashboard", {
        state: { success: "Your donation is now listed." },
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
        eyebrow="Share with your community"
        title="Post a donation"
        description="Tell local organizations what is available and where it can be picked up."
      />
      <form
        onSubmit={(event) => void submit(event)}
        className="max-w-4xl space-y-5 border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 sm:p-8 lg:p-10"
      >
        <label className="block text-sm font-semibold">
          What are you donating?
          <input
            required
            maxLength={100}
            className={`${fieldClass} mt-2`}
            placeholder="Fresh vegetables"
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
          />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            Category
            <select
              className={`${fieldClass} mt-2`}
              value={form.category}
              onChange={(event) =>
                setForm({
                  ...form,
                  category: event.target.value as "Food" | "Essentials",
                })
              }
            >
              <option>Food</option>
              <option>Essentials</option>
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
              onChange={(event) =>
                setForm({ ...form, quantity: event.target.value })
              }
            />
          </label>
        </div>
        <label className="block text-sm font-semibold">
          Pickup area
          <input
            required
            maxLength={120}
            className={`${fieldClass} mt-2`}
            placeholder="Westlands, Nairobi"
            value={form.location}
            onChange={(event) =>
              setForm({ ...form, location: event.target.value })
            }
          />
        </label>
        <label className="block text-sm font-semibold">
          Description
          <textarea
            required
            rows={5}
            maxLength={1000}
            className={`${fieldClass} mt-2`}
            placeholder="Describe the items, condition, and pickup details."
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
          />
        </label>
        {error && <Notice error>{error}</Notice>}
        <button disabled={pending} className={primaryClass} type="submit">
          {pending ? "Posting…" : "Publish donation"}
        </button>
      </form>
    </div>
  );
}
