import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../../shared/firebase/client";
import type { Donation, DonationFormValues } from "../donation.types";
import {
  cleanDonation,
  parseDonation,
  validateDonation,
} from "../donation.schema";

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

export async function getDonation(id: string): Promise<Donation | null> {
  if (!id) return null;
  const snapshot = await getDoc(doc(requireDb(), "donations", id));
  return snapshot.exists() ? parseDonation(snapshot.id, snapshot.data()) : null;
}

function requireOwner(ownerId: string) {
  if (!auth?.currentUser || auth.currentUser.uid !== ownerId)
    throw new Error("You must own this donation.");
}

export async function createDonation(
  form: DonationFormValues,
  donorId: string,
  donorName: string,
): Promise<string> {
  requireOwner(donorId);
  const cleaned = cleanDonation(form);
  if (validateDonation(cleaned) || !donorName.trim())
    throw new Error("Invalid donation form data");
  const reference = await addDoc(collection(requireDb(), "donations"), {
    ...cleaned,
    donorId,
    donorName: donorName.trim(),
    createdAt: Date.now(),
    status: "available",
  });
  return reference.id;
}

export async function updateDonation(
  id: string,
  ownerId: string,
  form: DonationFormValues,
): Promise<void> {
  requireOwner(ownerId);
  const cleaned = cleanDonation(form);
  if (validateDonation(cleaned)) throw new Error("Invalid donation form data");
  const reference = doc(requireDb(), "donations", id);
  const existing = await getDoc(reference);
  if (!existing.exists()) throw new Error("Donation no longer exists.");
  const current = parseDonation(existing.id, existing.data());
  if (current.donorId !== ownerId || current.status !== "available")
    throw new Error("This donation cannot be edited.");
  await updateDoc(reference, cleaned);
}

export async function deleteDonation(
  id: string,
  ownerId: string,
): Promise<void> {
  requireOwner(ownerId);
  const reference = doc(requireDb(), "donations", id);
  const existing = await getDoc(reference);
  if (!existing.exists()) throw new Error("Donation no longer exists.");
  const current = parseDonation(existing.id, existing.data());
  if (current.donorId !== ownerId || current.status !== "available")
    throw new Error("This donation cannot be deleted.");
  await deleteDoc(reference);
}
