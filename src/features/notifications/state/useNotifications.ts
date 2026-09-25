import { useQuery } from "@tanstack/react-query";
import { firebaseConfigured } from "../../../shared/firebase/client";
import { getNotifications } from "../api/notifications.api";
import { notificationsKeys } from "./notifications.keys";

export function useNotifications(userId: string | undefined) {
  return useQuery({
    queryKey: notificationsKeys.mine(userId ?? ""),
    queryFn: () => getNotifications(userId!),
    enabled: Boolean(userId) && firebaseConfigured,
    refetchInterval: 30_000,
  });
}
