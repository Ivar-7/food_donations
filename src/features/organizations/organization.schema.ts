import type {
  Organization,
  OrganizationApplication,
} from "./organization.types";
import { isImageUrl } from "../../shared/utils/imageUrl";

export function validateOrganizationApplication(data: {
  name: string;
  location: string;
  description: string;
  contactEmail: string;
}): string | null {
  if (
    data.name.trim().length < 3 ||
    data.name.trim().length > 120 ||
    data.location.trim().length < 2 ||
    data.location.trim().length > 120 ||
    data.description.trim().length < 20 ||
    data.description.trim().length > 1500
  )
    return "Complete every field. The description needs at least 20 characters.";
  if (
    data.contactEmail.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail.trim())
  )
    return "Enter a valid contact email.";
  return null;
}

export function parseOrganization(
  id: string,
  data: Record<string, unknown>,
): Organization {
  if (
    typeof data.name !== "string" ||
    (data.type !== "Shelter" && data.type !== "NGO") ||
    typeof data.location !== "string" ||
    typeof data.description !== "string" ||
    (data.imageUrl !== undefined &&
      (typeof data.imageUrl !== "string" || !isImageUrl(data.imageUrl))) ||
    typeof data.ownerUserId !== "string" ||
    typeof data.createdAt !== "number" ||
    !Number.isFinite(data.createdAt)
  )
    throw new Error("Invalid organization data");
  return {
    id,
    name: data.name,
    type: data.type,
    location: data.location,
    description: data.description,
    ...(typeof data.imageUrl === "string" ? { imageUrl: data.imageUrl } : {}),
    ownerUserId: data.ownerUserId,
    createdAt: data.createdAt,
  };
}

export function parseOrganizationApplication(
  id: string,
  data: Record<string, unknown>,
): OrganizationApplication {
  if (
    typeof data.userId !== "string" ||
    typeof data.name !== "string" ||
    (data.type !== "Shelter" && data.type !== "NGO") ||
    typeof data.location !== "string" ||
    typeof data.description !== "string" ||
    typeof data.contactEmail !== "string" ||
    !["pending", "approved", "rejected"].includes(String(data.status)) ||
    typeof data.createdAt !== "number" ||
    !Number.isFinite(data.createdAt) ||
    (data.reviewedAt !== undefined &&
      (typeof data.reviewedAt !== "number" ||
        !Number.isFinite(data.reviewedAt))) ||
    (data.reviewerId !== undefined && typeof data.reviewerId !== "string")
  )
    throw new Error("Invalid organization application data");
  return {
    id,
    userId: data.userId,
    name: data.name,
    type: data.type,
    location: data.location,
    description: data.description,
    contactEmail: data.contactEmail,
    status: data.status as OrganizationApplication["status"],
    createdAt: data.createdAt,
    ...(typeof data.reviewedAt === "number" && {
      reviewedAt: data.reviewedAt,
    }),
    ...(typeof data.reviewerId === "string" && {
      reviewerId: data.reviewerId,
    }),
  };
}
