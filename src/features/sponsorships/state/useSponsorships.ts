import { useQuery } from "@tanstack/react-query";
import { firebaseConfigured } from "../../../shared/firebase/client";
import {
  getMyPledge,
  getMySponsorships,
  getSponsorship,
  getSponsorships,
} from "../api/sponsorships.api";
import { sponsorshipsKeys } from "./sponsorships.keys";

export function useSponsorships() {
  return useQuery({
    queryKey: sponsorshipsKeys.all,
    queryFn: getSponsorships,
    enabled: firebaseConfigured,
  });
}

export function useSponsorship(id: string | undefined) {
  return useQuery({
    queryKey: sponsorshipsKeys.detail(id ?? ""),
    queryFn: () => getSponsorship(id!),
    enabled: Boolean(id) && firebaseConfigured,
  });
}

export function useMySponsorships(userId: string | undefined) {
  return useQuery({
    queryKey: sponsorshipsKeys.mine(userId ?? ""),
    queryFn: () => getMySponsorships(userId!),
    enabled: Boolean(userId) && firebaseConfigured,
  });
}

export function useMyPledge(
  id: string | undefined,
  userId: string | undefined,
) {
  return useQuery({
    queryKey: sponsorshipsKeys.pledge(id ?? "", userId ?? ""),
    queryFn: () => getMyPledge(id!, userId!),
    enabled: Boolean(id && userId) && firebaseConfigured,
  });
}
