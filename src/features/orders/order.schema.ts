import type { Order, OrderStatus } from "./order.types";

const statuses: OrderStatus[] = ["requested", "pickup", "received"];

export function parseOrder(id: string, data: Record<string, unknown>): Order {
  if (
    typeof data.donationId !== "string" ||
    data.donationId !== id ||
    typeof data.donationTitle !== "string" ||
    typeof data.donorId !== "string" ||
    typeof data.organizationId !== "string" ||
    typeof data.organizationName !== "string" ||
    typeof data.requestedBy !== "string" ||
    typeof data.pickupCode !== "string" ||
    !/^\d{6}$/.test(data.pickupCode) ||
    !statuses.includes(data.status as OrderStatus) ||
    typeof data.createdAt !== "number" ||
    !Number.isFinite(data.createdAt) ||
    typeof data.updatedAt !== "number" ||
    !Number.isFinite(data.updatedAt)
  )
    throw new Error("Invalid order data");
  return {
    id,
    donationId: data.donationId,
    donationTitle: data.donationTitle,
    donorId: data.donorId,
    organizationId: data.organizationId,
    organizationName: data.organizationName,
    requestedBy: data.requestedBy,
    pickupCode: data.pickupCode,
    status: data.status as OrderStatus,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}
