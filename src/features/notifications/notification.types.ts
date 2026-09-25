export type NotificationType =
  | "application_approved"
  | "application_rejected"
  | "order_requested"
  | "order_pickup"
  | "order_received"
  | "pledge_received";

export type Notification = {
  id: string;
  recipientId: string;
  actorId: string;
  type: NotificationType;
  sourceId: string;
  createdAt: number;
  readAt: number | null;
};
