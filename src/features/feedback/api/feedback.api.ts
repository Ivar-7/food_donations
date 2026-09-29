import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../shared/firebase/client";
import { parseFeedback, validateFeedback } from "../feedback.schema";
import type { FeedbackInput } from "../feedback.types";

function requireDb() {
  if (!db) throw new Error("Firebase is not configured");
  return db;
}
export async function submitFeedback(userId: string, input: FeedbackInput) {
  if (!userId || validateFeedback(input))
    throw new Error("Invalid feedback form data");
  await addDoc(collection(requireDb(), "feedback"), {
    ...input,
    message: input.message.trim(),
    userId,
    createdAt: Date.now(),
  });
}
export async function getMyFeedback(userId: string) {
  const snapshot = await getDocs(
    query(collection(requireDb(), "feedback"), where("userId", "==", userId)),
  );
  return snapshot.docs
    .map((item) => parseFeedback(item.id, item.data()))
    .sort((a, b) => b.createdAt - a.createdAt);
}
