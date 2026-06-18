"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { APPLICATIONS, type Application } from "@/data/applications";

interface AppsCtx {
  apps: Application[];
  endApplication: (id: string) => void;
}

const Ctx = createContext<AppsCtx | null>(null);

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const [apps, setApps] = useState<Application[]>(APPLICATIONS);

  function endApplication(id: string) {
    setApps((list) =>
      list.map((a) =>
        a.id === id
          ? {
              ...a,
              stage: "ended",
              stateLabel: "Poptávka ukončena",
              updatedAt: Date.now(),
              history: [
                ...a.history,
                { at: Date.now(), from: "family", text: "Poptávku jste ukončili. Zařízení jsme přesunuli mezi ukončené žádosti." },
              ],
            }
          : a
      )
    );
  }

  return <Ctx.Provider value={{ apps, endApplication }}>{children}</Ctx.Provider>;
}

export function useApplications() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApplications must be used within ApplicationsProvider");
  return c;
}
