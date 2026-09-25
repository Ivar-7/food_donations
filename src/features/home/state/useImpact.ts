import { useQuery } from "@tanstack/react-query";
import { firebaseConfigured } from "../../../shared/firebase/client";
import { getImpactTotals } from "../api/impact.api";

export function useImpact() {
  return useQuery({
    queryKey: ["impact"],
    queryFn: getImpactTotals,
    enabled: firebaseConfigured,
    staleTime: 60_000,
    refetchOnMount: "always",
  });
}
