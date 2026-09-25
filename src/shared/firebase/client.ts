import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const env = import.meta.env;

export const firebaseConfigured = Boolean(
  env.VITE_FIREBASE_API_KEY &&
  env.VITE_FIREBASE_APP_ID &&
  env.VITE_FIREBASE_PROJECT_ID,
);

const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: env.VITE_FIREBASE_DATABASE_URL,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const firebaseApp = firebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(config)
  : null;

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const db = firebaseApp ? getFirestore(firebaseApp) : null;

if (env.DEV && env.VITE_USE_FIREBASE_EMULATORS === "true") {
  if (auth)
    connectAuthEmulator(auth, "http://127.0.0.1:9299", {
      disableWarnings: true,
    });
  if (db) connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

if (firebaseApp && typeof window !== "undefined") {
  void import("firebase/analytics")
    .then(async ({ getAnalytics, isSupported }) => {
      if (await isSupported()) getAnalytics(firebaseApp);
    })
    .catch(() => undefined);
}
