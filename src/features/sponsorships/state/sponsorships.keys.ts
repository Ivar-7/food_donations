export const sponsorshipsKeys = {
  all: ["sponsorships"] as const,
  detail: (id: string) => ["sponsorships", "detail", id] as const,
  mine: (userId: string) => ["sponsorships", "mine", userId] as const,
  pledge: (id: string, userId: string) =>
    ["sponsorships", "pledge", id, userId] as const,
};
