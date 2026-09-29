import { useQuery } from "@tanstack/react-query";
import { firebaseConfigured } from "../../../shared/firebase/client";
import { getMyFeedback } from "../api/feedback.api";
import { feedbackKeys } from "./feedback.keys";
export function useFeedback(userId: string | undefined) {
  return useQuery({
    queryKey: feedbackKeys.mine(userId ?? ""),
    queryFn: () => getMyFeedback(userId!),
    enabled: Boolean(userId) && firebaseConfigured,
  });
}
