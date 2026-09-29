import { Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../app/authContext";
import { firebaseConfigured } from "../../../shared/firebase/client";
import { toAppError } from "../../../shared/errors/appError";
import { Notice, PageHeader, primaryClass } from "../../../shared/ui/Elements";
import FeedbackForm from "../components/FeedbackForm";
import { useFeedback } from "../state/useFeedback";

export default function FeedbackPage() {
  const { user, loading } = useAuth();
  const feedback = useFeedback(user?.uid);
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:py-16">
      <PageHeader
        eyebrow="Made better together"
        title="We’re listening."
        description="Your ideas, experiences and little moments of kindness help us make Okoa Food better for everyone."
      />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {!firebaseConfigured ? (
            <Notice error>
              Feedback is currently unavailable. Please try again later.
            </Notice>
          ) : loading ? (
            <p role="status">Loading your account…</p>
          ) : user ? (
            <FeedbackForm userId={user.uid} />
          ) : (
            <div className="rounded-3xl border border-pink-100 bg-white p-8 dark:border-stone-800 dark:bg-stone-900">
              <MessageCircle
                className="text-pink-600 dark:text-pink-300"
                size={32}
              />
              <h2 className="mt-5 font-display text-3xl">
                A place for your voice
              </h2>
              <p className="mt-3 text-stone-600 dark:text-stone-400">
                Sign in to send feedback and keep track of what you’ve shared.
              </p>
              <Link
                className={`${primaryClass} mt-6`}
                to="/login"
                state={{ from: "/feedback" }}
              >
                Log in to share feedback
              </Link>
            </div>
          )}
          {user && (
            <section className="mt-8">
              <h2 className="mb-4 font-display text-2xl">Your feedback</h2>
              {feedback.isPending ? (
                <p role="status">Loading your feedback…</p>
              ) : feedback.error ? (
                <Notice error>{toAppError(feedback.error).message}</Notice>
              ) : feedback.data?.length ? (
                <div className="space-y-3">
                  {feedback.data.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900"
                    >
                      <div className="flex flex-wrap justify-between gap-2 text-sm">
                        <span className="font-semibold text-pink-700 dark:text-pink-300">
                          {item.category} · {item.rating}/5 stars
                        </span>
                        <time
                          dateTime={new Date(item.createdAt).toISOString()}
                          className="text-stone-500 dark:text-stone-400"
                        >
                          {new Date(item.createdAt).toLocaleDateString()}
                        </time>
                      </div>
                      <p className="mt-3 whitespace-pre-wrap break-words text-sm text-stone-600 dark:text-stone-300">
                        {item.message}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl bg-pink-100/50 p-5 text-sm text-stone-600 dark:bg-pink-950 dark:text-stone-300">
                  Your feedback will appear here after you send it.
                </p>
              )}
            </section>
          )}
        </div>
        <aside className="self-start rounded-3xl bg-pink-100/60 p-8 dark:bg-pink-900/30">
          <Heart className="text-pink-600 dark:text-pink-300" size={30} />
          <h2 className="mt-5 font-display text-2xl">Every voice matters</h2>
          <p className="mt-3 leading-relaxed text-stone-600 dark:text-stone-300">
            Found something confusing? Have an idea for your community? We’d
            love to hear it.
          </p>
          <p className="mt-5 text-sm text-stone-500 dark:text-stone-400">
            Your feedback is visible to you and site administrators.
          </p>
          <Link
            to="/about"
            className="mt-6 inline-block text-sm font-bold text-pink-700 underline dark:text-pink-300"
          >
            Learn how Okoa Food works
          </Link>
        </aside>
      </div>
    </div>
  );
}
