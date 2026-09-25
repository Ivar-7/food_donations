import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../shared/firebase/client";
import type { UserProfile } from "../auth.types";
import {
  validateAccount,
  validateEmail,
  validateUsername,
} from "../auth.schema";
import { reportClientError } from "../../../shared/errors/appError";

export async function signUp(
  email: string,
  password: string,
  username: string,
) {
  if (validateAccount(email, password, username))
    throw new Error("Invalid sign-up form data");
  if (!auth || !db) throw new Error("Firebase is not configured");
  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );
  const profile: UserProfile = {
    email: email.trim(),
    username: username.trim(),
    role: "user",
    createdAt: Date.now(),
  };
  try {
    await setDoc(doc(db, "users", credential.user.uid), profile);
  } catch (cause) {
    try {
      await deleteUser(credential.user);
    } catch (cleanupError) {
      reportClientError(cleanupError);
      await signOut(auth).catch(reportClientError);
    }
    throw cause;
  }
  await updateProfile(credential.user, { displayName: username.trim() }).catch(
    reportClientError,
  );
}

export async function signIn(email: string, password: string) {
  if (validateAccount(email, password))
    throw new Error("Invalid sign-in form data");
  if (!auth) throw new Error("Firebase is not configured");
  await signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function logOut() {
  if (auth) await signOut(auth);
}

export async function requestPasswordReset(email: string) {
  if (validateEmail(email)) throw new Error("Invalid email address");
  if (!auth) throw new Error("Firebase is not configured");
  await sendPasswordResetEmail(auth, email.trim());
}

export async function updateUsername(user: User, username: string) {
  const validation = validateUsername(username);
  if (validation) throw new Error(validation);
  if (!db) throw new Error("Firebase is not configured");
  await updateDoc(doc(db, "users", user.uid), { username: username.trim() });
  await updateProfile(user, { displayName: username.trim() }).catch(
    reportClientError,
  );
}

export async function createMissingProfile(user: User, username: string) {
  const validation = validateUsername(username);
  if (validation) throw new Error(validation);
  if (!db || !user.email) throw new Error("Firebase is not configured");
  const profile: UserProfile = {
    email: user.email,
    username: username.trim(),
    role: "user",
    createdAt: Date.now(),
  };
  await setDoc(doc(db, "users", user.uid), profile);
  await updateProfile(user, { displayName: username.trim() }).catch(
    reportClientError,
  );
}
