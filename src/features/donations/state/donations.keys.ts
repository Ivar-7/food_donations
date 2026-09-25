export const donationsKeys = {
  all: ["donations"] as const,
  available: ["donations", "available"] as const,
  mine: (userId: string) => ["donations", "mine", userId] as const,
};
