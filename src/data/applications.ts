/**
 * Datový model žádostí do zařízení.
 * Jeden zdroj pravdy pro stránku ŽÁDOSTI (Kanban + detail)
 * a pro souhrnný blok na stránce PÉČE.
 *
 * Mapování na navrhovaný Firestore model:
 *   users/{uid}/seniors/{seniorId}/applications/{appId}
 */

export type AppStage =
  | "action"      // Vyžaduje akci
  | "review"      // Posuzování
  | "waitlist"    // Pořadník
  | "offer"       // Nabídka místa
  | "accepted"   // Přijato
  | "ended";     // Ukončeno (rodina už nechce poptávat)

export type Chance = "low" | "medium" | "high";
export type CareKind = "residential" | "special_regime" | "home" | "respite";

export interface CommEvent {
  at: number;            // timestamp
  from: "provider" | "coordinator" | "family";
  text: string;
}

export interface RequiredDoc {
  name: string;
  status: "missing" | "delivered" | "verified";
}

export interface Application {
  id: string;
  facility: string;
  location: string;
  careKind: CareKind;
  stage: AppStage;
  /** krátký lidský popis aktuálního stavu (zobrazí se na kartě) */
  stateLabel: string;
  /** datum poslední změny (timestamp) */
  updatedAt: number;
  chance: Chance;
  /** kdy byla žádost podána (timestamp) */
  submittedAt: number;
  /** orientační odhad čekací doby */
  waitEstimate: string;
  hue: number;
  // detail
  contactName: string;
  contactRole: string;
  coordinatorNote: string;
  requiredDocs: RequiredDoc[];
  history: CommEvent[];
  /** termín požadované akce (pouze u stage = action) */
  actionDue?: string;
}

const careKindLabel: Record<CareKind, string> = {
  residential: "Pobytová péče",
  special_regime: "Zvláštní režim",
  home: "Domácí péče",
  respite: "Odlehčovací pobyt",
};
export function careKindText(k: CareKind) {
  return careKindLabel[k];
}

export const chanceMeta: Record<
  Chance,
  { label: string; cls: string; dot: string }
> = {
  low: { label: "Nízká šance", cls: "bg-surface-2 text-ink-2", dot: "#767068" },
  medium: { label: "Střední šance", cls: "bg-amber-l text-amber", dot: "#B07D20" },
  high: { label: "Vysoká šance", cls: "bg-sage-l text-sage-d", dot: "#4A7C5A" },
};

export const stageMeta: Record<
  AppStage,
  { label: string; tone: "peach" | "amber" | "neutral" | "sky" | "sage" }
> = {
  action: { label: "Potřebuje vaši reakci", tone: "peach" },
  review: { label: "Posuzování", tone: "sky" },
  waitlist: { label: "Pořadník", tone: "neutral" },
  offer: { label: "Nabídka místa", tone: "amber" },
  accepted: { label: "Přijato", tone: "sage" },
  ended: { label: "Ukončeno", tone: "neutral" },
};

/** Pořadí sloupců Kanbanu zleva doprava */
export const STAGE_ORDER: AppStage[] = [
  "action",
  "review",
  "waitlist",
  "offer",
  "accepted",
];

const DAY = 86_400_000;
const now = Date.now();

