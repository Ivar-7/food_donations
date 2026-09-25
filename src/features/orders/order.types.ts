export type OrderStatus = "requested" | "pickup" | "received";

export type Order = {
  id: string;
  donationId: string;
  donationTitle: string;
  donorId: string;
  organizationId: string;
  organizationName: string;
  requestedBy: string;
  pickupCode: string;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
};
