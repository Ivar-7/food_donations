import { useQuery } from "@tanstack/react-query";
import { firebaseConfigured } from "../../../shared/firebase/client";
import { getMyApplications, getOrganizations } from "../api/organizations.api";
import { organizationsKeys } from "./organizations.keys";

export function useOrganizations() {
  return useQuery({
    queryKey: organizationsKeys.all,
    queryFn: getOrganizations,
    enabled: firebaseConfigured,
  });
}

export function useMyApplications(userId: string | undefined) {
  return useQuery({
    queryKey: organizationsKeys.applications(userId ?? ""),
    queryFn: () => getMyApplications(userId!),
    enabled: Boolean(userId) && firebaseConfigured,
  });
}
