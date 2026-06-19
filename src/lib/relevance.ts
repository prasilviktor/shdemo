/**
 * Relevanční kontroly pro poptávku.
 *
 * Cíl: jemně upozornit (NE zablokovat), když uživatel poptává zařízení,
 * které nesedí na profil aktivního seniora — aby domovy nedostávaly
 * nerelevantní poptávky a uživatel neplýtval energií.
 *
 * Vše jsou „měkká" varování: uživatel může poptat dál.
 */
import type { Provider, CareType } from "@/lib/types";

/** Mapování klíčů careWanted (profil) na CareType (poskytovatel). */
const CARE_WANTED_TO_TYPE: Record<string, CareType[]> = {
  pobytova: ["residential"],
  domaci: ["home"],
  odlehcovaci: ["short_term"],
  stacionar: ["home"],
};

export type RelevanceFlag = {
  /** strojový klíč důvodu */
  kind: "budget" | "region" | "care_type" | "previously_rejected";
  /** lidsky srozumitelná věta pro uživatele 60+ */
  message: string;
  /** doporučená reakce (pro tlačítko / nápovědu) */
  hint?: string;
};

/** Minimální profil potřebný k posouzení relevance. */
export type RelevanceProfile = {
  region?: string;       // např. "Praha 6" / "Praha"
  budgetMax?: number;    // horní hranice měsíčního doplatku
  careWanted?: string[]; // ["pobytova", "domaci"]
};

/**
 * Vrátí seznam relevančních varování pro dané zařízení vůči profilu.
 * Prázdné pole = zařízení sedí na profil.
 */
export function relevanceFlags(p: Provider, profile: RelevanceProfile): RelevanceFlag[] {
  const flags: RelevanceFlag[] = [];

  // 1) Rozpočet — porovnáváme doplatek po příspěvku s horní hranicí.
  if (profile.budgetMax && p.monthlyCopay > profile.budgetMax) {
    const over = p.monthlyCopay - profile.budgetMax;
    flags.push({
      kind: "budget",
      message: `Doplatek ${formatCzk(p.monthlyCopay)} je nad váš rozpočet (${formatCzk(profile.budgetMax)}).`,
      hint: `O ${formatCzk(over)} více, než jste zadali.`,
    });
  }

  // 2) Region — hrubé porovnání podle kraje/města.
  if (profile.region && !regionMatches(profile.region, p.region, p.location)) {
    flags.push({
      kind: "region",
      message: `Toto zařízení je mimo oblast, kterou jste hledali (${p.region}).`,
      hint: "Dojíždění může být náročnější.",
    });
  }

  // 3) Typ péče — pokud uživatel hledá jen určité typy a tento mezi ně nepatří.
  if (profile.careWanted && profile.careWanted.length > 0) {
    const wantedTypes = profile.careWanted.flatMap((k) => CARE_WANTED_TO_TYPE[k] ?? []);
    const overlaps = p.careTypes.some((t) => wantedTypes.includes(t));
    if (wantedTypes.length > 0 && !overlaps) {
      flags.push({
        kind: "care_type",
        message: "Tento typ péče neodpovídá tomu, co hledáte.",
        hint: "Zkontrolujte, zda zařízení opravdu nabízí, co potřebujete.",
      });
    }
  }

  return flags;
}

/**
 * BOD 3 — připraveno pro napojení (zatím bez backendu).
 *
 * Vrátí varování, pokud bylo zařízení v minulosti poptáno a odmítlo nás.
 * `priorOutcomes` dodá volající z dat žádostí (až bude k dispozici Firebase);
 * dokud je prázdné, funkce nic nehlásí.
 */
export type PriorOutcome = {
  providerId: string;
  status: "rejected" | "requested" | "full";
  /** volitelný lidský důvod, např. "Plná kapacita" */
  note?: string;
};

export function historyFlag(
  providerId: string,
  priorOutcomes: PriorOutcome[],
): RelevanceFlag | null {
  const prior = priorOutcomes.find((o) => o.providerId === providerId);
  if (!prior) return null;

  if (prior.status === "rejected") {
    return {
      kind: "previously_rejected",
      message: "Toto zařízení jsme už poptali a aktuálně nemělo místo.",
      hint: "Doporučujeme zkusit jiný domov.",
    };
  }
  if (prior.status === "full") {
    return {
      kind: "previously_rejected",
      message: "Toto zařízení nám naposledy hlásilo plnou kapacitu.",
      hint: "Doporučujeme zkusit jiný domov.",
    };
  }
  if (prior.status === "requested") {
    return {
      kind: "previously_rejected",
      message: "Toto zařízení jste už nedávno poptali.",
      hint: "Druhá poptávka obvykle není potřeba.",
    };
  }
  return null;
}

/* ── pomocné ── */

function regionMatches(seniorRegion: string, providerRegion: string, providerLocation: string): boolean {
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
  const sr = norm(seniorRegion);
  const pr = norm(providerRegion);
  const pl = norm(providerLocation);
  // "Praha 6" sedí na region "Praha"; jinak hledáme společný základ.
  const srBase = sr.split(" ")[0]; // "praha"
  return pr.includes(srBase) || pl.includes(srBase) || sr.includes(pr);
}

function formatCzk(n: number): string {
  return n.toLocaleString("cs-CZ").replace(/\u00a0/g, " ") + " Kč";
}