export const APPLICATIONS: Application[] = [
  {
    id: "a1",
    facility: "Domov Pohoda",
    location: "Praha 6 — Břevnov",
    careKind: "residential",
    stage: "action",
    stateLabel: "Doplnit neurologickou zprávu",
    updatedAt: now - 0.4 * DAY,
    submittedAt: now - 6 * DAY,
    chance: "high",
    waitEstimate: "2–3 měsíce",
    hue: 96,
    actionDue: "12. června",
    contactName: "Bc. Helena Marešová",
    contactRole: "Sociální pracovnice",
    coordinatorNote:
      "Zařízení je naladěné kladně. Jakmile dodáme neurologickou zprávu, posunou žádost rovnou do posouzení. Doporučuji nezdržovat — kapacita se otvírá v létě.",
    requiredDocs: [
      { name: "Žádost o přijetí", status: "verified" },
      { name: "Lékařská zpráva (praktik)", status: "verified" },
      { name: "Neurologická zpráva", status: "missing" },
      { name: "Rozhodnutí o příspěvku na péči", status: "delivered" },
    ],
    history: [
      { at: now - 6 * DAY, from: "coordinator", text: "Odeslána žádost o přijetí." },
      { at: now - 3 * DAY, from: "provider", text: "Potvrzeno přijetí žádosti, založen spis." },
      {
        at: now - 0.4 * DAY,
        from: "provider",
        text: "Pro posouzení prosíme doplnit aktuální neurologickou zprávu (do 12. 6.).",
      },
    ],
  },
  {
    id: "a2",
    facility: "Rezidence Klidná řeka",
    location: "Praha 4 — Braník",
    careKind: "residential",
    stage: "action",
    stateLabel: "Doplnit potvrzení o příjmu",
    updatedAt: now - 1.1 * DAY,
    submittedAt: now - 5 * DAY,
    chance: "medium",
    waitEstimate: "3–6 měsíců",
    hue: 28,
    actionDue: "18. června",
    contactName: "Mgr. Petr Dvořák",
    contactRole: "Vedoucí přijímacího oddělení",
    coordinatorNote:
      "Standardní doplnění podkladů. Bez tlaku — termín je orientační, zvládneme v klidu.",
    requiredDocs: [
      { name: "Žádost o přijetí", status: "verified" },
      { name: "Potvrzení o příjmu / důchodu", status: "missing" },
      { name: "Lékařská zpráva (praktik)", status: "delivered" },
    ],
    history: [
      { at: now - 5 * DAY, from: "coordinator", text: "Odeslána žádost o přijetí." },
      { at: now - 1.1 * DAY, from: "provider", text: "Prosíme doložit potvrzení o příjmu pro výpočet úhrady." },
    ],
  },
  {
    id: "a3",
    facility: "Senior park Pod Hájem",
    location: "Říčany u Prahy",
    careKind: "residential",
    stage: "review",
    stateLabel: "Probíhá posouzení",
    updatedAt: now - 2 * DAY,
    submittedAt: now - 8 * DAY,
    chance: "medium",
    waitEstimate: "3–6 měsíců",
    hue: 200,
    contactName: "Jana Veselá",
    contactRole: "Koordinátorka přijetí",
    coordinatorNote:
      "Dokumentace je kompletní, zařízení posuzuje vhodnost. Vyjádření obvykle do 14 dnů.",
    requiredDocs: [
      { name: "Žádost o přijetí", status: "verified" },
      { name: "Lékařská zpráva (praktik)", status: "verified" },
      { name: "Rozhodnutí o příspěvku na péči", status: "verified" },
    ],
    history: [
      { at: now - 8 * DAY, from: "coordinator", text: "Odeslána kompletní žádost." },
      { at: now - 2 * DAY, from: "provider", text: "Dokumentace přijata, probíhá posouzení vhodnosti." },
    ],
  },
  {
    id: "a4",
    facility: "Domov se zvláštním režimem Kvítek",
    location: "Praha 8 — Kobylisy",
    careKind: "special_regime",
    stage: "review",
    stateLabel: "Dokumentace přijata",
    updatedAt: now - 2.5 * DAY,
    submittedAt: now - 7 * DAY,
    chance: "high",
    waitEstimate: "1–3 měsíce",
    hue: 150,
    contactName: "Bc. Ondřej Kratochvíl",
    contactRole: "Sociální pracovník",
    coordinatorNote:
      "Specializace na péči o klienty s demencí — pro maminku velmi vhodné. Posuzují přednostně.",
    requiredDocs: [
      { name: "Žádost o přijetí", status: "verified" },
      { name: "Neurologická zpráva", status: "verified" },
      { name: "Lékařská zpráva (praktik)", status: "verified" },
    ],
    history: [
      { at: now - 7 * DAY, from: "coordinator", text: "Odeslána žádost vč. neurologické zprávy." },
      { at: now - 2.5 * DAY, from: "provider", text: "Dokumentace přijata a kompletní, zařazeno k posouzení." },
    ],
  },
  {
    id: "a5",
    facility: "Domov Slunečnice",
    location: "Kladno",
    careKind: "residential",
    stage: "waitlist",
    stateLabel: "Zařazeno do pořadníku — 8. místo",
    updatedAt: now - 4 * DAY,
    submittedAt: now - 12 * DAY,
    chance: "medium",
    waitEstimate: "6+ měsíců",
    hue: 50,
    contactName: "Mgr. Lucie Horáková",
    contactRole: "Vedoucí sociálního úseku",
    coordinatorNote:
      "Dobré zařízení, ale delší pořadník. Držíme jako záložní variantu — pozici budeme sledovat.",
    requiredDocs: [
      { name: "Žádost o přijetí", status: "verified" },
      { name: "Lékařská zpráva (praktik)", status: "verified" },
    ],
    history: [
      { at: now - 12 * DAY, from: "coordinator", text: "Odeslána žádost o přijetí." },
      { at: now - 4 * DAY, from: "provider", text: "Žádost přijata, klientka zařazena do pořadníku (8. místo)." },
    ],
  },
  {
    id: "a6",
    facility: "Rezidence Zelený dvůr",
    location: "Praha 5 — Smíchov",
    careKind: "residential",
    stage: "waitlist",
    stateLabel: "Zařazeno do pořadníku",
    updatedAt: now - 5 * DAY,
    submittedAt: now - 14 * DAY,
    chance: "low",
    waitEstimate: "6+ měsíců",
    hue: 110,
    contactName: "Ing. Marek Beneš",
    contactRole: "Recepce / přijetí",
    coordinatorNote:
      "Velmi žádané zařízení, dlouhý pořadník. Necháváme aktivní, ale nespoléháme na něj.",
    requiredDocs: [
      { name: "Žádost o přijetí", status: "verified" },
      { name: "Lékařská zpráva (praktik)", status: "delivered" },
    ],
    history: [
      { at: now - 14 * DAY, from: "coordinator", text: "Odeslána žádost o přijetí." },
      { at: now - 5 * DAY, from: "provider", text: "Žádost přijata a zařazena do pořadníku." },
    ],
  },
  {
    id: "a7",
    facility: "Domov U Tří lip",
    location: "Praha 6 — Břevnov",
    careKind: "residential",
    stage: "offer",
    stateLabel: "Nabídka volného místa",
    updatedAt: now - 0.8 * DAY,
    submittedAt: now - 9 * DAY,
    chance: "high",
    waitEstimate: "do 1 měsíce",
    hue: 96,
    contactName: "Bc. Eva Šťastná",
    contactRole: "Sociální pracovnice",
    coordinatorNote:
      "Nabízejí volné místo s nástupem do měsíce. Nejsilnější kandidát. Doporučuji domluvit osobní návštěvu, ať si zařízení v klidu prohlédnete — nabídka platí 7 dní.",
    requiredDocs: [
      { name: "Žádost o přijetí", status: "verified" },
      { name: "Lékařská zpráva (praktik)", status: "verified" },
      { name: "Rozhodnutí o příspěvku na péči", status: "verified" },
    ],
    history: [
      { at: now - 9 * DAY, from: "coordinator", text: "Odeslána kompletní žádost." },
      { at: now - 3 * DAY, from: "provider", text: "Žádost schválena, klientka zařazena mezi přednostní." },
      { at: now - 0.8 * DAY, from: "provider", text: "Nabízíme volné místo s nástupem do měsíce. Nabídka platí 7 dní." },
    ],
  },
  {
    id: "a8",
    facility: "Domácí péče Vlídná ruka",
    location: "Praha a okolí",
    careKind: "home",
    stage: "accepted",
    stateLabel: "Přijato — docházka od pondělí",
    updatedAt: now - 1.5 * DAY,
    submittedAt: now - 10 * DAY,
    chance: "high",
    waitEstimate: "do 1 měsíce",
    hue: 150,
    contactName: "Petra Nováková, DiS.",
    contactRole: "Koordinátorka terénní péče",
    coordinatorNote:
      "Přijato jako přechodné řešení, než nastoupí pobytová péče. Docházka 4 h denně od pondělí.",
    requiredDocs: [
      { name: "Smlouva o poskytování péče", status: "verified" },
      { name: "Rozhodnutí o příspěvku na péči", status: "verified" },
    ],
    history: [
      { at: now - 10 * DAY, from: "coordinator", text: "Odeslána poptávka domácí péče." },
      { at: now - 4 * DAY, from: "provider", text: "Volná kapacita potvrzena." },
      { at: now - 1.5 * DAY, from: "family", text: "Smlouva podepsána, nástup pondělí 9:00." },
    ],
  },
];

/** Souhrnné počty pro horní karty a blok na stránce PÉČE. */
export function applicationSummary(apps: Application[] = APPLICATIONS) {
  const by = (s: AppStage) => apps.filter((a) => a.stage === s).length;
  const active = apps.filter((a) => a.stage !== "ended").length;
  return {
    total: active,
    action: by("action"),
    review: by("review"),
    waitlist: by("waitlist"),
    offer: by("offer"),
    accepted: by("accepted"),
    ended: by("ended"),
  };
}

export function appsByStage(stage: AppStage, apps: Application[] = APPLICATIONS) {
  return apps.filter((a) => a.stage === stage);
}

export function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const h = Math.round(diff / 3_600_000);
  if (h < 1) return "před chvílí";
  if (h < 24) return `před ${h} h`;
  const d = Math.round(h / 24);
  if (d === 1) return "včera";
  return `před ${d} dny`;
}

/** Datum ve formátu „3. června" (bez roku, pokud letošní). */
export function formatDate(ts: number) {
  if (!ts) return "—";
  const d = new Date(ts);
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleDateString("cs", sameYear
    ? { day: "numeric", month: "long" }
    : { day: "numeric", month: "long", year: "numeric" });
}
