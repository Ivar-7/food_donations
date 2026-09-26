import {
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
import { parseDonation } from "../../donations/donation.schema";
import { parseOrganization } from "../../organizations/organization.schema";
import { parseOrder } from "../order.schema";
import type { Order } from "../order.types";

function requireDb() {
  if (!db) throw new Error("Firebase is not configured");
  return db;
}

function pickupCode() {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return String(bytes[0] % 1_000_000).padStart(6, "0");
}

export async function getOrder(orderId: string): Promise<Order | null> {
  const snapshot = await getDoc(doc(requireDb(), "orders", orderId));
  return snapshot.exists() ? parseOrder(snapshot.id, snapshot.data()) : null;
}

export async function getMyOrders(userId: string): Promise<Order[]> {
  const database = requireDb();
  const [donor, organization] = await Promise.all([
    getDocs(
      query(
        collection(database, "orders"),
        where("donorId", "==", userId),
        orderBy("createdAt", "desc"),
      ),
    ),
    getDocs(
      query(
        collection(database, "orders"),
        where("requestedBy", "==", userId),
        orderBy("createdAt", "desc"),
      ),
    ),
  ]);
  const items = new Map<string, Order>();
  for (const snapshot of [...donor.docs, ...organization.docs])
    items.set(snapshot.id, parseOrder(snapshot.id, snapshot.data()));
  return [...items.values()].sort((a, b) => b.createdAt - a.createdAt);
}

export async function requestDonation(
  donationId: string,
  requesterId: string,
  organizationId: string,
) {
  const database = requireDb();
  const donationRef = doc(database, "donations", donationId);
  const orderRef = doc(database, "orders", donationId);
  const organizationRef = doc(database, "organizations", organizationId);
  const notificationRef = doc(
    database,
    "notifications",
    `order_requested_${donationId}`,
  );
  const code = pickupCode();
  const now = Date.now();
  await runTransaction(database, async (transaction) => {
    const [donationSnapshot, orderSnapshot, organizationSnapshot] =
      await Promise.all([
        transaction.get(donationRef),
        transaction.get(orderRef),
        transaction.get(organizationRef),
      ]);
    if (!donationSnapshot.exists() || !organizationSnapshot.exists())
      throw new Error("This listing or organization is no longer available.");
    const donation = parseDonation(
      donationSnapshot.id,
      donationSnapshot.data(),
    );
    const organization = parseOrganization(
      organizationSnapshot.id,
      organizationSnapshot.data(),
    );
    if (donation.status !== "available" || orderSnapshot.exists())
      throw new Error("This donation has already been requested.");
    if (
      organization.ownerUserId !== requesterId ||
      donation.donorId === requesterId ||
      donation.donorId === "foodbridge-seed-donor"
    )
      throw new Error("You cannot request this donation.");
    transaction.update(donationRef, {
      status: "requested",
      orderId: donationId,
    });
    transaction.set(orderRef, {
      donationId,
      donationTitle: donation.title,
      donorId: donation.donorId,
      organizationId,
      organizationName: organization.name,
      requestedBy: requesterId,
      pickupCode: code,
      status: "requested",
      createdAt: now,
      updatedAt: now,
    });
    transaction.set(notificationRef, {
      recipientId: donation.donorId,
      actorId: requesterId,
      type: "order_requested",
      sourceId: donationId,
      createdAt: now,
      readAt: null,
    });
  });
  return donationId;
}

async function advanceOrder(
  orderId: string,
  actorId: string,
  from: "requested" | "pickup",
  to: "pickup" | "received",
  notificationType: "order_pickup" | "order_received",
) {
  const database = requireDb();
  const orderRef = doc(database, "orders", orderId);
  const donationRef = doc(database, "donations", orderId);
  const notificationRef = doc(
    database,
    "notifications",
    `${notificationType}_${orderId}`,
  );
  const now = Date.now();
  await runTransaction(database, async (transaction) => {
    const [orderSnapshot, donationSnapshot] = await Promise.all([
      transaction.get(orderRef),
      transaction.get(donationRef),
    ]);
    if (!orderSnapshot.exists() || !donationSnapshot.exists())
      throw new Error("This request is no longer available.");
    const order = parseOrder(orderSnapshot.id, orderSnapshot.data());
    const donation = parseDonation(
      donationSnapshot.id,
      donationSnapshot.data(),
    );
    if (order.status !== from || donation.status !== from)
      throw new Error("This request has already moved to another step.");
    if (from === "requested" && order.donorId !== actorId)
      throw new Error("Only the donor can confirm handoff.");
    if (from === "pickup" && order.requestedBy !== actorId)
      throw new Error("Only the requesting organization can confirm receipt.");
    transaction.update(orderRef, { status: to, updatedAt: now });
    transaction.update(donationRef, { status: to });
    transaction.set(notificationRef, {
      recipientId: to === "pickup" ? order.requestedBy : order.donorId,
      actorId,
      type: notificationType,
      sourceId: orderId,
      createdAt: now,
      readAt: null,
    });
  });
}

export function markHandoff(orderId: string, donorId: string) {
  return advanceOrder(orderId, donorId, "requested", "pickup", "order_pickup");
}

export function confirmReceipt(orderId: string, requesterId: string) {
  return advanceOrder(
    orderId,
    requesterId,
    "pickup",
    "received",
    "order_received",
  );
}
