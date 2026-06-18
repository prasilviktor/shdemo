"use client";

import React, { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ShieldCheck, Plus, X, Info, ChevronDown,
  Home, Handshake, Users, Sunrise, Building2, Brain,
  Coins, ClipboardList, TrendingUp, Landmark, Stethoscope,
  Receipt, Briefcase, PiggyBank, BarChart3,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { InfoTip, BackLink } from "@/components/ui";
import { useSenior } from "@/lib/senior-context";

const CARE_TYPES = [
  { label: "Domácí péče", base: 8000, Icon: Home },
  { label: "Pečovatelská služba", base: 12000, Icon: Handshake },
  { label: "Osobní asistence", base: 24000, Icon: Users },
  { label: "Denní stacionář", base: 6000, Icon: Sunrise },
  { label: "Pobytová péče", base: 28000, Icon: Building2 },
  { label: "Domov se zvláštním režimem", base: 32000, Icon: Brain },
];
const RESIDENTIAL_IDX = [4, 5];
const BAR_COLORS = ["bg-sage", "bg-[#6A9A88]", "bg-amber", "bg-sky", "bg-[#8AB0C0]", "bg-[#A88AC0]", "bg-[#C0A050]"];

type Contributor = { id: number; label: string; amount: number };

export default function FinancePage() {
  return (
    <AppShell title="Financování" greeting={false}>
      <FinanceInner />
    </AppShell>
  );
}

function FinanceInner() {
  const [careType, setCareType] = useState(0);
  const [duchod, setDuchod] = useState(19000);
  const [prispevek, setPrispevek] = useState(4400);
  const [uspory, setUspory] = useState(250000);
  const [majetek, setMajetek] = useState(0); // měsíční výnos z majetku
  const [usporyMonthly, setUsporyMonthly] = useState(0); // kolik z úspor měsíčně
  const [useAssets, setUseAssets] = useState(false);
  const [family, setFamily] = useState<Contributor[]>([{ id: 1, label: "Dcera Jana", amount: 3000 }]);
  const [nextId, setNextId] = useState(2);

  const isResidential = RESIDENTIAL_IDX.includes(careType);
  const base = CARE_TYPES[careType].base;
  const effPrispevek = isResidential ? 0 : prispevek;
  const familyTotal = family.reduce((s, f) => s + f.amount, 0);
  const assetsMonthly = useAssets ? usporyMonthly + majetek : 0;
  const income = duchod + effPrispevek + familyTotal + assetsMonthly;
  const deficit = Math.max(0, base - income);
  const surplus = Math.max(0, income - base);

  const segments = [
    { label: "Důchod", value: duchod, color: BAR_COLORS[0] },
    ...(effPrispevek > 0 ? [{ label: "Příspěvek", value: effPrispevek, color: BAR_COLORS[1] }] : []),
    ...family.map((f, i) => ({ label: f.label, value: f.amount, color: BAR_COLORS[(i + 2) % BAR_COLORS.length] })),
    ...(useAssets && assetsMonthly > 0 ? [{ label: "Úspory + majetek", value: assetsMonthly, color: BAR_COLORS[6] }] : []),
  ];

  function addC() { setFamily((f) => [...f, { id: nextId, label: `Člen rodiny ${f.length + 1}`, amount: 2000 }]); setNextId((n) => n + 1); }
  function updC(id: number, patch: Partial<Contributor>) { setFamily((f) => f.map((c) => (c.id === id ? { ...c, ...patch } : c))); }
  function rmC(id: number) { setFamily((f) => f.filter((c) => c.id !== id)); }

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-7">
      <BackLink href="/pomoc" label="Pomoc a podpora" />
      <div className="inline-flex items-center gap-2 rounded-full bg-sage-l px-3 py-1.5 text-[0.8rem] font-medium text-sage-d">
        <Coins size={14} /> Průvodce financováním péče
      </div>
      <h1 className="mt-4 font-serif text-[1.8667rem] font-medium leading-tight text-ink">
        Spočítáme to spolu — a vysvětlíme možnosti.
      </h1>
      <p className="mt-2 max-w-xl text-[0.9333rem] leading-relaxed text-ink-2 a11y-dim">
        Nahoře si rozpočet rychle spočítáte. Níže najdete vysvětlení každého zdroje — rozbalte si jen to, co potřebujete.
      </p>

      {/* ═══ KALKULAČKA ═══ */}
      <div className="mt-6 card p-6">
        <h2 className="font-serif text-[1.3333rem] font-medium text-ink">Orientační rozvaha</h2>

        <label className="field-label mt-4">Typ péče</label>
        <div className="flex flex-wrap gap-2">
          {CARE_TYPES.map((c, i) => (
            <button key={c.label} onClick={() => setCareType(i)} className={`chip a11y-tap ${careType === i ? "border-sage bg-sage-l text-sage-d" : "border-line-2 bg-surface text-ink-2 hover:border-ink-3"}`}>
              <c.Icon size={14} className="shrink-0" /> {c.label}
            </button>
          ))}
        </div>

        {isResidential && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-sky-bd bg-sky-l px-4 py-3 text-[0.8667rem] text-sky">
            <Info size={16} className="mt-0.5 shrink-0" />
            U pobytové péče jde příspěvek na péči přímo zařízení — proto ho nepočítáme jako rodinný zdroj.
          </div>
        )}

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Slider label="Důchod seniora" value={duchod} min={0} max={35000} step={500} onChange={setDuchod} color={BAR_COLORS[0]} />
          {!isResidential && (
            <Slider label="Příspěvek na péči" value={prispevek} min={0} max={19200} step={100} onChange={setPrispevek} color={BAR_COLORS[1]}
              tip={["Příspěvek na péči", "Státní dávka dle stupně závislosti. U domácí péče přijde příjemci."]} />
          )}
        </div>

        {/* Rodina */}
        <div className="mt-5 rounded-xl border border-line bg-paper-2 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[0.7333rem] font-semibold uppercase tracking-wider text-ink-3">Jak se skládá rodina</span>
            <span className="text-[0.8rem] font-medium text-ink">celkem {familyTotal.toLocaleString("cs")} Kč</span>
          </div>
          <div className="space-y-3">
            {family.map((c, i) => (
              <div key={c.id} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${BAR_COLORS[(i + 2) % BAR_COLORS.length]}`} />
                <input value={c.label} onChange={(e) => updC(c.id, { label: e.target.value })} className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-[0.8667rem] text-ink focus:border-sage focus:outline-none" />
                <div className="flex items-center gap-1 rounded-lg border border-line bg-surface px-2.5 py-2">
                  <input type="number" value={c.amount} step={500} min={0} onChange={(e) => updC(c.id, { amount: Math.max(0, Number(e.target.value)) })} className="w-20 bg-transparent text-right text-[0.8667rem] text-ink focus:outline-none" />
                  <span className="text-[0.8rem] text-ink-3">Kč</span>
                </div>
                <button onClick={() => rmC(c.id)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-3 hover:bg-surface-2 hover:text-peach"><X size={15} /></button>
              </div>
            ))}
          </div>
          <button onClick={addC} className="mt-3 flex items-center gap-1.5 rounded-lg border border-dashed border-line-2 px-3 py-2 text-[0.8667rem] font-medium text-sage-d hover:bg-sage-l"><Plus size={15} /> Přidat člena rodiny</button>
        </div>

        {/* Majetek + úspory */}
        <div className="mt-3 rounded-xl border border-line bg-paper-2 p-4">
          <label className="flex cursor-pointer items-center gap-2.5">
            <span className={`relative h-5 w-9 rounded-full transition-colors ${useAssets ? "bg-sage" : "bg-line-2"}`}>
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${useAssets ? "left-[18px]" : "left-0.5"}`} />
            </span>
            <input type="checkbox" className="sr-only" checked={useAssets} onChange={(e) => setUseAssets(e.target.checked)} />
            <span className="text-[0.8667rem] font-medium text-ink">Zohlednit úspory a majetek</span>
          </label>
          <p className="mt-1.5 text-[0.8rem] text-ink-3">Rozhodnutí o využití majetku patří vždy seniorovi a rodině. Bereme ho jen jako součást reality, nic neprodáváme.</p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="field-label">Úspory celkem</label>
              <NumInput value={uspory} onChange={setUspory} suffix="Kč" />
              <label className="field-label mt-2">Z toho měsíčně použít</label>
              <NumInput value={usporyMonthly} onChange={setUsporyMonthly} suffix="Kč/měs" disabled={!useAssets} />
            </div>
            <div>
              <label className="field-label">Majetek</label>
              <div className="rounded-xl border border-line-2 bg-surface px-3.5 py-2.5 text-[0.8667rem] text-ink-2">byt v osobním vlastnictví</div>
              <label className="field-label mt-2">Výnos (pronájem) měsíčně</label>
              <NumInput value={majetek} onChange={setMajetek} suffix="Kč/měs" disabled={!useAssets} />
            </div>
          </div>
        </div>

        {/* ── VÝSLEDEK ── */}
        <div className="mt-6 rounded-xl bg-ink p-6 text-paper">
          <div className="flex items-center justify-between">
            <span className="text-[0.8667rem] text-[#cfc8bb]">Náklady na péči</span>
            <span className="font-serif text-[1.3333rem] font-medium">{base.toLocaleString("cs")} Kč</span>
          </div>
          <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
            {segments.map((s) => (
              <div key={s.label} className="flex items-center justify-between text-[0.8667rem]">
                <span className="flex items-center gap-2 text-[#cfc8bb]"><span className={`h-2.5 w-2.5 rounded-full ${s.color}`} />{s.label}</span>
                <span className="font-medium text-paper">{s.value.toLocaleString("cs")} Kč</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-white/10 pt-1.5 text-[0.8667rem]">
              <span className="font-medium text-paper">Zdroje celkem</span>
              <span className="font-semibold text-paper">{income.toLocaleString("cs")} Kč</span>
            </div>
          </div>
          <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-white/15">
            {segments.map((s, i) => <div key={i} className={s.color} style={{ width: `${Math.min(100, (s.value / Math.max(base, income, 1)) * 100)}%` }} />)}
            {deficit > 0 && <div className="bg-peach" style={{ width: `${(deficit / Math.max(base, income, 1)) * 100}%` }} />}
          </div>
          <div className={`mt-4 rounded-xl px-5 py-4 text-center ${deficit > 0 ? "bg-peach/20" : "bg-sage/25"}`}>
            <div className="text-[0.8rem] text-[#cfc8bb]">{deficit > 0 ? "Chybí přibližně" : "Měsíčně zbývá přibližně"}</div>
            <div className="mt-0.5 font-serif text-[2rem] font-medium text-paper">{(deficit > 0 ? deficit : surplus).toLocaleString("cs")} Kč</div>
          </div>
        </div>
      </div>

      {/* ═══ ACCORDION — VEŠKERÝ OBSAH ZACHOVÁN ═══ */}
      <div className="mt-6 space-y-2.5">
        <Acc title="Z čeho lze péči financovat" defaultOpen>
          <SourceList items={[
            [Coins, "Důchod seniora", "Nejčastější základ. Průměrný starobní důchod je kolem 19 000 Kč — u řady seniorů pokryje 40–60 % nákladů."],
            [ClipboardList, "Příspěvek na péči", "Státní dávka 880–19 200 Kč dle stupně. U domácí péče přijde rodině, u pobytové jde přímo zařízení."],
            [Users, "Příspěvky rodiny", "Děti, sourozenci, partner. Koordinujeme transparentně, bez konfliktů."],
            [Home, "Příspěvek na bydlení", "Pro seniory s nízkými příjmy, lze kombinovat s příspěvkem na péči."],
            [Handshake, "Odlehčovací služby", "Obec či kraj může hradit krátkodobé pobyty, když pečuje rodina."],
          ]} />
        </Acc>

        <Acc title="Kolik péče obvykle stojí">
          <div className="grid gap-2.5 sm:grid-cols-2">
            {([
              [Home, "Domácí péče", "4 000 – 12 000 Kč"],
              [Handshake, "Pečovatelská služba", "6 000 – 18 000 Kč"],
              [Users, "Osobní asistence", "12 000 – 35 000 Kč"],
              [Sunrise, "Denní stacionář", "3 000 – 9 000 Kč"],
              [Building2, "Pobytová péče", "18 000 – 40 000 Kč"],
              [Brain, "Domov se zvláštním režimem", "20 000 – 45 000 Kč"],
            ] as [LucideIcon, string, string][]).map(([Icon, t, r]) => (
              <div key={t} className="rounded-xl border border-line bg-surface p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage-l text-sage-d"><Icon size={16} /></div>
                <div className="mt-1 text-[0.9333rem] font-medium text-ink">{t}</div>
                <div className="text-[0.9333rem] font-medium text-sage-d">{r} <span className="text-[0.7333rem] font-normal text-ink-3">/ měs</span></div>
              </div>
            ))}
          </div>
          <p className="mt-3 rounded-lg bg-amber-l px-4 py-2.5 text-[0.8rem] text-amber">Ceny jsou orientační a liší se podle regionu a poskytovatele.</p>
        </Acc>

        <Acc title="Jak financují péči jiné rodiny">
          <div className="space-y-3">
            {([
              [Home, "Maminka — domácí péče", "Důchod 18 000 + příspěvek 4 400 pokryjí domácí péči i běžné výdaje. Rodina nedoplácí.", "14 500 Kč/měs"],
              [Handshake, "Tatínek po mrtvici", "Příspěvek III. stupně + stacionář 2 dny/týden + odlehčovací pobyty dávají rodině prostor.", "9 000 Kč/měs"],
              [Building2, "Umístění do domova", "Příspěvek jde přímo domovu. Rodina počítá s důchodem a doplatkem.", "28 000 Kč/měs"],
            ] as [LucideIcon, string, string, string][]).map(([Icon, t, d, c]) => (
              <div key={t} className="rounded-xl border border-line bg-surface p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sage-l text-sage-d shrink-0">
                      <Icon size={14} />
                    </span>
                    <span className="text-[0.9333rem] font-medium text-ink">{t}</span>
                  </div>
                  <span className="font-serif text-[0.9333rem] font-medium text-ink shrink-0">{c}</span>
                </div>
                <p className="mt-1 text-[0.8667rem] leading-relaxed text-ink-2 a11y-dim">{d}</p>
              </div>
            ))}
          </div>
        </Acc>

        <Acc title="Majetek seniora">
          <SourceList items={[
            [PiggyBank, "Úspory a investice", "Naspořené prostředky, spořicí účty, investice. Lze využít postupně."],
            [Home, "Byt / dům", "Nemovitost v osobním vlastnictví — lze pronajmout, případně později prodat."],
            [Building2, "Chata / vedlejší nemovitost", "Pronájem nebo prodej jako jednorázový zdroj na delší období péče."],
            [TrendingUp, "Výnos z pronájmu", "Pravidelný měsíční příjem, který může pokrýt část nákladů na péči."],
          ]} />
          <p className="mt-3 rounded-lg bg-surface-2 px-4 py-2.5 text-[0.8rem] text-ink-2 a11y-dim">Majetek je součást finanční reality rodiny, ne produkt k prodeji. Rozhodnutí je vždy na seniorovi a rodině.</p>
        </Acc>

        <Acc title="Reverzní hypotéka">
          <p className="text-[0.8667rem] leading-relaxed text-ink-2 a11y-dim">
            Renta z nemovitosti — senior čerpá z hodnoty bydlení a zůstává v něm. Dluh se splácí později, obvykle z prodeje.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-sage-bd bg-sage-l p-4">
              <div className="text-[0.7333rem] font-semibold uppercase tracking-wider text-sage-d">Může pomoci, když</div>
              <ul className="mt-2 space-y-1.5 text-[0.8667rem] text-sage-d"><li>• senior chce zůstat ve svém,</li><li>• důchod a příspěvky nestačí,</li><li>• rodina nechce hned prodávat.</li></ul>
            </div>
            <div className="rounded-xl border border-peach-bd bg-peach-l p-4">
              <div className="text-[0.7333rem] font-semibold uppercase tracking-wider text-peach">Na co pozor</div>
              <ul className="mt-2 space-y-1.5 text-[0.8667rem] text-peach"><li>• úroky snižují dědictví,</li><li>• složité podmínky,</li><li>• ne každý produkt je férový.</li></ul>
            </div>
          </div>
          <p className="mt-3 rounded-lg bg-surface-2 px-4 py-2.5 text-[0.8rem] text-ink-2 a11y-dim">Vážné rozhodnutí o majetku rodiny. Doporučujeme nezávislého poradce. Žádnou banku ani produkt nedoporučujeme.</p>
        </Acc>

        <Acc title="Další možnosti financování">
          <SourceList items={[
            [Stethoscope, "Úhrada od zdravotní pojišťovny", "Část ošetřovatelské péče (odběry, převazy, aplikace léků) hradí pojišťovna."],
            [Landmark, "Dávky pomoci v hmotné nouzi", "Mimořádná okamžitá pomoc při náhlé tíživé situaci."],
            [Receipt, "Slevy na dani", "Pečující osoba může uplatnit slevu na dani za vyživovanou osobu."],
            [Briefcase, "Nezávislé finanční poradenství", "Při větším deficitu pomůže placený nezávislý poradce — ne provizní prodejce."],
          ]} />
        </Acc>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-sage-bd bg-sage-l p-4 text-[0.8667rem] text-sage-d">
        <ShieldCheck size={18} className="mt-0.5 shrink-0" />
        Nejsme finanční poradci a nic vám neprodáváme. Naším cílem je, abyste si mohli dovolit péči, kterou potřebujete.
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange, color, tip }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; color: string; tip?: [string, string] }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[0.8667rem] font-medium text-ink-2 a11y-dim"><span className={`h-2.5 w-2.5 rounded-full ${color}`} />{label}{tip && <InfoTip label={tip[0]} text={tip[1]} />}</span>
        <span className="text-[0.9333rem] font-medium text-ink">{value.toLocaleString("cs")} Kč</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1.5 w-full accent-sage" />
    </div>
  );
}

function NumInput({ value, onChange, suffix, disabled }: { value: number; onChange: (v: number) => void; suffix: string; disabled?: boolean }) {
  return (
    <div className={`flex items-center gap-1 rounded-xl border border-line-2 bg-surface px-3 py-2 ${disabled ? "opacity-50" : ""}`}>
      <input type="number" value={value} step={500} min={0} disabled={disabled} onChange={(e) => onChange(Math.max(0, Number(e.target.value)))} className="w-full bg-transparent text-[0.8667rem] text-ink focus:outline-none" />
      <span className="shrink-0 text-[0.8rem] text-ink-3">{suffix}</span>
    </div>
  );
}

function Acc({ title, children, defaultOpen }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between px-5 py-4 text-left a11y-tap">
        <span className="font-serif text-[1.0667rem] font-medium text-ink">{title}</span>
        <ChevronDown size={18} className={`text-ink-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t border-line px-5 py-4">{children}</div>}
    </div>
  );
}

function SourceList({ items }: { items: [LucideIcon, string, string][] }) {
  return (
    <div className="space-y-2.5">
      {items.map(([Icon, t, d]) => (
        <div key={t} className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sage-l text-sage-d"><Icon size={16} /></span>
          <div><div className="text-[0.9333rem] font-medium text-ink">{t}</div><div className="mt-0.5 text-[0.8667rem] leading-relaxed text-ink-2 a11y-dim">{d}</div></div>
        </div>
      ))}
    </div>
  );
}
