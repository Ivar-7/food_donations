import type { Donation, DonationFormValues } from "./donation.types";

const categories = ["Food", "Essentials"] as const;
const statuses = ["available", "requested", "pickup", "received"] as const;

export function validateDonation(data: DonationFormValues): string | null {
  if (data.title.trim().length < 3 || data.title.trim().length > 100)
    return "Use a title between 3 and 100 characters.";
  if (!categories.includes(data.category)) return "Choose a valid category.";
  if (!data.quantity.trim() || data.quantity.trim().length > 80)
    return "Enter a quantity of 80 characters or fewer.";
  if (data.location.trim().length < 2 || data.location.trim().length > 120)
    return "Use a pickup area between 2 and 120 characters.";
  if (
    data.description.trim().length < 10 ||
    data.description.trim().length > 1000
  )
    return "Add a description between 10 and 1000 characters.";
  return null;
}

export function cleanDonation(data: DonationFormValues): DonationFormValues {
  return {
    title: data.title.trim(),
    category: data.category,
    quantity: data.quantity.trim(),
    location: data.location.trim(),
    description: data.description.trim(),
  };
}

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
    !statuses.includes(data.status as Donation["status"]) ||
    typeof data.donorId !== "string" ||
    !data.donorId.trim() ||
    typeof data.donorName !== "string" ||
    !data.donorName.trim() ||
    typeof data.createdAt !== "number" ||
    !Number.isFinite(data.createdAt) ||
    (data.orderId !== undefined && typeof data.orderId !== "string")
  ) {
    throw new Error("Invalid donation data");
  }
  if (
    validateDonation({
      title: data.title,
      category: data.category,
      quantity: data.quantity,
      location: data.location,
      description: data.description,
    })
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
    ...(typeof data.orderId === "string" ? { orderId: data.orderId } : {}),
  };
}
