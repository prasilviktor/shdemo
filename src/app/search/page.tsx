"use client";

import { useMemo, useState } from "react";
import {
  MapPin, Phone, X, Check, Clock, BadgeCheck, ArrowRight, Map as MapIcon,
  Train, Bus, Car, TramFront, Navigation, Brain, Accessibility, Wallet,
  Building2, House, HeartHandshake, Bed, Hospital, Activity, Armchair,
  Stethoscope, Users, Shield, Sparkles, Plus, Menu,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ProviderVisual, InfoTip } from "@/components/ui";
import { ProviderMap } from "@/components/provider-map";
import { ProviderMapMulti } from "@/components/provider-map-multi";
import { providers } from "@/data/providers";
import { useSenior } from "@/lib/senior-context";
import type {
  Provider, CareType, TransitLink,
  FacilityKind, CareCondition, MobilitySupport,
} from "@/lib/types";

type SortKey = "match" | "availability" | "nearby" | "copay";
type AvailChoice = "immediate" | "within_month" | "within_3m" | "any" | "custom";
type SearchMode = "recommended" | "all";

/* ── Mapování z profilu seniora na filtry vyhledávače ── */
function kindsFromProfile(careWanted: string[]): FacilityKind[] {
  const map: Record<string, FacilityKind[]> = {
    pobytova: ["senior_home"],
    domaci: ["home_care"],
    odlehcovaci: ["respite"],
    stacionar: ["short_stay"],
  };
  return Array.from(new Set(careWanted.flatMap((c) => map[c] ?? [])));
}
function conditionsFromProfile(diagnoses: string[]): CareCondition[] {
  const out = new Set<CareCondition>();
  for (const d of diagnoses) {
    const t = d.toLowerCase();
    if (t.includes("demenc") || t.includes("alzheimer")) out.add("dementia");
    if (t.includes("parkinson")) out.add("parkinson");
    if (t.includes("mozkov") || t.includes("cmp") || t.includes("mrtvic")) out.add("post_stroke");
  }
  return Array.from(out);
}
function mobilityFromProfile(mobilityText: string): MobilitySupport[] {
  const out = new Set<MobilitySupport>();
  const t = (mobilityText ?? "").toLowerCase();
  if (t.includes("vozík") || t.includes("vozik")) out.add("wheelchair");
  if (t.includes("imobil") || t.includes("ležící") || t.includes("lezici")) out.add("immobile");
  return Array.from(out);
}

// Zařízení aktuálně vybraná k poptávce — v reálu by přišla z kontextu/store
const SELECTED_IDS = new Set(["p1", "p2", "p3", "p4"]);

const careTypeLabel: Record<CareType, string> = {
  residential: "Pobytová péče", home: "Domácí péče", short_term: "Krátkodobá / respitní",
};
const kindLabel: Record<FacilityKind, string> = {
  senior_home: "Domov pro seniory", special_regime: "Domov se zvláštním režimem",
  home_care: "Domácí péče", respite: "Odlehčovací pobyt", short_stay: "Krátkodobý pobyt",
};
const transitIcon: Record<TransitLink["mode"], typeof Train> = {
  metro: Navigation, tram: TramFront, bus: Bus, train: Train, car: Car,
};

type Badge = { icon: React.ReactNode; label: string; cls: string };
function badgesOf(p: Provider): Badge[] {
  const b: Badge[] = [];
  if (p.memorySupport) b.push({ icon: <Brain size={13} />, label: "Demence", cls: "border-[#C4B5F4] bg-[#F3EFFD] text-[#6d4fc4]" });
  b.push({ icon: <Clock size={13} />, label: p.availabilityLabel, cls: p.availability === "immediate" ? "border-sage-bd bg-sage-l text-sage-d" : "border-amber-bd bg-amber-l text-amber" });
  b.push({ icon: <MapPin size={13} />, label: p.distanceKm > 0 ? `${p.distanceKm} km od rodiny` : "Dochází k vám", cls: "border-sky-bd bg-sky-l text-sky" });
  if (p.barrierFree) b.push({ icon: <Accessibility size={13} />, label: "Bezbariérové", cls: "border-line-2 bg-surface-2 text-ink-2" });
  if (p.nurse247) b.push({ icon: <Stethoscope size={13} />, label: "Sestra nonstop", cls: "border-sage-bd bg-sage-l text-sage-d" });
  b.push({ icon: <Wallet size={13} />, label: `Doplatek od ${p.monthlyCopay.toLocaleString("cs")} Kč`, cls: "border-line-2 bg-paper-2 text-ink" });
  return b;
}

