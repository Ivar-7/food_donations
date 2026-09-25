import type { Pledge, Sponsorship } from "./sponsorship.types";

export function validateSponsorship(data: {
  title: string;
  description: string;
  unit: string;
  targetQuantity: number;
}): string | null {
  if (data.title.trim().length < 3 || data.title.trim().length > 100)
    return "Enter a title between 3 and 100 characters.";
  if (
    data.description.trim().length < 20 ||
    data.description.trim().length > 1000
  )
    return "Describe the need in 20 to 1,000 characters.";
  if (data.unit.trim().length < 2 || data.unit.trim().length > 40)
    return "Enter a clear unit, such as bags or boxes.";
  if (
    !Number.isInteger(data.targetQuantity) ||
    data.targetQuantity < 1 ||
    data.targetQuantity > 10000
  )
    return "Enter a target between 1 and 10,000 units.";
  return null;
}

export function parseSponsorship(
  id: string,
  data: Record<string, unknown>,
): Sponsorship {
  if (
    typeof data.organizationId !== "string" ||
    typeof data.organizationName !== "string" ||
    typeof data.ownerUserId !== "string" ||
    typeof data.title !== "string" ||
    typeof data.description !== "string" ||
    typeof data.unit !== "string" ||
    typeof data.targetQuantity !== "number" ||
    typeof data.pledgedQuantity !== "number" ||
    !Number.isInteger(data.targetQuantity) ||
    !Number.isInteger(data.pledgedQuantity) ||
    data.targetQuantity < 1 ||
    data.pledgedQuantity < 0 ||
    data.pledgedQuantity > data.targetQuantity ||
    (data.status !== "open" && data.status !== "fulfilled") ||
    typeof data.createdAt !== "number" ||
    !Number.isFinite(data.createdAt)
  )
    throw new Error("Invalid sponsorship data");
  return {
    id,
    organizationId: data.organizationId,
    organizationName: data.organizationName,
    ownerUserId: data.ownerUserId,
    title: data.title,
    description: data.description,
    unit: data.unit,
    targetQuantity: data.targetQuantity,
    pledgedQuantity: data.pledgedQuantity,
    status: data.status,
    createdAt: data.createdAt,
  };
}

export function parsePledge(data: Record<string, unknown>): Pledge {
  if (
    typeof data.userId !== "string" ||
    typeof data.quantity !== "number" ||
    !Number.isInteger(data.quantity) ||
    data.quantity < 1 ||
    typeof data.createdAt !== "number" ||
    !Number.isFinite(data.createdAt)
  )
    throw new Error("Invalid pledge data");
  return {
    userId: data.userId,
    quantity: data.quantity,
    createdAt: data.createdAt,
  };
}
