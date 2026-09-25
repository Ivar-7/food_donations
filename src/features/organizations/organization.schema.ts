import type {
  Organization,
  OrganizationApplication,
} from "./organization.types";

export function validateOrganizationApplication(data: {
  name: string;
  location: string;
  description: string;
  contactEmail: string;
}): string | null {
  if (
    data.name.trim().length < 3 ||
    data.location.trim().length < 2 ||
    data.description.trim().length < 20
  )
    return "Complete every field. The description needs at least 20 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail.trim()))
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
    !Number.isFinite(data.createdAt)
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
  };
}
