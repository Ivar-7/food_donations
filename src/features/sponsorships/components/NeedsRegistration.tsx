import { ArrowRight, Check, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../app/authContext";
import { primaryClass, secondaryClass } from "../../../shared/ui/Elements";

export default function NeedsRegistration() {
  const { user, profile, loading, profileLoading } = useAuth();
  return (
    <section className="mb-8 grid gap-6 rounded-3xl border border-pink-200 bg-pink-100/50 p-6 dark:border-pink-900 dark:bg-pink-900/20 sm:p-8 lg:grid-cols-2">
      <div>
        <HeartHandshake
          size={28}
          className="text-pink-700 dark:text-pink-300"
          aria-hidden="true"
        />
        <h2 className="mt-4 font-display text-3xl">Need a little support?</h2>
        <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
          Shelters and NGOs can register, get approved and post the food or
          essentials their community needs. Anyone with an account can pledge
          items to help.
        </p>
        <div className="mt-5">
          {loading || profileLoading ? (
            <p role="status">Checking your account…</p>
          ) : (
            <Link
              to={
                profile?.organizationId
                  ? "/sponsorships/new"
                  : user
                    ? "/organizations/apply"
                    : "/signup"
              }
              state={!user ? { from: "/organizations/apply" } : undefined}
              className={primaryClass}
            >
              {profile?.organizationId
                ? "Post your organization’s need"
                : "Register to post a need"}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
      <ol className="space-y-4 self-center">
        {[
          "Create your free Okoa Food account.",
          "Register your shelter or NGO for administrator review.",
          "After approval, post a need with the item, quantity and collection details.",
        ].map((step, index) => (
          <li
            key={step}
            className="flex items-start gap-3 text-sm text-stone-700 dark:text-stone-200"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white font-bold text-pink-700 dark:bg-pink-950 dark:text-pink-200">
              {profile?.organizationId ? (
                <Check size={16} aria-hidden="true" />
              ) : (
                index + 1
              )}
            </span>
            <span className="pt-1">{step}</span>
          </li>
        ))}
        <li>
          <Link to="/about" className={`${secondaryClass} mt-2`}>
            See how it works
          </Link>
        </li>
      </ol>
    </section>
  );
}
