export type Sponsorship = {
  id: string;
  organizationId: string;
  organizationName: string;
  ownerUserId: string;
  title: string;
  description: string;
  unit: string;
  targetQuantity: number;
  pledgedQuantity: number;
  status: "open" | "fulfilled";
  createdAt: number;
};

export type Pledge = {
  userId: string;
  quantity: number;
  createdAt: number;
};
