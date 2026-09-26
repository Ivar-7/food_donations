import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../shared/firebase/client";

export type ImpactTotals = {
  availableDonations: number;
  completedHandoffs: number;
  partnerOrganizations: number;
};

export async function getImpactTotals(): Promise<ImpactTotals> {
  if (!db) throw new Error("Firebase is not configured");

  const donations = collection(db, "donations");
  const [available, completed, partners, sampleDonations, samplePartners] =
    await Promise.all([
      getCountFromServer(query(donations, where("status", "==", "available"))),
      getCountFromServer(query(donations, where("status", "==", "received"))),
      getCountFromServer(collection(db, "organizations")),
      getCountFromServer(
        query(donations, where("donorId", "==", "foodbridge-seed-donor")),
      ),
      getCountFromServer(
        query(
          collection(db, "organizations"),
          where("ownerUserId", "==", "foodbridge-seed-organization"),
        ),
      ),
    ]);

  const totals = {
    availableDonations: Math.max(
      0,
      available.data().count - sampleDonations.data().count,
    ),
    completedHandoffs: completed.data().count,
    partnerOrganizations: Math.max(
      0,
      partners.data().count - samplePartners.data().count,
    ),
  };
  if (
    Object.values(totals).some(
      (value) => !Number.isSafeInteger(value) || value < 0,
    )
  ) {
    throw new Error("Invalid impact totals");
  }
  return totals;
}
