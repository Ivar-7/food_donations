import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../shared/firebase/client";
import type {
  Organization,
  OrganizationApplication,
} from "../organization.types";
import {
  parseOrganization,
  parseOrganizationApplication,
  validateOrganizationApplication,
} from "../organization.schema";

function requireDb() {
  if (!db) throw new Error("Firebase is not configured");
  return db;
}

export async function getOrganizations(): Promise<Organization[]> {
  const snapshot = await getDocs(collection(requireDb(), "organizations"));
  return snapshot.docs
    .map((item) => parseOrganization(item.id, item.data()))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getMyApplications(
  userId: string,
): Promise<OrganizationApplication[]> {
  const snapshot = await getDocs(
    query(
      collection(requireDb(), "organizationApplications"),
      where("userId", "==", userId),
    ),
  );
  return snapshot.docs
    .map((item) => parseOrganizationApplication(item.id, item.data()))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function applyForOrganization(
  application: Omit<OrganizationApplication, "id" | "status" | "createdAt">,
) {
  if (
    validateOrganizationApplication(application) ||
    !application.userId ||
    !["Shelter", "NGO"].includes(application.type)
  )
    throw new Error("Invalid organization application form data");
  await addDoc(collection(requireDb(), "organizationApplications"), {
    ...application,
    status: "pending",
    createdAt: Date.now(),
  });
}
