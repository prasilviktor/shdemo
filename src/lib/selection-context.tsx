"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

/** Sdílený výběr zařízení k poptávce (košík napříč celou aplikací). */
interface SelectionCtx {
  selected: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
}

const Ctx = createContext<SelectionCtx | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string[]>([]);

  const has = useCallback((id: string) => selected.includes(id), [selected]);
  const toggle = useCallback((id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }, []);
  const add = useCallback((id: string) => {
    setSelected((s) => (s.includes(id) ? s : [...s, id]));
  }, []);
  const remove = useCallback((id: string) => {
    setSelected((s) => s.filter((x) => x !== id));
  }, []);
  const clear = useCallback(() => setSelected([]), []);

  return (
    <Ctx.Provider value={{ selected, has, toggle, add, remove, clear, count: selected.length }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSelection() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSelection must be used within SelectionProvider");
  return c;
}
