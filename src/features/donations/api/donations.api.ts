import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../shared/firebase/client";
import type { Donation } from "../donation.types";
import { parseDonation, validateDonation } from "../donation.schema";

function requireDb() {
  if (!db) throw new Error("Firebase is not configured");
  return db;
}

export async function getAvailableDonations(): Promise<Donation[]> {
  const snapshot = await getDocs(
    query(
      collection(requireDb(), "donations"),
      where("status", "==", "available"),
    ),
  );
  return snapshot.docs
    .map((item) => parseDonation(item.id, item.data()))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getMyDonations(userId: string): Promise<Donation[]> {
  const snapshot = await getDocs(
    query(collection(requireDb(), "donations"), where("donorId", "==", userId)),
  );
  return snapshot.docs
    .map((item) => parseDonation(item.id, item.data()))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function createDonation(
  donation: Omit<Donation, "id" | "createdAt" | "status">,
) {
  if (
    validateDonation(donation) ||
    !donation.donorId ||
    !donation.donorName.trim()
  )
    throw new Error("Invalid donation form data");
  await addDoc(collection(requireDb(), "donations"), {
    ...donation,
    createdAt: Date.now(),
    status: "available",
  });
}
