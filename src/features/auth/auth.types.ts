export type UserProfile = {
  username: string;
  email: string;
  role: "user" | "admin";
  organizationId?: string;
  createdAt: number;
};
