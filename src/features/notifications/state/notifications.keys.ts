export const notificationsKeys = {
  all: ["notifications"] as const,
  mine: (userId: string) => ["notifications", userId] as const,
};
