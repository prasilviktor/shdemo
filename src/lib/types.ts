/**
 * Datové typy SENIOR HOUSE.
 * Odpovídají navrhovanému Firestore datovému modelu.
 */

export type CareType = "residential" | "home" | "short_term";
export type FacilityKind =
  | "senior_home"      // Domov pro seniory
  | "special_regime"   // Domov se zvláštním režimem
  | "home_care"        // Domácí péče
  | "respite"          // Odlehčovací pobyt
  | "short_stay";      // Krátkodobý pobyt
export type CareCondition =
  | "dementia" | "parkinson" | "post_stroke" | "post_hospital" | "palliative";
export type MobilitySupport = "barrier_free" | "wheelchair" | "immobile";
export type SearchingFor = "parent" | "partner" | "self";
export type Availability = "immediate" | "within_month" | "flexible";

export interface TransitLink {
  mode: "metro" | "tram" | "bus" | "train" | "car";
  label: string; // např. "Metro A — Hradčanská, 6 min pěšky"
}

export interface FinanceLine {
  label: string;
  amount: number; // kladné = náklad, záporné = odečet/podpora
  kind?: "cost" | "support" | "total";
}

export interface Provider {
  id: string;
  initials: string;
  name: string;
  location: string;
  region: string;
  operator: string; // zřizovatel
  lat: number;
  lng: number;
  distanceKm: number;
  tagline: string;
  whyFit: string; // "proč vhodné" box
  recommendation: string; // krátký důvod (pruh na kartě)
  careTypes: CareType[];
  /** Jemnější kategorie pro filtr "Hledáme" */
  facilityKinds: FacilityKind[];
  /** Zdravotní stavy, se kterými má zařízení zkušenost */
  conditions: CareCondition[];
  /** Mobilita klientů, kterou zvládne */
  mobility: MobilitySupport[];
  care24: boolean; // 24/7 dohled
  nurse247: boolean; // zdravotní sestra nonstop
  availability: Availability;
  availabilityLabel: string; // "Místo za 2 týdny"
  responseTime: string; // "Odpovídá do 24 h"
  trustSignal: string; // "Ověřená dostupnost tento týden"
  monthlyCopay: number; // doplatek po příspěvku, CZK/měs
  priceFrom: number; // plná cena před podporou
  memorySupport: boolean;
  barrierFree: boolean;
  verified: boolean;
  matchScore: number;
  /** Kurátorské doporučení — algoritmus předvybral, koordinátorka schválila. */
  recommended: boolean;
  rating: number;
  reviewCount: number;
  hue: number;
  description: string;
  included: string[];
  finance: FinanceLine[];
  admissionProcess: string[];
  requiredDocs: string[];
  transit: TransitLink[];
  advisorNote: string;
}

export interface CareProfile {
  searchingFor: SearchingFor | null;
  seniorName: string;
  seniorAge: string;
  mobility: "independent" | "assisted" | "wheelchair" | "bedridden" | null;
  memoryCondition: "none" | "mild" | "diagnosed" | null;
  medications: string;
  healthNotes: string;
  careType: CareType | null;
  careLevel: "1" | "2" | "3" | "4" | "unsure" | null;
  preferredLocation: string;
  availability: Availability | null;
  monthlyBudget: string;
  careAllowance: "yes" | "no" | "applying" | "unsure" | null;
  insurance: string;
  updatedAt: number;
  completedSteps: number;
}

export interface CareDocument {
  id: string;
  name: string;
  /** Systémové třídění a sdílení — v UI se nezobrazuje. */
  category: "medical" | "social" | "legal" | "financial";
  status: "verified" | "pending" | "missing";
  uploadedAt: number;
  sizeLabel: string;
  sharedWith: string[];
  /**
   * Jak dokument vzniká:
   *  - uploaded  → klient nahraje soubor (sken / fotka originálu)
   *  - fill      → klient vyplní formulář přímo na webu (žádný papír)
   *  - generated → appka vytvoří z dat profilu, klient jen potvrdí
   */
  source: "uploaded" | "fill" | "generated";
  /** Je dokument pro většinu zařízení povinný? */
  required: boolean;
  /** Krátká nápověda — co to je / kde se bere. */
  hint?: string;
  /** Cílová stránka pro „Vyplnit u nás" (jen u source: "fill" | "generated"). */
  fillHref?: string;
}

export interface Message {
  id: string;
  from: string;
  fromRole: "family" | "provider" | "coordinator";
  body: string;
  at: number;
  unread: boolean;
}

export interface Thread {
  id: string;
  providerName: string;
  providerId: string;
  lastMessageAt: number;
  messages: Message[];
  kind?: "coordinator" | "facility";
}

export const emptyCareProfile: CareProfile = {
  searchingFor: null,
  seniorName: "",
  seniorAge: "",
  mobility: null,
  memoryCondition: null,
  medications: "",
  healthNotes: "",
  careType: null,
  careLevel: null,
  preferredLocation: "",
  availability: null,
  monthlyBudget: "",
  careAllowance: null,
  insurance: "",
  updatedAt: 0,
  completedSteps: 0,
};
