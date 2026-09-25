import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState, type ReactNode } from "react";
import { auth, db } from "../shared/firebase/client";
import type { UserProfile } from "../features/auth/auth.types";
import { parseUserProfile } from "../features/auth/auth.schema";
import { toAppError } from "../shared/errors/appError";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(Boolean(auth));
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) return;
    let unsubscribeProfile: () => void = () => undefined;
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (current) => {
        unsubscribeProfile();
        setUser(current);
        setProfile(null);
        setProfileError(null);
        setProfileLoading(Boolean(current));
        setLoading(false);
        if (current && db) {
          unsubscribeProfile = onSnapshot(
            doc(db, "users", current.uid),
            (snapshot) => {
              try {
                setProfile(
                  snapshot.exists() ? parseUserProfile(snapshot.data()) : null,
                );
                setProfileError(null);
              } catch (cause) {
                setProfileError(toAppError(cause).message);
                setProfile(null);
              } finally {
                setProfileLoading(false);
              }
            },
            (cause) => {
              setProfileError(toAppError(cause).message);
              setProfile(null);
              setProfileLoading(false);
            },
          );
        } else {
          setProfileLoading(false);
        }
      },
      (cause) => {
        setProfileError(toAppError(cause).message);
        setLoading(false);
        setProfileLoading(false);
      },
    );
    return () => {
      unsubscribeAuth();
      unsubscribeProfile();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, profileLoading, profileError }}
    >
      {children}
    </AuthContext.Provider>
  );
}
