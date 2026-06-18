"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { APPLICATIONS, type Application, type CareKind } from "@/data/applications";
import type { Provider } from "@/lib/types";

interface AppsCtx {
  apps: Application[];
  endApplication: (id: string) => void;
  /** Vytvoří žádosti z poptaných zařízení (přeskočí ta, která už jako žádost existují). */
  createApplicationsFrom: (providers: Provider[]) => void;
}

const Ctx = createContext<AppsCtx | null>(null);

function careKindFromProvider(p: Provider): CareKind {
  const k = p.facilityKinds[0];
  if (k === "home_care") return "home";
  if (k === "respite" || k === "short_stay") return "respite";
  if (k === "special_regime") return "special_regime";
  return "residential";
}

function applicationFromProvider(p: Provider): Application {
  const now = Date.now();
  return {
    id: `app_${p.id}_${now}`,
    facility: p.name,
    location: p.location,
    careKind: careKindFromProvider(p),
    stage: "review",
    stateLabel: "Poptávka odeslána, čeká na vyjádření",
    updatedAt: now,
    submittedAt: now,
    chance: p.matchScore >= 90 ? "high" : p.matchScore >= 75 ? "medium" : "low",
    waitEstimate: p.availabilityLabel || "Čeká se na odpověď",
    hue: p.hue,
    contactName: "Koordinátorka SENIOR HOUSE",
    contactRole: "Vyřizuje vaši poptávku",
    coordinatorNote: "Poptávku jsme odeslali. Jakmile zařízení odpoví, dáme vám vědět.",
    requiredDocs: [],
    history: [
      { at: now, from: "family", text: "Odeslali jste poptávku přes SENIOR HOUSE." },
      { at: now, from: "coordinator", text: "Poptávku jsme předali zařízení a hlídáme odpověď." },
    ],
  };
}

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const [apps, setApps] = useState<Application[]>(APPLICATIONS);

  function createApplicationsFrom(providers: Provider[]) {
    setApps((list) => {
      const existingFacilities = new Set(list.filter((a) => a.stage !== "ended").map((a) => a.facility));
      const fresh = providers
        .filter((p) => !existingFacilities.has(p.name))
        .map(applicationFromProvider);
      return [...fresh, ...list];
    });
  }

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

  return <Ctx.Provider value={{ apps, endApplication, createApplicationsFrom }}>{children}</Ctx.Provider>;
}

export function useApplications() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApplications must be used within ApplicationsProvider");
  return c;
}
