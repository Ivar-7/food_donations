export const organizationsKeys = {
  all: ["organizations"] as const,
  applications: (userId: string) => ["applications", userId] as const,
  pendingApplications: ["organizations", "applications", "pending"] as const,
};
