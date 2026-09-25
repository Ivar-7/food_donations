import { useQuery } from "@tanstack/react-query";
import { firebaseConfigured } from "../../../shared/firebase/client";
import {
  getAvailableDonations,
  getDonation,
  getMyDonations,
} from "../api/donations.api";
import { donationsKeys } from "./donations.keys";

export function useAvailableDonations() {
  return useQuery({
    queryKey: donationsKeys.available,
    queryFn: getAvailableDonations,
    enabled: firebaseConfigured,
  });
}

export function useMyDonations(userId: string | undefined) {
  return useQuery({
    queryKey: donationsKeys.mine(userId ?? ""),
    queryFn: () => getMyDonations(userId!),
    enabled: Boolean(userId) && firebaseConfigured,
  });
}

export function useDonation(id: string | undefined) {
  return useQuery({
    queryKey: donationsKeys.detail(id ?? ""),
    queryFn: () => getDonation(id!),
    enabled: Boolean(id) && firebaseConfigured,
  });
}
