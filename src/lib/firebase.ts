import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'
import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseOptions,
} from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
import { connectStorageEmulator, getStorage } from 'firebase/storage'

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const requiredConfig = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.storageBucket,
  firebaseConfig.messagingSenderId,
  firebaseConfig.appId,
]

export const isFirebaseConfigured = requiredConfig.every(Boolean)

if (!isFirebaseConfigured) {
  throw new Error(
    'Firebase is not configured. Copy .env.example to .env.local and add the Firebase web app configuration.',
  )
}

export const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)
export const functions = getFunctions(
  firebaseApp,
  import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'us-central1',
)

export const useFirebaseEmulators =
  import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true'

if (useFirebaseEmulators) {
  const emulatorHost =
    import.meta.env.VITE_FIREBASE_EMULATOR_HOST || '127.0.0.1'

  connectAuthEmulator(auth, `http://${emulatorHost}:9099`, {
    disableWarnings: true,
  })
  connectFirestoreEmulator(db, emulatorHost, 8080)
  connectFunctionsEmulator(functions, emulatorHost, 5001)
  connectStorageEmulator(storage, emulatorHost, 9199)
}

let analyticsPromise: Promise<Analytics | null> | undefined

/**
 * Analytics needs a supported browser environment. Deferring it keeps local
 * development, server-side tooling, and unsupported browsers working.
 */
export function initializeAnalytics(): Promise<Analytics | null> {
  if (!import.meta.env.PROD || typeof window === 'undefined') {
    return Promise.resolve(null)
  }

  analyticsPromise ??= isSupported()
    .then((supported) => (supported ? getAnalytics(firebaseApp) : null))
    .catch(() => null)

  return analyticsPromise
}
