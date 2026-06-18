"use client";

/**
 * Auth context — jednotné rozhraní pro přihlášení.
 *
 * Ve výchozím stavu (bez .env.local) běží MOCK auth: ukládá uživatele
 * do localStorage, takže můžeš celou appku proklikat bez Firebase.
 *
 * NAPOJENÍ FIREBASE:
 * Najdi bloky označené `// === FIREBASE ===` níže, odkomentuj je
 * a smaž odpovídající mock blok. Nic dalšího v UI měnit nemusíš —
 * komponenty volají jen useAuth().
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { isFirebaseConfigured } from "./firebase";

export type UserRole = "family" | "provider";

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
    role: UserRole
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const MOCK_KEY = "sh_mock_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured) {
      // === FIREBASE ===
      // import { getAuth, onAuthStateChanged } from "firebase/auth";
      // import { getFirebaseApp } from "./firebase";
      // import { getDoc, doc, getFirestore } from "firebase/firestore";
      // const auth = getAuth(getFirebaseApp()!);
      // const unsub = onAuthStateChanged(auth, async (fbUser) => {
      //   if (fbUser) {
      //     const db = getFirestore(getFirebaseApp()!);
      //     const snap = await getDoc(doc(db, "users", fbUser.uid));
      //     const data = snap.data();
      //     setUser({
      //       uid: fbUser.uid,
      //       email: fbUser.email ?? "",
      //       displayName: data?.displayName ?? fbUser.displayName ?? "",
      //       role: (data?.role as UserRole) ?? "family",
      //     });
      //   } else {
      //     setUser(null);
      //   }
      //   setLoading(false);
      // });
      // return () => unsub();
      setLoading(false);
      return;
    }

    // --- MOCK ---
    try {
      const raw = localStorage.getItem(MOCK_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  async function signIn(email: string, _password: string) {
    if (isFirebaseConfigured) {
      // === FIREBASE ===
      // import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
      // const auth = getAuth(getFirebaseApp()!);
      // await signInWithEmailAndPassword(auth, email, _password);
      // onAuthStateChanged výše doplní user objekt.
      return;
    }
    // --- MOCK ---
    const mockUser: AppUser = {
      uid: "mock-" + btoa(email).slice(0, 8),
      email,
      displayName: email.split("@")[0],
      role: "family",
    };
    localStorage.setItem(MOCK_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
  }

  async function signUp(
    email: string,
    _password: string,
    displayName: string,
    role: UserRole
  ) {
    if (isFirebaseConfigured) {
      // === FIREBASE ===
      // import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
      // import { doc, setDoc, getFirestore } from "firebase/firestore";
      // const auth = getAuth(getFirebaseApp()!);
      // const cred = await createUserWithEmailAndPassword(auth, email, _password);
      // const db = getFirestore(getFirebaseApp()!);
      // await setDoc(doc(db, "users", cred.user.uid), {
      //   email, displayName, role, createdAt: Date.now(),
      // });
      return;
    }
    // --- MOCK ---
    const mockUser: AppUser = {
      uid: "mock-" + btoa(email).slice(0, 8),
      email,
      displayName,
      role,
    };
    localStorage.setItem(MOCK_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
  }

  async function signOut() {
    if (isFirebaseConfigured) {
      // === FIREBASE ===
      // import { getAuth, signOut as fbSignOut } from "firebase/auth";
      // await fbSignOut(getAuth(getFirebaseApp()!));
      // return;
    }
    // --- MOCK ---
    localStorage.removeItem(MOCK_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
