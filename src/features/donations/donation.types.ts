export type Donation = {
  id: string;
  title: string;
  category: "Food" | "Essentials";
  quantity: string;
  location: string;
  description: string;
  status: "available" | "requested" | "pickup" | "received";
  donorId: string;
  donorName: string;
  createdAt: number;
};
