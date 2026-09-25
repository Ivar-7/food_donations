import { useState, type FormEvent } from "react";
import type { User } from "firebase/auth";
import { ArrowRight, Mail, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../app/authContext";
import { createMissingProfile, updateUsername } from "../api/auth.api";
import { validateUsername } from "../auth.schema";
import type { UserProfile } from "../auth.types";
import { toAppError } from "../../../shared/errors/appError";
import {
  fieldClass,
  Notice,
  PageHeader,
  primaryClass,
} from "../../../shared/ui/Elements";

function ProfileForm({
  user,
  profile,
}: {
  user: User;
  profile: UserProfile | null;
}) {
  const [username, setUsername] = useState(
    profile?.username ?? user.displayName ?? "",
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    const validation = validateUsername(username);
    if (validation) {
      setError(validation);
      return;
    }
    setPending(true);
    setError("");
    setSuccess("");
    try {
      if (profile) await updateUsername(user, username);
      else await createMissingProfile(user, username);
      setSuccess("Your profile has been saved.");
    } catch (cause) {
      setError(toAppError(cause).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {!profile && (
        <div className="mb-6">
          <Notice>
            Your account is signed in, but its profile is missing. Add your name
            to finish setting it up.
          </Notice>
        </div>
      )}
      <form onSubmit={(event) => void submit(event)} className="space-y-6">
        <label className="block text-sm font-semibold">
          Display name
          <input
            autoComplete="name"
            required
            maxLength={60}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className={`${fieldClass} mt-2`}
            placeholder="Your name"
          />
        </label>
        <div>
          <p className="text-sm font-semibold">Email address</p>
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3.5 text-sm text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
            <Mail size={17} aria-hidden="true" />{" "}
            <span className="break-all">
              {user.email ?? "No email available"}
            </span>
          </div>
          <p className="mt-2 text-xs text-stone-500">
            Email changes are not available in this version.
          </p>
        </div>
        {error && <Notice error>{error}</Notice>}
        {success && <Notice>{success}</Notice>}
        <button
          type="submit"
          disabled={
            pending ||
            (Boolean(profile) && username.trim() === profile?.username)
          }
          className={primaryClass}
        >
          {pending ? "Saving…" : profile ? "Save changes" : "Create profile"}
        </button>
      </form>
    </>
  );
}

export default function ProfilePage() {
  const { user, profile, profileLoading, profileError } = useAuth();

  return (
    <div className="w-full px-4 py-12 sm:px-8 lg:px-12 lg:py-16 2xl:px-20">
      <PageHeader
        eyebrow="Account settings"
        title="Your profile"
        description="The name people see when you share with the community."
      />
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-forest-100 text-forest-700 dark:bg-forest-900 dark:text-forest-100">
            <UserRound size={28} />
          </div>
          <h2 className="mt-6 font-display text-3xl">
            A familiar face in the community.
          </h2>
          <p className="mt-3 max-w-sm leading-relaxed text-stone-600 dark:text-stone-400">
            Keep your display name up to date. Your account email is shown here
            for reference.
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-forest-700 dark:text-forest-500"
          >
            Back to dashboard <ArrowRight size={16} />
          </Link>
        </div>
        <div className="lg:col-span-8 xl:col-span-6">
          <div className="border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-8">
            {profileLoading ? (
              <p role="status" className="text-stone-600 dark:text-stone-400">
                Loading your profile…
              </p>
            ) : profileError ? (
              <Notice error>{profileError}</Notice>
            ) : user ? (
              <ProfileForm user={user} profile={profile} />
            ) : (
              <Notice error>
                Your session has ended. Please log in again.
              </Notice>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
