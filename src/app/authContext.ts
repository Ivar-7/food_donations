import { createContext, useContext } from "react";
import type { User } from "firebase/auth";
import type { UserProfile } from "../features/auth/auth.types";

export type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  profileError: string | null;
};
export const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  profileLoading: false,
  profileError: null,
});
export function useAuth() {
  return useContext(AuthContext);
}
