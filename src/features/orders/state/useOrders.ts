import { useQuery } from "@tanstack/react-query";
import { firebaseConfigured } from "../../../shared/firebase/client";
import { getMyOrders, getOrder } from "../api/orders.api";
import { ordersKeys } from "./orders.keys";

export function useMyOrders(userId: string | undefined) {
  return useQuery({
    queryKey: ordersKeys.mine(userId ?? ""),
    queryFn: () => getMyOrders(userId!),
    enabled: Boolean(userId) && firebaseConfigured,
  });
}

export function useOrder(orderId: string | undefined) {
  return useQuery({
    queryKey: ordersKeys.detail(orderId ?? ""),
    queryFn: () => getOrder(orderId!),
    enabled: Boolean(orderId) && firebaseConfigured,
  });
}
