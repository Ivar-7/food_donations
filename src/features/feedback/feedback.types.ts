export const feedbackCategories = [
  "Suggestion",
  "Problem",
  "Appreciation",
] as const;
export type FeedbackCategory = (typeof feedbackCategories)[number];
export type FeedbackInput = {
  category: FeedbackCategory;
  rating: number;
  message: string;
};
export type Feedback = FeedbackInput & {
  id: string;
  userId: string;
  createdAt: number;
};
