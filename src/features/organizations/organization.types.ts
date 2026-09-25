export type Organization = {
  id: string;
  name: string;
  type: "Shelter" | "NGO";
  location: string;
  description: string;
  ownerUserId: string;
  createdAt: number;
};
export type OrganizationApplication = {
  id: string;
  userId: string;
  name: string;
  type: "Shelter" | "NGO";
  location: string;
  description: string;
  contactEmail: string;
  status: "pending" | "approved" | "rejected";
  createdAt: number;
};
