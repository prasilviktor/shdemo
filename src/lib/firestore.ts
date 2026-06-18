"use client";

/**
 * Datová vrstva pro Care Profil a dokumenty.
 *
 * Teď: ukládá do localStorage (mock), aby demo fungovalo bez Firebase.
 * Po napojení: nahraď těla funkcí Firestore voláními (vzory v komentářích).
 *
 * Doporučená Firestore struktura:
 *   users/{uid}                         → { email, displayName, role }
 *   users/{uid}/careProfile/main        → CareProfile
 *   users/{uid}/documents/{docId}       → CareDocument (metadata)
 *   users/{uid}/threads/{threadId}      → Thread
 *   providers/{providerId}              → Provider
 *
 * Soubory (Document Vault) patří do Firebase Storage:
 *   vault/{uid}/{docId}/{filename}
 * a do Firestore se ukládá jen metadata + downloadURL.
 */

import { isFirebaseConfigured } from "./firebase";
import { type CareProfile, emptyCareProfile } from "./types";

const profileKey = (uid: string) => `sh_profile_${uid}`;

export async function loadCareProfile(uid: string): Promise<CareProfile> {
  if (isFirebaseConfigured) {
    // === FIREBASE ===
    // import { getFirestore, doc, getDoc } from "firebase/firestore";
    // import { getFirebaseApp } from "./firebase";
    // const db = getFirestore(getFirebaseApp()!);
    // const snap = await getDoc(doc(db, "users", uid, "careProfile", "main"));
    // return snap.exists() ? (snap.data() as CareProfile) : emptyCareProfile;
  }
  // --- MOCK ---
  try {
    const raw = localStorage.getItem(profileKey(uid));
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return emptyCareProfile;
}

export async function saveCareProfile(
  uid: string,
  profile: CareProfile
): Promise<void> {
  const next = { ...profile, updatedAt: Date.now() };
  if (isFirebaseConfigured) {
    // === FIREBASE ===
    // import { getFirestore, doc, setDoc } from "firebase/firestore";
    // const db = getFirestore(getFirebaseApp()!);
    // await setDoc(doc(db, "users", uid, "careProfile", "main"), next);
    // return;
  }
  // --- MOCK ---
  localStorage.setItem(profileKey(uid), JSON.stringify(next));
}

/**
 * Nahrání dokumentu do Document Vault.
 * Po napojení použij Firebase Storage + Firestore metadata.
 *
 * === FIREBASE ===
 * import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
 * const storage = getStorage(getFirebaseApp()!);
 * const fileRef = ref(storage, `vault/${uid}/${docId}/${file.name}`);
 * await uploadBytes(fileRef, file);
 * const url = await getDownloadURL(fileRef);
 * // pak ulož metadata do users/{uid}/documents/{docId}
 */
