import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Send, Star } from "lucide-react";
import { submitFeedback } from "../api/feedback.api";
import { validateFeedback } from "../feedback.schema";
import { feedbackCategories, type FeedbackCategory } from "../feedback.types";
import { feedbackKeys } from "../state/feedback.keys";
import { toAppError } from "../../../shared/errors/appError";
import { fieldClass, Notice, primaryClass } from "../../../shared/ui/Elements";

export default function FeedbackForm({ userId }: { userId: string }) {
  const client = useQueryClient();
  const [category, setCategory] = useState<FeedbackCategory>("Suggestion");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setSuccess(false);
    const input = { category, rating, message };
    const validation = validateFeedback(input);
    if (validation) {
      setError(validation);
      return;
    }
    setError("");
    setPending(true);
    try {
      await submitFeedback(userId, input);
      setSuccess(true);
      setMessage("");
      setRating(0);
      await client.invalidateQueries({ queryKey: feedbackKeys.mine(userId) });
    } catch (cause) {
      setError(toAppError(cause).message);
    } finally {
      setPending(false);
    }
  }
  return (
    <form
      onSubmit={(event) => void submit(event)}
      className="space-y-6 rounded-3xl border border-pink-100 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-8"
    >
      <fieldset disabled={pending} className="space-y-6">
        <legend className="font-display text-2xl">
          How has your experience been?
        </legend>
        <fieldset className="mt-4">
          <legend className="text-sm font-semibold">Your rating</legend>
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className="cursor-pointer">
                <input
                  className="peer sr-only"
                  type="radio"
                  name="rating"
                  value={value}
                  checked={rating === value}
                  onChange={() => setRating(value)}
                  aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
                />
                <span
                  className={`flex size-12 items-center justify-center rounded-2xl border peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-pink-600 ${rating >= value ? "border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-800 dark:bg-pink-950 dark:text-pink-300" : "border-stone-200 text-stone-400 dark:border-stone-700"}`}
                >
                  <Star
                    size={24}
                    fill={rating >= value ? "currentColor" : "none"}
                    aria-hidden="true"
                  />
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block text-sm font-semibold">
          What would you like to share?
          <select
            className={`${fieldClass} mt-2`}
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as FeedbackCategory)
            }
          >
            {feedbackCategories.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Your message
          <textarea
            required
            minLength={10}
            maxLength={2000}
            rows={6}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className={`${fieldClass} mt-2`}
            placeholder="Tell us what worked well or what we can improve…"
            aria-describedby="feedback-help"
          />
        </label>
        <p
          id="feedback-help"
          className="text-sm text-stone-500 dark:text-stone-400"
        >
          Please leave out passwords and sensitive personal details.{" "}
          {message.length}/2,000 characters.
        </p>
        <button type="submit" disabled={pending} className={primaryClass}>
          {pending ? "Sending…" : "Send feedback"}
          <Send size={16} aria-hidden="true" />
        </button>
      </fieldset>
      {error && <Notice error>{error}</Notice>}
      {success && <Notice>Thank you! Your feedback has been received.</Notice>}
    </form>
  );
}