export default function SearchPage() {
  const { active } = useSenior();
  const prof = active.profile;

  // Předvyplnění filtrů z profilu seniora
  const profileKinds = kindsFromProfile(prof.careWanted);
  const profileConds = conditionsFromProfile(prof.diagnoses);
  const profileMob = mobilityFromProfile(prof.mobility);
  const profileBudget = prof.budgetMax > 0 ? Math.min(prof.budgetMax, 50000) : 50000;

  const [mode, setMode] = useState<SearchMode>("recommended");
  const [kinds, setKinds] = useState<FacilityKind[]>(profileKinds);
  const [conditions, setConditions] = useState<CareCondition[]>(profileConds);
  const [mobility, setMobility] = useState<MobilitySupport[]>(profileMob);
  const [care24, setCare24] = useState(prof.nightWatch ?? false);
  const [nurse247, setNurse247] = useState(false);
  const [budget, setBudget] = useState(profileBudget);
  const [availChoice, setAvailChoice] = useState<AvailChoice>("any");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState<SortKey>("match");
  const [detail, setDetail] = useState<Provider | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  function resetFromProfile() {
    setKinds(profileKinds);
    setConditions(profileConds);
    setMobility(profileMob);
    setBudget(profileBudget);
    setCare24(prof.nightWatch ?? false);
    setNurse247(false);
    setAvailChoice("any");
  }

  // Lokální stav výběru — inicializuje se z SELECTED_IDS
  const [selected, setSelected] = useState<Set<string>>(new Set(SELECTED_IDS));
  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggle<T>(arr: T[], v: T, set: (x: T[]) => void) {
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  }

  const results = useMemo(() => {
    let r = providers.filter((p) => {
      if (mode === "recommended" && !p.recommended) return false;
      if (kinds.length && !kinds.some((k) => p.facilityKinds.includes(k))) return false;
      if (conditions.length && !conditions.every((c) => p.conditions.includes(c))) return false;
      if (mobility.length && !mobility.every((m) => p.mobility.includes(m))) return false;
      if (care24 && !p.care24) return false;
      if (nurse247 && !p.nurse247) return false;
      if (p.monthlyCopay > budget) return false;
      if (availChoice === "immediate" && p.availability !== "immediate") return false;
      if (availChoice === "within_month" && p.availability === "flexible") return false;
      return true;
    });
    return [...r].sort((a, b) => {
      if (sort === "match") return b.matchScore - a.matchScore;
      if (sort === "copay") return a.monthlyCopay - b.monthlyCopay;
      if (sort === "nearby") return a.distanceKm - b.distanceKm;
      const order = { immediate: 0, within_month: 1, flexible: 2 };
      return order[a.availability] - order[b.availability];
    });
  }, [mode, kinds, conditions, mobility, care24, nurse247, budget, availChoice, sort]);

  const recommendedCount = providers.filter((p) => p.recommended).length;
  const allCount = providers.length;

  const mapPoints = results.map((p) => ({ id: p.id, lat: p.lat, lng: p.lng, name: p.name, location: p.location, matchScore: p.matchScore }));

  return (
    <AppShell title="Najít péči" greeting={false} wide>
      <div className="flex">
        {/* ════ FILTRY ════ */}
        <aside className="hidden w-[260px] shrink-0 overflow-y-auto border-r-2 border-line-2 bg-paper-2 lg:block">
          <Filters
            seniorName={active.name.split(" ")[0]}
            onReset={resetFromProfile}
            kinds={kinds} conditions={conditions} mobility={mobility}
            care24={care24} nurse247={nurse247} budget={budget}
            availChoice={availChoice} dateFrom={dateFrom} dateTo={dateTo}
            setKind={(v) => toggle(kinds, v, setKinds)}
            setCond={(v) => toggle(conditions, v, setConditions)}
            setMob={(v) => toggle(mobility, v, setMobility)}
            setCare24={setCare24} setNurse247={setNurse247}
            setBudget={setBudget} setAvail={setAvailChoice}
            setFrom={setDateFrom} setTo={setDateTo}
          />
        </aside>

        {/* ════ VÝSLEDKY ════ */}
        <div className="min-w-0 flex-1 px-5 py-6 sm:px-7">
          {/* Přepínač režimu */}
          <div className="inline-flex rounded-xl border border-line-2 bg-surface-2 p-1">
            <button
              onClick={() => setMode("recommended")}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-[0.8667rem] font-medium transition-colors a11y-tap ${mode === "recommended" ? "bg-surface text-ink shadow-soft" : "text-ink-2 hover:text-ink"}`}
            >
              <Sparkles size={14} className={mode === "recommended" ? "text-sage-d" : ""} /> Doporučené pro {active.name.split(" ")[0]}
              <span className={`ml-1 rounded-full px-1.5 text-[0.7333rem] ${mode === "recommended" ? "bg-sage-l text-sage-d" : "bg-surface text-ink-3"}`}>{recommendedCount}</span>
            </button>
            <button
              onClick={() => setMode("all")}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-[0.8667rem] font-medium transition-colors a11y-tap ${mode === "all" ? "bg-surface text-ink shadow-soft" : "text-ink-2 hover:text-ink"}`}
            >
              Všechna zařízení
              <span className={`ml-1 rounded-full px-1.5 text-[0.7333rem] ${mode === "all" ? "bg-sky-l text-sky" : "bg-surface text-ink-3"}`}>{allCount}</span>
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-serif text-[1.6rem] font-medium leading-tight text-ink">
                {mode === "recommended"
                  ? `Vybrali jsme ${results.length} ${results.length === 1 ? "zařízení" : results.length < 5 ? "zařízení" : "zařízení"}`
                  : `${results.length} zařízení v okolí`}
              </h1>
              <p className="mt-1 text-[0.8667rem] text-ink-2 a11y-dim">
                {mode === "recommended"
                  ? "Náš výběr podle profilu, rozpočtu a lokality. Koordinátorka ho prošla."
                  : "Praha a okolí · můžete prohledat i mimo náš výběr"}
              </p>
            </div>
            <button onClick={() => setMapOpen(true)} className="flex shrink-0 items-center gap-2 rounded-xl border border-line-2 bg-surface px-4 py-2.5 text-[0.8667rem] font-medium text-ink-2 transition-colors hover:border-sage-bd hover:text-sage-d a11y-tap">
              <MapIcon size={16} /> Zobrazit na mapě
            </button>
          </div>

          {/* Řazení */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[0.7333rem] font-semibold uppercase tracking-wider text-ink-3">Seřadit</span>
            {([["match", "Nejlepší shoda"], ["availability", "Nejdřív dostupné"], ["nearby", "Nejblíž"], ["copay", "Nejlevnější"]] as [SortKey, string][]).map(([k, l]) => (
              <button key={k} onClick={() => setSort(k)} className={`chip a11y-tap ${sort === k ? "border-ink bg-ink text-paper" : "border-line-2 bg-surface text-ink-2 hover:border-ink-3"}`}>{l}</button>
            ))}
          </div>

          {/* Mobilní filtry */}
          <details className="mt-3 lg:hidden">
            <summary className="cursor-pointer text-[0.8667rem] font-medium text-sage-d">Upravit filtry</summary>
            <div className="mt-3 overflow-hidden rounded-xl border border-line-2">
              <Filters
                seniorName={active.name.split(" ")[0]}
                onReset={resetFromProfile}
                kinds={kinds} conditions={conditions} mobility={mobility}
                care24={care24} nurse247={nurse247} budget={budget}
                availChoice={availChoice} dateFrom={dateFrom} dateTo={dateTo}
                setKind={(v) => toggle(kinds, v, setKinds)}
                setCond={(v) => toggle(conditions, v, setConditions)}
                setMob={(v) => toggle(mobility, v, setMobility)}
                setCare24={setCare24} setNurse247={setNurse247}
                setBudget={setBudget} setAvail={setAvailChoice}
                setFrom={setDateFrom} setTo={setDateTo}
              />
            </div>
          </details>

          <div className="mt-5 flex flex-col gap-5">
            {results.map((p) => (
              <ResultCard
                key={p.id}
                p={p}
                onDetail={() => setDetail(p)}
                inSelected={selected.has(p.id)}
                isRecommended={p.recommended}
                onToggle={() => toggleSelected(p.id)}
              />
            ))}
            {results.length === 0 && (
              <div className="card p-10 text-center">
                <p className="text-[1rem] text-ink">Pro tuto kombinaci jsme nic nenašli.</p>
                {mode === "recommended" ? (
                  <>
                    <p className="mt-2 text-[0.8667rem] text-ink-2">Zkuste prohledat všechna zařízení, ne jen náš výběr.</p>
                    <button onClick={() => setMode("all")} className="btn btn-primary mt-4 a11y-tap">Zobrazit všechna zařízení</button>
                  </>
                ) : (
                  <p className="mt-2 text-[0.8667rem] text-ink-2">Zkuste uvolnit některý filtr v levém panelu.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {detail && <DetailModal p={detail} onClose={() => setDetail(null)} />}
      {mapOpen && (
        <MapOverlay
          results={results} points={mapPoints} activeId={activeId}
          setActiveId={setActiveId} onClose={() => setMapOpen(false)} onDetail={setDetail}
        />
      )}
    </AppShell>
  );
}

/* ─── Karta výsledku ─── */
function ResultCard({ p, onDetail, inSelected, isRecommended, onToggle }: {
  p: Provider; onDetail: () => void;
  inSelected: boolean; isRecommended: boolean; onToggle: () => void;
}) {
  const badges = badgesOf(p);
  return (
    <article className={`card overflow-hidden ${p.matchScore >= 95 ? "ring-1 ring-sage-bd" : ""}`}>
      <div className="grid grid-cols-1 md:grid-cols-[260px,1fr,200px]">
        {/* Fotografie */}
        <div className="p-3">
          <ProviderVisual hue={p.hue} className="h-48 w-full rounded-xl sm:h-44 md:h-36" />
          <div className="mt-1.5 grid grid-cols-4 gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="relative">
                <ProviderVisual hue={(p.hue + i * 24) % 360} variant="thumb" className="h-12 w-full rounded-md" />
                <span className="absolute inset-x-0 bottom-0 truncate rounded-b-md bg-ink/45 px-1 py-0.5 text-center text-[0.5333rem] font-medium text-white">
                  {["Pokoj", "Prostory", "Zahrada", "Personál"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col border-t border-line p-5 md:border-l md:border-t-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="font-serif text-[1.2667rem] font-medium text-ink">{p.name}</h3>
                {p.verified && <BadgeCheck className="text-sage" size={16} />}
                {isRecommended && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-sage-bd bg-sage-l px-2 py-0.5 text-[0.7rem] font-semibold text-sage-d">
                    <Sparkles size={10} /> Doporučeno
                  </span>
                )}
              </div>
              <p className="mt-0.5 flex items-center gap-1 text-[0.8rem] text-ink-3">
                <MapPin size={11} /> {p.location} · {careTypeLabel[p.careTypes[0]]}
              </p>
            </div>
          </div>

          {/* Proč doporučujeme — slovní důvod místo procenta */}
          {isRecommended && (
            <div className="mt-2.5 flex items-start gap-2 rounded-lg bg-sage-l/70 px-3 py-2 text-[0.8333rem] text-sage-d">
              <Sparkles size={14} className="mt-0.5 shrink-0" />
              <span><span className="font-medium">Proč doporučujeme:</span> {p.recommendation}</span>
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {badges.map((b, i) => (
              <span key={i} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.8rem] font-medium ${b.cls}`}>
                {b.icon} {b.label}
              </span>
            ))}
          </div>
        </div>

        {/* CTA panel */}
        <div className="flex flex-col gap-2 border-t border-line bg-paper-2 p-5 md:border-l md:border-t-0">
          <div>
            <div className="text-[0.6667rem] font-semibold uppercase tracking-wider text-ink-3">
              Doplatek po příspěvku
              <InfoTip label="Doplatek" text="Co rodina platí měsíčně po odečtení státní podpory." />
            </div>
            <div className="mt-1 font-serif text-[1.6rem] font-medium leading-none text-ink">
              od {p.monthlyCopay.toLocaleString("cs")} Kč
            </div>
            <div className="mt-1 text-[0.8rem] text-ink-3">po příspěvku / měs.</div>
          </div>

          {/* Přidat / Vybráno */}
          {inSelected ? (
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-sage-bd bg-sage-l px-3 py-2 text-[0.8667rem] font-medium text-sage-d">
              <Check size={15} className="shrink-0" /> Vybráno k poptávce
            </div>
          ) : (
            <button
              onClick={onToggle}
              className="btn btn-ghost mt-2 w-full border-sage-bd text-[0.8667rem] text-sage-d hover:bg-sage-l"
            >
              <Plus size={15} /> Přidat k poptávce
            </button>
          )}
          <button onClick={onDetail} className="btn btn-ghost w-full text-[0.9333rem]">
            Detail →
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── Filtry ─── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line">
      <div className="px-4 py-4">
        <div className="mb-2.5 text-[0.7333rem] font-semibold uppercase tracking-wider text-ink-3">{title}</div>
        {children}
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, active, onClick }: { icon: typeof Building2; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[0.8667rem] transition-colors a11y-tap ${active ? "bg-white font-medium text-ink shadow-soft" : "text-ink-2 hover:bg-white/60"}`}>
      <Icon size={16} className={active ? "text-ink" : "text-ink-3"} strokeWidth={1.8} />
      <span className="flex-1">{label}</span>
      {active && <Check size={14} className="text-sage" />}
    </button>
  );
}

function Filters(props: {
  seniorName: string; onReset: () => void;
  kinds: FacilityKind[]; conditions: CareCondition[]; mobility: MobilitySupport[];
  care24: boolean; nurse247: boolean; budget: number;
  availChoice: AvailChoice; dateFrom: string; dateTo: string;
  setKind: (v: FacilityKind) => void; setCond: (v: CareCondition) => void; setMob: (v: MobilitySupport) => void;
  setCare24: (v: boolean) => void; setNurse247: (v: boolean) => void;
  setBudget: (v: number) => void; setAvail: (v: AvailChoice) => void;
  setFrom: (v: string) => void; setTo: (v: string) => void;
}) {
  return (
    <div>
      {/* Nastaveno podle profilu */}
      <div className="border-b border-line bg-sage-l/40 px-4 py-3">
        <div className="flex items-start gap-2">
          <Sparkles size={14} className="mt-0.5 shrink-0 text-sage-d" />
          <div className="text-[0.8rem] leading-snug text-sage-d">
            Nastaveno podle profilu {props.seniorName}.
            <button onClick={props.onReset} className="ml-1 font-medium underline underline-offset-2 hover:no-underline">
              Obnovit
            </button>
          </div>
        </div>
      </div>

      <Section title="Typ péče">
        <Row icon={Building2} label="Domov pro seniory" active={props.kinds.includes("senior_home")} onClick={() => props.setKind("senior_home")} />
        <Row icon={Shield} label="Domov se zvláštním režimem" active={props.kinds.includes("special_regime")} onClick={() => props.setKind("special_regime")} />
        <Row icon={House} label="Domácí péče" active={props.kinds.includes("home_care")} onClick={() => props.setKind("home_care")} />
        <Row icon={HeartHandshake} label="Odlehčovací pobyt" active={props.kinds.includes("respite")} onClick={() => props.setKind("respite")} />
        <Row icon={Bed} label="Krátkodobý pobyt" active={props.kinds.includes("short_stay")} onClick={() => props.setKind("short_stay")} />
      </Section>

      <Section title="Zdravotní stav">
        <Row icon={Brain} label="Demence / Alzheimer" active={props.conditions.includes("dementia")} onClick={() => props.setCond("dementia")} />
        <Row icon={Activity} label="Parkinson" active={props.conditions.includes("parkinson")} onClick={() => props.setCond("parkinson")} />
        <Row icon={Activity} label="Po cévní mozkové příhodě" active={props.conditions.includes("post_stroke")} onClick={() => props.setCond("post_stroke")} />
        <Row icon={Hospital} label="Po hospitalizaci" active={props.conditions.includes("post_hospital")} onClick={() => props.setCond("post_hospital")} />
        <Row icon={HeartHandshake} label="Paliativní péče" active={props.conditions.includes("palliative")} onClick={() => props.setCond("palliative")} />
      </Section>

      <Section title="Pohyblivost">
        <Row icon={Accessibility} label="Bezbariérové" active={props.mobility.includes("barrier_free")} onClick={() => props.setMob("barrier_free")} />
        <Row icon={Armchair} label="Vozík" active={props.mobility.includes("wheelchair")} onClick={() => props.setMob("wheelchair")} />
        <Row icon={Bed} label="Imobilní klient" active={props.mobility.includes("immobile")} onClick={() => props.setMob("immobile")} />
      </Section>

      <Section title="Úroveň péče">
        <Row icon={Users} label="Dohled 24 hodin denně" active={props.care24} onClick={() => props.setCare24(!props.care24)} />
        <Row icon={Stethoscope} label="Zdravotní sestra nonstop" active={props.nurse247} onClick={() => props.setNurse247(!props.nurse247)} />
      </Section>

      <Section title="Rozpočet">
        <div className="px-1">
          <div className="text-[0.8rem] text-ink-2 a11y-dim">Maximální měsíční doplatek</div>
          <div className="mt-2 text-center font-serif text-[1.2rem] font-medium text-ink">
            {props.budget >= 50000 ? "50 000+ Kč" : `${props.budget.toLocaleString("cs")} Kč`}
          </div>
          <input type="range" min={0} max={50000} step={1000} value={props.budget} onChange={(e) => props.setBudget(Number(e.target.value))} className="mt-2 w-full accent-sage" />
          <div className="mt-1 flex justify-between text-[0.7333rem] text-ink-3"><span>0 Kč</span><span>50 000 Kč</span></div>
        </div>
      </Section>

      <Section title="Dostupnost">
        {([["immediate", "Ihned"], ["within_month", "Do 1 měsíce"], ["within_3m", "Do 3 měsíců"], ["any", "Nezáleží"], ["custom", "Vlastní termín"]] as [AvailChoice, string][]).map(([v, l]) => (
          <button key={v} onClick={() => props.setAvail(v)} className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[0.8667rem] transition-colors a11y-tap ${props.availChoice === v ? "bg-surface font-medium text-ink shadow-soft" : "text-ink-2 hover:bg-surface/60"}`}>
            <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${props.availChoice === v ? "border-sage" : "border-line-2"}`}>
              {props.availChoice === v && <span className="h-2 w-2 rounded-full bg-sage" />}
            </span>
            {l}
          </button>
        ))}
        {props.availChoice === "custom" && (
          <div className="mt-2 space-y-2 rounded-lg bg-surface/70 p-3">
            <div>
              <label className="mb-1 block text-[0.7333rem] font-medium text-ink-2">Od</label>
              <input type="date" value={props.dateFrom} onChange={(e) => props.setFrom(e.target.value)} className="w-full rounded-lg border border-line-2 bg-surface px-3 py-2 text-[0.8667rem] text-ink focus:border-sage focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-[0.7333rem] font-medium text-ink-2">Do <span className="text-ink-3">(volitelné)</span></label>
              <input type="date" value={props.dateTo} onChange={(e) => props.setTo(e.target.value)} className="w-full rounded-lg border border-line-2 bg-surface px-3 py-2 text-[0.8667rem] text-ink focus:border-sage focus:outline-none" />
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}

/* ─── Mapa overlay ─── */
function MapOverlay({ results, points, activeId, setActiveId, onClose, onDetail }: {
  results: Provider[];
  points: { id: string; lat: number; lng: number; name: string; location: string; matchScore: number }[];
  activeId: string | null; setActiveId: (id: string) => void; onClose: () => void; onDetail: (p: Provider) => void;
}) {
  // Na mobilu přepínáme mezi mapou a listem
  const [mobileTab, setMobileTab] = useState<"map" | "list">("map");

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-paper">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-line bg-surface px-5 py-3">
        <span className="font-serif text-[1.0667rem] font-medium text-ink">{results.length} nalezených zařízení</span>
        <button onClick={onClose} className="flex items-center gap-1.5 rounded-lg border border-line-2 px-3 py-2 text-[0.8667rem] font-medium text-ink-2 hover:bg-surface-2">
          <X size={15} /> Zavřít
        </button>
      </div>

      {/* Mobile tab switcher */}
      <div className="flex shrink-0 border-b border-line bg-surface md:hidden">
        <button
          onClick={() => setMobileTab("map")}
          className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-[0.8667rem] font-medium transition-colors ${mobileTab === "map" ? "border-b-2 border-sage text-sage-d" : "text-ink-3"}`}
        >
          <MapIcon size={15} /> Mapa
        </button>
        <button
          onClick={() => setMobileTab("list")}
          className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-[0.8667rem] font-medium transition-colors ${mobileTab === "list" ? "border-b-2 border-sage text-sage-d" : "text-ink-3"}`}
        >
          <Menu size={15} /> Seznam
        </button>
      </div>

      {/* Content */}
      <div className="flex min-h-0 flex-1">
        {/* List panel — na mobilu jen když je aktivní tab, na desktopu vždy */}
        <div className={`overflow-y-auto border-r border-line bg-paper px-4 py-4 md:block md:w-2/5 md:min-w-[320px] ${mobileTab === "list" ? "block w-full" : "hidden"}`}>
          <div className="flex flex-col gap-3">
            {results.map((p) => (
              <button key={p.id} onMouseEnter={() => setActiveId(p.id)} onClick={() => setActiveId(p.id)}
                className={`card flex gap-3 p-3 text-left transition-shadow ${activeId === p.id ? "ring-2 ring-sage shadow-soft-lg" : "hover:border-line-2"}`}>
                <ProviderVisual hue={p.hue} variant="thumb" className="h-20 w-24 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-[1rem] font-medium leading-snug text-ink">{p.name}</h3>
                    <span className="shrink-0 font-serif text-[1rem] font-medium text-sage-d">{p.matchScore}%</span>
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-[0.7333rem] text-ink-3"><MapPin size={10} /> {p.location}</p>
                  <p className="mt-1 text-[0.8rem] text-ink-2 a11y-dim">{careTypeLabel[p.careTypes[0]]} · {p.availabilityLabel}</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="font-serif text-[0.9333rem] font-medium text-ink">od {p.monthlyCopay.toLocaleString("cs")} Kč</span>
                    <span onClick={(e) => { e.stopPropagation(); onDetail(p); }} className="text-[0.8rem] font-medium text-sage underline-offset-2 hover:underline">Detail →</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Map panel — na mobilu jen když je aktivní tab, na desktopu vždy */}
        <div className={`min-w-0 flex-1 md:block ${mobileTab === "map" ? "block" : "hidden"}`}>
          <ProviderMapMulti points={points} activeId={activeId} onSelect={setActiveId} height="100%" />
        </div>
      </div>
    </div>
  );
}

/* ─── Detail modal ─── */
function DetailModal({ p, onClose }: { p: Provider; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-paper sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <ProviderVisual hue={p.hue} className="h-44 w-full" />
          <button onClick={onClose} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink hover:bg-paper"><X size={18} /></button>
        </div>
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-serif text-[1.4667rem] font-medium text-ink">{p.name}</h2>
              <p className="mt-1 flex items-center gap-1 text-[0.8667rem] text-ink-3"><MapPin size={14} /> {p.location} · {careTypeLabel[p.careTypes[0]]}</p>
              <p className="mt-0.5 text-[0.8rem] text-ink-3">Zřizovatel: {p.operator}</p>
            </div>
            <div className="shrink-0 text-right">
              <div className="font-serif text-[1.6rem] font-medium leading-none text-sage-d">{p.matchScore} %</div>
              <div className="text-[0.6667rem] uppercase tracking-wider text-ink-3">shoda</div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.facilityKinds.map((k) => <span key={k} className="chip border-line bg-surface text-ink-2">{kindLabel[k]}</span>)}
          </div>
          <p className="mt-5 text-[0.9333rem] leading-relaxed text-ink-2 a11y-dim">{p.description}</p>
          <div className="mt-6 rounded-xl border border-sage-bd bg-sage-l p-5">
            <h3 className="text-[1rem] font-semibold text-sage-d">Proč jsme doporučili toto zařízení</h3>
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {[
                ["Odpovídá zdravotnímu stavu", p.memorySupport ? "Zkušenost s demencí a paměťovou péčí" : "Vhodné pro daný stupeň závislosti"],
                ["Odpovídá rozpočtu", `Doplatek od ${p.monthlyCopay.toLocaleString("cs")} Kč po příspěvku`],
                ["Odpovídá lokalitě", p.distanceKm > 0 ? `${p.distanceKm} km od rodiny` : "Dostupné ve vaší oblasti"],
                ["Odpovídá dostupnosti", p.availabilityLabel],
              ].map(([t, d]) => (
                <li key={t} className="flex items-start gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-sage" strokeWidth={2.5} />
                  <span><span className="block text-[0.8667rem] font-medium text-sage-d">{t}</span><span className="block text-[0.8rem] text-sage-d/80">{d}</span></span>
                </li>
              ))}
            </ul>
          </div>
          <h3 className="mt-6 text-[1rem] font-semibold text-ink">Co je v ceně</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {p.included.map((i) => <li key={i} className="flex items-start gap-2 text-[0.8667rem] text-ink-2 a11y-dim"><Check size={15} className="mt-0.5 shrink-0 text-sage" /> {i}</li>)}
          </ul>
          <h3 className="mt-6 flex items-center text-[1rem] font-semibold text-ink">
            Orientační financování
            <InfoTip label="Financování" text="Orientační rozpis. Konkrétní částky závisí na stupni závislosti a rozsahu služeb." />
          </h3>
          <div className="mt-3 overflow-hidden rounded-xl border border-line bg-surface">
            {p.finance.map((f, i) => (
              <div key={i} className={`flex items-center justify-between px-4 py-2.5 text-[0.8667rem] ${f.kind === "total" ? "bg-sage-l font-semibold text-sage-d" : "border-b border-line text-ink-2 last:border-0"}`}>
                <span>{f.label}</span>
                <span className={f.kind === "support" ? "text-sage" : ""}>{f.amount < 0 ? "− " : ""}{Math.abs(f.amount).toLocaleString("cs")} Kč</span>
              </div>
            ))}
          </div>
          <h3 className="mt-6 text-[1rem] font-semibold text-ink">Poloha a dostupnost</h3>
          <div className="mt-3 overflow-hidden rounded-xl border border-line">
            <ProviderMap lat={p.lat} lng={p.lng} name={p.name} location={p.location} />
          </div>
          <ul className="mt-3 space-y-1.5">
            {p.transit.map((t, i) => {
              const Icon = transitIcon[t.mode];
              return <li key={i} className="flex items-center gap-2.5 text-[0.8667rem] text-ink-2 a11y-dim"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-sage"><Icon size={15} /></span>{t.label}</li>;
            })}
          </ul>
          <div className="mt-6 flex gap-3 rounded-xl bg-sage-l px-4 py-3.5">
            <Phone size={17} className="mt-0.5 shrink-0 text-sage-d" />
            <div>
              <div className="text-[0.7333rem] font-semibold uppercase tracking-wider text-sage-d">Poznámka koordinátorky</div>
              <p className="mt-1 text-[0.8667rem] leading-relaxed text-sage-d">{p.advisorNote}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button className="btn btn-primary flex-1">Ověřit dostupnost <ArrowRight size={16} /></button>
            <button className="btn btn-ghost flex-1"><Phone size={15} /> Domluvit prohlídku</button>
          </div>
        </div>
      </div>
    </div>
  );
}
