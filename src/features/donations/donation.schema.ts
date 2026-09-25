import type { Donation } from "./donation.types";

export function parseDonation(
  id: string,
  data: Record<string, unknown>,
): Donation {
  if (
    typeof data.title !== "string" ||
    (data.category !== "Food" && data.category !== "Essentials") ||
    typeof data.quantity !== "string" ||
    typeof data.location !== "string" ||
    typeof data.description !== "string" ||
    !["available", "requested", "pickup", "received"].includes(
      String(data.status),
    ) ||
    typeof data.donorId !== "string" ||
    typeof data.donorName !== "string" ||
    typeof data.createdAt !== "number" ||
    !Number.isFinite(data.createdAt)
  ) {
    throw new Error("Invalid donation data");
  }
  return {
    id,
    title: data.title,
    category: data.category,
    quantity: data.quantity,
    location: data.location,
    description: data.description,
    status: data.status as Donation["status"],
    donorId: data.donorId,
    donorName: data.donorName,
    createdAt: data.createdAt,
  };
}

export function validateDonation(data: {
  title: string;
  quantity: string;
  location: string;
  description: string;
}): string | null {
  if (data.title.trim().length < 3)
    return "Give your donation a descriptive title.";
  if (!data.quantity.trim()) return "Enter the amount available.";
  if (data.location.trim().length < 2) return "Enter a pickup area.";
  if (data.description.trim().length < 10)
    return "Add a description of at least 10 characters.";
  return null;
}
