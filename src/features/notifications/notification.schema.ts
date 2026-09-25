import type { Notification, NotificationType } from "./notification.types";

const types: NotificationType[] = [
  "application_approved",
  "application_rejected",
  "order_requested",
  "order_pickup",
  "order_received",
  "pledge_received",
];

export function parseNotification(
  id: string,
  data: Record<string, unknown>,
): Notification {
  if (
    typeof data.recipientId !== "string" ||
    typeof data.actorId !== "string" ||
    !types.includes(data.type as NotificationType) ||
    typeof data.sourceId !== "string" ||
    typeof data.createdAt !== "number" ||
    !Number.isFinite(data.createdAt) ||
    (data.readAt !== null &&
      (typeof data.readAt !== "number" || !Number.isFinite(data.readAt)))
  )
    throw new Error("Invalid notification data");
  return {
    id,
    recipientId: data.recipientId,
    actorId: data.actorId,
    type: data.type as NotificationType,
    sourceId: data.sourceId,
    createdAt: data.createdAt,
    readAt: data.readAt,
  };
}

export function notificationText(item: Notification) {
  switch (item.type) {
    case "application_approved":
      return "Your organization application was approved.";
    case "application_rejected":
      return "Your organization application was not approved. You can review and resubmit it.";
    case "order_requested":
      return "An organization requested your donation.";
    case "order_pickup":
      return "The donor confirmed the handoff. Please confirm receipt.";
    case "order_received":
      return "The organization confirmed receipt of your donation.";
    case "pledge_received":
      return "Someone pledged items toward your community need.";
  }
}

export function notificationLink(item: Notification) {
  if (item.type.startsWith("application_")) return "/dashboard";
  if (item.type.startsWith("order_")) return `/orders/${item.sourceId}`;
  return `/sponsorships/${item.sourceId}`;
}
