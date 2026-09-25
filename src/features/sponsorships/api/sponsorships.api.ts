import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  where,
} from "firebase/firestore";
import { db } from "../../../shared/firebase/client";
import { parseOrganization } from "../../organizations/organization.schema";
import {
  parsePledge,
  parseSponsorship,
  validateSponsorship,
} from "../sponsorship.schema";
import type { Pledge, Sponsorship } from "../sponsorship.types";

function requireDb() {
  if (!db) throw new Error("Firebase is not configured");
  return db;
}

export async function getSponsorships(): Promise<Sponsorship[]> {
  const snapshot = await getDocs(
    query(
      collection(requireDb(), "sponsorships"),
      orderBy("createdAt", "desc"),
    ),
  );
  return snapshot.docs.map((item) => parseSponsorship(item.id, item.data()));
}

export async function getMySponsorships(
  userId: string,
): Promise<Sponsorship[]> {
  const snapshot = await getDocs(
    query(
      collection(requireDb(), "sponsorships"),
      where("ownerUserId", "==", userId),
      orderBy("createdAt", "desc"),
    ),
  );
  return snapshot.docs.map((item) => parseSponsorship(item.id, item.data()));
}

export async function getSponsorship(id: string): Promise<Sponsorship | null> {
  const snapshot = await getDoc(doc(requireDb(), "sponsorships", id));
  return snapshot.exists()
    ? parseSponsorship(snapshot.id, snapshot.data())
    : null;
}

export async function getMyPledge(
  id: string,
  userId: string,
): Promise<Pledge | null> {
  const snapshot = await getDoc(
    doc(requireDb(), "sponsorships", id, "pledges", userId),
  );
  return snapshot.exists() ? parsePledge(snapshot.data()) : null;
}

export async function createSponsorship(input: {
  organizationId: string;
  ownerUserId: string;
  title: string;
  description: string;
  unit: string;
  targetQuantity: number;
}) {
  const validation = validateSponsorship(input);
  if (validation) throw new Error("Invalid sponsorship form data");
  const database = requireDb();
  const organizationSnapshot = await getDoc(
    doc(database, "organizations", input.organizationId),
  );
  if (!organizationSnapshot.exists()) throw new Error("Organization not found");
  const organization = parseOrganization(
    organizationSnapshot.id,
    organizationSnapshot.data(),
  );
  if (organization.ownerUserId !== input.ownerUserId)
    throw new Error("Not your organization");
  const reference = await addDoc(collection(database, "sponsorships"), {
    organizationId: input.organizationId,
    organizationName: organization.name,
    ownerUserId: input.ownerUserId,
    title: input.title.trim(),
    description: input.description.trim(),
    unit: input.unit.trim(),
    targetQuantity: input.targetQuantity,
    pledgedQuantity: 0,
    status: "open",
    createdAt: Date.now(),
  });
  return reference.id;
}

export async function pledgeToSponsorship(
  id: string,
  userId: string,
  quantity: number,
) {
  if (!Number.isInteger(quantity) || quantity < 1)
    throw new Error("Invalid pledge quantity");
  const database = requireDb();
  const sponsorshipRef = doc(database, "sponsorships", id);
  const pledgeRef = doc(database, "sponsorships", id, "pledges", userId);
  const notificationRef = doc(
    database,
    "notifications",
    `pledge_received_${id}_${userId}`,
  );
  const now = Date.now();
  await runTransaction(database, async (transaction) => {
    const [sponsorshipSnapshot, pledgeSnapshot] = await Promise.all([
      transaction.get(sponsorshipRef),
      transaction.get(pledgeRef),
    ]);
    if (!sponsorshipSnapshot.exists())
      throw new Error("This need is no longer available.");
    const sponsorship = parseSponsorship(
      sponsorshipSnapshot.id,
      sponsorshipSnapshot.data(),
    );
    if (
      sponsorship.status !== "open" ||
      sponsorship.pledgedQuantity + quantity > sponsorship.targetQuantity
    )
      throw new Error("The requested quantity is no longer available.");
    if (pledgeSnapshot.exists())
      throw new Error("You have already pledged to this need.");
    if (sponsorship.ownerUserId === userId)
      throw new Error("You cannot pledge to your own need.");
    const pledgedQuantity = sponsorship.pledgedQuantity + quantity;
    transaction.set(pledgeRef, { userId, quantity, createdAt: now });
    transaction.update(sponsorshipRef, {
      pledgedQuantity,
      status:
        pledgedQuantity === sponsorship.targetQuantity ? "fulfilled" : "open",
    });
    transaction.set(notificationRef, {
      recipientId: sponsorship.ownerUserId,
      actorId: userId,
      type: "pledge_received",
      sourceId: id,
      createdAt: now,
      readAt: null,
    });
  });
}
