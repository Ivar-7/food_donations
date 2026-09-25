import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../shared/firebase/client";
import { parseNotification } from "../notification.schema";
import type { Notification } from "../notification.types";

function requireDb() {
  if (!db) throw new Error("Firebase is not configured");
  return db;
}

export async function getNotifications(
  userId: string,
): Promise<Notification[]> {
  const snapshot = await getDocs(
    query(
      collection(requireDb(), "notifications"),
      where("recipientId", "==", userId),
      orderBy("createdAt", "desc"),
    ),
  );
  return snapshot.docs.map((item) => parseNotification(item.id, item.data()));
}

export async function markNotificationRead(id: string) {
  await updateDoc(doc(requireDb(), "notifications", id), {
    readAt: Date.now(),
  });
}
