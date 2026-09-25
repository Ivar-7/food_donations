import {
  collection,
  deleteField,
  doc,
  getDocs,
  query,
  runTransaction,
  where,
} from "firebase/firestore";
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

export class ApplicationConflictError extends Error {}

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

export async function getPendingApplications(): Promise<
  OrganizationApplication[]
> {
  const snapshot = await getDocs(
    query(
      collection(requireDb(), "organizationApplications"),
      where("status", "==", "pending"),
    ),
  );
  return snapshot.docs
    .map((item) => parseOrganizationApplication(item.id, item.data()))
    .sort((a, b) => a.createdAt - b.createdAt);
}

export async function applyForOrganization(
  application: Omit<
    OrganizationApplication,
    "id" | "status" | "createdAt" | "reviewedAt" | "reviewerId"
  >,
) {
  if (
    validateOrganizationApplication(application) ||
    !application.userId ||
    !["Shelter", "NGO"].includes(application.type)
  )
    throw new Error("Invalid organization application form data");
  const database = requireDb();
  // Earlier applications used random document IDs. Include those when deciding
  // whether this account already has an active application.
  const existing = await getMyApplications(application.userId);
  if (existing.some((item) => item.status !== "rejected"))
    throw new ApplicationConflictError(
      "You already have a pending or approved application.",
    );

  const applicationRef = doc(
    database,
    "organizationApplications",
    application.userId,
  );
  const userRef = doc(database, "users", application.userId);
  await runTransaction(database, async (transaction) => {
    const [current, user] = await Promise.all([
      transaction.get(applicationRef),
      transaction.get(userRef),
    ]);
    if (!user.exists() || user.data().organizationId)
      throw new ApplicationConflictError(
        "Your account is already linked to an organization.",
      );
    if (current.exists() && current.data().status !== "rejected")
      throw new ApplicationConflictError(
        "You already have a pending or approved application.",
      );

    const now = Date.now();
    if (current.exists()) {
      transaction.update(applicationRef, {
        ...application,
        status: "pending",
        createdAt: now,
        reviewedAt: deleteField(),
        reviewerId: deleteField(),
      });
    } else {
      transaction.set(applicationRef, {
        ...application,
        status: "pending",
        createdAt: now,
      });
    }
  });
}

export async function reviewOrganizationApplication(
  applicationId: string,
  adminUid: string,
  decision: "approved" | "rejected",
) {
  const database = requireDb();
  const applicationRef = doc(
    database,
    "organizationApplications",
    applicationId,
  );
  await runTransaction(database, async (transaction) => {
    const applicationSnapshot = await transaction.get(applicationRef);
    if (!applicationSnapshot.exists())
      throw new ApplicationConflictError(
        "This application is no longer available.",
      );
    const application = parseOrganizationApplication(
      applicationSnapshot.id,
      applicationSnapshot.data(),
    );
    if (application.status !== "pending")
      throw new ApplicationConflictError(
        "This application has already been reviewed.",
      );

    const userRef = doc(database, "users", application.userId);
    const organizationRef = doc(database, "organizations", applicationId);
    const notificationRef = doc(
      database,
      "notifications",
      `application_${decision}_${applicationId}_${application.createdAt}`,
    );
    const [userSnapshot, organizationSnapshot] = await Promise.all([
      transaction.get(userRef),
      transaction.get(organizationRef),
    ]);
    if (!userSnapshot.exists() || userSnapshot.data().organizationId)
      throw new ApplicationConflictError(
        "This applicant's account is unavailable or already linked to an organization.",
      );
    if (organizationSnapshot.exists())
      throw new ApplicationConflictError(
        "This application has already been processed.",
      );

    const now = Date.now();
    transaction.update(applicationRef, {
      status: decision,
      reviewedAt: now,
      reviewerId: adminUid,
    });
    if (decision === "approved") {
      transaction.set(organizationRef, {
        name: application.name,
        type: application.type,
        location: application.location,
        description: application.description,
        ownerUserId: application.userId,
        createdAt: now,
      });
      transaction.update(userRef, { organizationId: applicationId });
    }
    transaction.set(notificationRef, {
      recipientId: application.userId,
      actorId: adminUid,
      type:
        decision === "approved"
          ? "application_approved"
          : "application_rejected",
      sourceId: applicationId,
      createdAt: now,
      readAt: null,
    });
  });
}
