import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../app/authContext";
import { applyForOrganization } from "../api/organizations.api";
import { validateOrganizationApplication } from "../organization.schema";
import { organizationsKeys } from "../state/organizations.keys";
import { toAppError } from "../../../shared/errors/appError";
import {
  fieldClass,
  Notice,
  PageHeader,
  primaryClass,
} from "../../../shared/ui/Elements";

export default function ApplyPage() {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({
    name: "",
    type: "Shelter" as "Shelter" | "NGO",
    location: "",
    description: "",
    contactEmail: user?.email ?? "",
  });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();
  const client = useQueryClient();
  async function submit(event: FormEvent) {
    event.preventDefault();
    const validation = validateOrganizationApplication(form);
    if (validation) {
      setError(validation);
      return;
    }
    if (!user) return;
    setPending(true);
    setError("");
    try {
      await applyForOrganization({
        ...form,
        name: form.name.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        contactEmail: form.contactEmail.trim(),
        userId: user.uid,
      });
      await client.invalidateQueries({
        queryKey: organizationsKeys.applications(user.uid),
      });
      navigate("/dashboard", {
        state: { success: "Your application was submitted for review." },
      });
    } catch (cause) {
      setError(toAppError(cause).message);
    } finally {
      setPending(false);
    }
  }
  if (profile?.organizationId)
    return (
      <div className="w-full px-4 py-16 sm:px-8 lg:px-12 2xl:px-20">
        <Notice>
          Your account is already linked to an approved organization.
        </Notice>
      </div>
    );
  return (
    <div className="w-full px-4 py-12 sm:px-8 lg:px-12 lg:py-16 2xl:px-20">
      <PageHeader
        eyebrow="Partner with us"
        title="Register your organization"
        description="Tell us about your shelter or NGO. An administrator will review your application before it appears publicly."
      />
      <form
        onSubmit={(event) => void submit(event)}
        className="max-w-4xl space-y-5 border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 sm:p-8 lg:p-10"
      >
        <label className="block text-sm font-semibold">
          Organization name
          <input
            required
            maxLength={120}
            className={`${fieldClass} mt-2`}
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            Organization type
            <select
              className={`${fieldClass} mt-2`}
              value={form.type}
              onChange={(event) =>
                setForm({
                  ...form,
                  type: event.target.value as "Shelter" | "NGO",
                })
              }
            >
              <option>Shelter</option>
              <option>NGO</option>
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Location
            <input
              required
              maxLength={120}
              className={`${fieldClass} mt-2`}
              value={form.location}
              onChange={(event) =>
                setForm({ ...form, location: event.target.value })
              }
            />
          </label>
        </div>
        <label className="block text-sm font-semibold">
          Contact email
          <input
            type="email"
            required
            className={`${fieldClass} mt-2`}
            value={form.contactEmail}
            onChange={(event) =>
              setForm({ ...form, contactEmail: event.target.value })
            }
          />
        </label>
        <label className="block text-sm font-semibold">
          What does your organization do?
          <textarea
            required
            rows={5}
            maxLength={1500}
            className={`${fieldClass} mt-2`}
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
          />
        </label>
        {error && <Notice error>{error}</Notice>}
        <button type="submit" disabled={pending} className={primaryClass}>
          {pending ? "Submitting…" : "Submit application"}
        </button>
      </form>
    </div>
  );
}
