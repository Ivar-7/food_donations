export const ordersKeys = {
  all: ["orders"] as const,
  mine: (userId: string) => ["orders", "mine", userId] as const,
  detail: (orderId: string) => ["orders", "detail", orderId] as const,
};
