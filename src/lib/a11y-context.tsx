"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface A11yValue {
  senior: boolean;
  setSenior: (v: boolean) => void;
  toggle: () => void;
}

const A11yContext = createContext<A11yValue | null>(null);
const KEY = "sh_senior_mode";

export function A11yProvider({ children }: { children: ReactNode }) {
  const [senior, setSeniorState] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY) === "1";
      setSeniorState(v);
      document.documentElement.dataset.senior = v ? "true" : "false";
    } catch {
      /* ignore */
    }
  }, []);

  function setSenior(v: boolean) {
    setSeniorState(v);
    document.documentElement.dataset.senior = v ? "true" : "false";
    try {
      localStorage.setItem(KEY, v ? "1" : "0");
    } catch {
      /* ignore */
    }
  }

  return (
    <A11yContext.Provider
      value={{ senior, setSenior, toggle: () => setSenior(!senior) }}
    >
      {children}
    </A11yContext.Provider>
  );
}

export function useA11y() {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useA11y must be used within A11yProvider");
  return ctx;
}
