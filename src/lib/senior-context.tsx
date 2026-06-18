"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * Globální výběr seniora, o kterého se rodina stará.
 * Přepnutí přepíná celý systém (péče, žádosti, financování…).
 * Po napojení Firebase → users/{uid}/seniors/{id}.
 */
export type NextAction = {
  context: string;
  title: string;
  detail: string;
  cta: string;
  href: string;
  icon: "calendar" | "upload" | "send";
  eta: string;
};

/** Profil péče — zdravotní a pečovatelský stav klienta. */
export type CareProfile = {
  birthYear: number;
  address: string;
  phone: string;
  email: string;
  mobility: string;       // např. "Chodí s chodítkem"
  orientation: string;    // orientace / paměť
  diagnoses: string[];
  hygieneHelp: boolean;
  mealHelp: boolean;
  nightWatch: boolean;
  medications: string;
  careWanted: string[];   // domácí / pobytová / odlehčovací / stacionář
  availability: string;   // ihned / do měsíce / nespěcháme / vlastní
  budgetMin: number;
  budgetMax: number;
  coordinatorNote: string;
};

/** Kontakty kolem případu. */
export type Contacts = {
  manager: { name: string; relation: string; phone: string; email: string; prefer: string };
  facilityContact: { name: string; relation: string; phone: string; email: string };
};

export type Senior = {
  id: string;
  name: string;
  initials: string;
  age: number;
  location: string;
  careLabel: string;
  meta: string;
  tags: string[];
  cost: string;
  copay: string;
  allowanceLevel: string; // příspěvek na péči — stupeň
  next: NextAction;
  profile: CareProfile;
  contacts: Contacts;
};

export const SENIORS: Senior[] = [
  {
    id: "marie",
    name: "Marie Nováková",
    initials: "MN",
    age: 82,
    location: "Praha 6",
    careLabel: "Domácí péče — 4 h / den",
    meta: "82 let · Praha 6 · Domácí péče — 4 h / den",
    tags: ["Stupeň III", "Mírná demence", "Chodítko"],
    cost: "16 500 Kč",
    copay: "9 800 Kč",
    allowanceLevel: "III. stupeň (12 800 Kč/měs)",
    next: {
      context: "Marie má 3 vhodná zařízení s volnou kapacitou.",
      title: "Naplánujte osobní návštěvu",
      detail:
        "Nejvhodnější zařízení (Domov U Tří lip) má místo přibližně za 2 týdny. Návštěva je další krok k umístění.",
      cta: "Naplánovat návštěvu",
      href: "/messages",
      icon: "calendar",
      eta: "Odhad dokončení umístění: 2–3 týdny",
    },
    profile: {
      birthYear: 1943,
      address: "Bělohorská 12, Praha 6 — Břevnov",
      phone: "+420 602 123 456",
      email: "",
      mobility: "Chodí s chodítkem, schody zvládá s dopomocí",
      orientation: "Mírná demence — občas dezorientovaná v čase",
      diagnoses: ["Mírná demence", "Vysoký tlak", "Artróza kyčlí"],
      hygieneHelp: true,
      mealHelp: false,
      nightWatch: false,
      medications: "Donepezil, Lozap, Vápník + D3",
      careWanted: ["pobytova", "domaci"],
      availability: "do_mesice",
      budgetMin: 8000,
      budgetMax: 14000,
      coordinatorNote: "Maminka si přeje zůstat v Praze 6 blízko dcery. Důležitá je klidná atmosféra a zahrada.",
    },
    contacts: {
      manager: { name: "Eva Nováková", relation: "Dcera", phone: "+420 777 888 999", email: "eva.novakova@email.cz", prefer: "E-mail" },
      facilityContact: { name: "Eva Nováková", relation: "Dcera", phone: "+420 777 888 999", email: "eva.novakova@email.cz" },
    },
  },
  {
    id: "josef",
    name: "Josef Novák",
    initials: "JN",
    age: 85,
    location: "Praha 6",
    careLabel: "Hledáme pobytovou péči",
    meta: "85 let · Praha 6 · Hledáme pobytovou péči",
    tags: ["Stupeň II", "Po hospitalizaci", "Vozík"],
    cost: "28 000 Kč",
    copay: "8 000 Kč",
    allowanceLevel: "II. stupeň (4 900 Kč/měs)",
    next: {
      context: "Žádosti o příspěvek na péči chybí poslední dokument.",
      title: "Nahrajte chybějící dokument",
      detail:
        "K dokončení žádosti o příspěvek schází potvrzení o trvalém bydlišti. Pak je žádost připravená k podání.",
      cta: "Nahrát dokument",
      href: "/documents",
      icon: "upload",
      eta: "Po doložení lze žádost ihned odeslat",
    },
    profile: {
      birthYear: 1940,
      address: "Bělohorská 12, Praha 6 — Břevnov",
      phone: "+420 602 123 456",
      email: "",
      mobility: "Vozík, přesun s dopomocí jedné osoby",
      orientation: "Plně orientovaný",
      diagnoses: ["Stav po cévní mozkové příhodě", "Cukrovka 2. typu"],
      hygieneHelp: true,
      mealHelp: true,
      nightWatch: true,
      medications: "Warfarin, Metformin, Apo-Ome",
      careWanted: ["pobytova"],
      availability: "ihned",
      budgetMin: 6000,
      budgetMax: 12000,
      coordinatorNote: "Po hospitalizaci potřebuje zařízení se zdravotní sestrou nonstop a rehabilitací.",
    },
    contacts: {
      manager: { name: "Eva Nováková", relation: "Dcera", phone: "+420 777 888 999", email: "eva.novakova@email.cz", prefer: "Telefon" },
      facilityContact: { name: "Petr Novák", relation: "Syn", phone: "+420 606 111 222", email: "petr.novak@email.cz" },
    },
  },
];

interface SeniorCtx {
  seniors: Senior[];
  active: Senior;
  activeId: string;
  setActiveId: (id: string) => void;
  updateProfile: (id: string, patch: Partial<CareProfile>) => void;
  updateContacts: (id: string, patch: Partial<Contacts>) => void;
}

const Ctx = createContext<SeniorCtx | null>(null);

export function SeniorProvider({ children }: { children: ReactNode }) {
  const [seniors, setSeniors] = useState<Senior[]>(SENIORS);
  const [activeId, setActiveId] = useState(SENIORS[0].id);
  const active = seniors.find((s) => s.id === activeId) ?? seniors[0];

  function updateProfile(id: string, patch: Partial<CareProfile>) {
    setSeniors((list) =>
      list.map((s) => (s.id === id ? { ...s, profile: { ...s.profile, ...patch } } : s))
    );
  }
  function updateContacts(id: string, patch: Partial<Contacts>) {
    setSeniors((list) =>
      list.map((s) => (s.id === id ? { ...s, contacts: { ...s.contacts, ...patch } } : s))
    );
  }

  return (
    <Ctx.Provider value={{ seniors, active, activeId, setActiveId, updateProfile, updateContacts }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSenior() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSenior must be used within SeniorProvider");
  return c;
}

/* Pomocné mapy pro čitelné popisky */
export const careWantedLabels: Record<string, string> = {
  domaci: "Domácí péče",
  pobytova: "Pobytová péče",
  odlehcovaci: "Odlehčovací péče",
  stacionar: "Denní stacionář",
};
export const availabilityLabels: Record<string, string> = {
  ihned: "Ihned",
  do_mesice: "Do měsíce",
  nespecha: "Nespěcháme",
  vlastni: "Vlastní termín",
};
