import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, CircleCheck, CircleX, Clock3 } from "lucide-react";
import { useAuth } from "../../../app/authContext";
import {
  ApplicationConflictError,
  applyForOrganization,
} from "../api/organizations.api";
import { validateOrganizationApplication } from "../organization.schema";
import { organizationsKeys } from "../state/organizations.keys";
import { useMyApplications } from "../state/useOrganizations";
import { toAppError } from "../../../shared/errors/appError";
import { firebaseConfigured } from "../../../shared/firebase/client";
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
  const applications = useMyApplications(user?.uid);
  const activeApplication = applications.data?.find(
    (item) => item.status === "pending" || item.status === "approved",
  );
  const lastRejected = applications.data?.find(
    (item) => item.status === "rejected",
  );
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
      setError(
        cause instanceof ApplicationConflictError
          ? cause.message
          : toAppError(cause).message,
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="w-full px-4 py-12 sm:px-8 lg:px-12 lg:py-16 2xl:px-20">
      <PageHeader
        eyebrow="Partner with us"
        title="Register your organization"
        description="Register your shelter or NGO to request donations and post community needs. An administrator reviews your application; once approved, you can start asking for support."
      />
      {!firebaseConfigured ? (
        <Notice error>
          Firebase is not configured. Set up your environment and try again.
        </Notice>
      ) : applications.isPending ? (
        <p role="status" className="text-stone-600 dark:text-stone-400">
          Loading your application status…
        </p>
      ) : applications.error ? (
        <Notice error>{toAppError(applications.error).message}</Notice>
      ) : profile?.organizationId || activeApplication ? (
        <div className="grid gap-8 lg:grid-cols-5">
          <section className="rounded-3xl border border-stone-200 bg-white p-7 dark:border-stone-800 dark:bg-stone-900 sm:p-10 lg:col-span-3">
            <div className="flex size-14 items-center justify-center rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-100">
              {profile?.organizationId ||
              activeApplication?.status === "approved" ? (
                <CircleCheck size={28} aria-hidden="true" />
              ) : (
                <Clock3 size={28} aria-hidden="true" />
              )}
            </div>
            <p className="mt-7 text-xs font-bold uppercase tracking-widest text-pink-700 dark:text-pink-400">
              Application status
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              {profile?.organizationId ||
              activeApplication?.status === "approved"
                ? "You're an approved partner"
                : "Your application is in review"}
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-stone-600 dark:text-stone-400">
              {profile?.organizationId ||
              activeApplication?.status === "approved"
                ? "Your organization is now listed in the community directory. You can request available donations and publish community needs."
                : "Thanks for applying. An administrator will review your details, and you'll see the decision here."}
            </p>
            {profile?.organizationId && (
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/sponsorships/new" className={primaryClass}>
                  Post a community need
                </Link>
                <Link to="/donations" className={primaryClass}>
                  Request a donation
                </Link>
              </div>
            )}
          </section>
          <aside className="border border-stone-200 bg-stone-50 p-7 dark:border-stone-800 dark:bg-stone-900 sm:p-8 lg:col-span-2">
            <Building2
              size={30}
              className="text-pink-700 dark:text-pink-400"
              aria-hidden="true"
            />
            <h3 className="mt-5 font-display text-2xl">
              {activeApplication?.name ?? "Your organization"}
            </h3>
            {activeApplication && (
              <>
                <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                  {activeApplication.type} · {activeApplication.location}
                </p>
                <p className="mt-5 border-t border-stone-200 pt-5 text-sm leading-relaxed text-stone-600 dark:border-stone-700 dark:text-stone-400">
                  {activeApplication.description}
                </p>
              </>
            )}
          </aside>
        </div>
      ) : (
        <>
          {lastRejected && (
            <div className="mb-7 flex items-start gap-4 border border-amber-200 bg-amber-50 p-5 text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
              <CircleX
                size={22}
                className="mt-0.5 shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold">
                  Your previous application was not approved.
                </p>
                <p className="mt-1 text-sm">
                  You can revise your details and apply again.
                </p>
              </div>
            </div>
          )}
          <form
            onSubmit={(event) => void submit(event)}
            className="max-w-4xl space-y-5 rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 sm:p-8 lg:p-10"
          >
            <label className="block text-sm font-semibold">
              Organization name
              <input
                required
                maxLength={120}
                className={`${fieldClass} mt-2`}
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
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
                maxLength={254}
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
        </>
      )}
    </div>
  );
}
