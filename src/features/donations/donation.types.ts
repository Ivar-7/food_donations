export type Donation = {
  id: string;
  title: string;
  category: "Food" | "Essentials";
  quantity: string;
  location: string;
  description: string;
  imageUrl?: string;
  status: "available" | "requested" | "pickup" | "received";
  donorId: string;
  donorName: string;
  createdAt: number;
  orderId?: string;
};

export type DonationFormValues = Pick<
  Donation,
  "title" | "category" | "quantity" | "location" | "description" | "imageUrl"
>;
