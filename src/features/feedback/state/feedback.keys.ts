export const feedbackKeys = {
  mine: (userId: string) => ["feedback", userId] as const,
};
