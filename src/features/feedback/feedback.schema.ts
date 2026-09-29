import {
  feedbackCategories,
  type Feedback,
  type FeedbackInput,
} from "./feedback.types";

export function validateFeedback(input: FeedbackInput): string | null {
  if (!feedbackCategories.includes(input.category))
    return "Choose a feedback category.";
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5)
    return "Choose a rating from 1 to 5.";
  if (input.message.trim().length < 10 || input.message.trim().length > 2000)
    return "Write between 10 and 2,000 characters.";
  return null;
}

export function parseFeedback(
  id: string,
  data: Record<string, unknown>,
): Feedback {
  if (
    typeof data.category !== "string" ||
    !feedbackCategories.some((category) => category === data.category) ||
    typeof data.rating !== "number" ||
    typeof data.message !== "string" ||
    typeof data.userId !== "string" ||
    typeof data.createdAt !== "number" ||
    !Number.isFinite(data.createdAt)
  )
    throw new Error("Invalid feedback data");
  const input = {
    category: data.category as FeedbackInput["category"],
    rating: data.rating,
    message: data.message,
  };
  if (validateFeedback(input)) throw new Error("Invalid feedback data");
  return { ...input, id, userId: data.userId, createdAt: data.createdAt };
}
