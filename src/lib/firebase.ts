/**
 * Firebase inicializace.
 *
 * KROK 1 — vytvoř projekt na https://console.firebase.google.com
 * KROK 2 — zkopíruj config do .env.local (viz .env.local.example)
 * KROK 3 — v Authentication zapni "Email/Password" (a případně Google)
 * KROK 4 — vytvoř Firestore databázi a Storage bucket
 *
 * Dokud nejsou env proměnné vyplněné, aplikace běží na MOCK vrstvě
 * (viz src/lib/auth-context.tsx a src/lib/firestore.ts) a funguje
 * bez Firebase. Jakmile vyplníš .env.local, real Firebase se aktivuje
 * automaticky díky kontrole isFirebaseConfigured.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;
  if (getApps().length) return getApp();
  app = initializeApp(firebaseConfig);
  return app;
}

/**
 * Lazy gettery — importuj firebase/auth, firebase/firestore atd. až tady,
 * aby se mock režim nezatěžoval zbytečně knihovnami.
 *
 * Příklad použití po napojení:
 *
 *   import { getAuth } from "firebase/auth";
 *   const auth = getAuth(getFirebaseApp()!);
 */
