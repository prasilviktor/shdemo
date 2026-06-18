"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Phone, Check, AlertTriangle, FileText, HeartHandshake, Sparkles, HandHeart, Brain, Stethoscope, Repeat, Home as HomeIcon, ClipboardList, BatteryLow, Coins, Bird, type LucideIcon } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { BackLink } from "@/components/ui";


type Step = { icon: React.ReactNode; title: string; items: string[] };
type Situation = {
  id: string; Icon: LucideIcon; title: string; lead: string;
  guide: Step[];
  links: { label: string; href: string }[];
};

const stepMeta = [
  { icon: <Sparkles size={16} />, label: "Co udělat nyní" },
  { icon: <AlertTriangle size={16} />, label: "Na co si dát pozor" },
  { icon: <FileText size={16} />, label: "Dávky a příspěvky" },
  { icon: <HeartHandshake size={16} />, label: "Jaké služby pomohou" },
  { icon: <Check size={16} />, label: "Jak pomůže SENIOR HOUSE" },
];

const SITUATIONS: Situation[] = [
  {
    id: "zacina", Icon: HandHeart, title: "Maminka začíná potřebovat pomoc",
    lead: "Drobné věci přestávají jít samy. Ještě to není krize, ale je čas se zorientovat.",
    guide: [
      { icon: stepMeta[0].icon, title: stepMeta[0].label, items: ["Sepište, s čím konkrétně potřebuje pomoc a jak často", "Promluvte si v rodině, kdo co může zajistit", "Zvažte pár hodin domácí péče týdně"] },
      { icon: stepMeta[1].icon, title: stepMeta[1].label, items: ["Nepodceňujte drobné signály (léky, pády, výživa)", "Nečekejte na krizi — řešení se hledá klidněji předem"] },
      { icon: stepMeta[2].icon, title: stepMeta[2].label, items: ["Příspěvek na péči (i lehká závislost má nárok)", "Příspěvek na bydlení, pokud žije sama s nízkým příjmem"] },
      { icon: stepMeta[3].icon, title: stepMeta[3].label, items: ["Domácí (terénní) pečovatelská služba", "Donáška obědů, úklid, doprovod k lékaři"] },
      { icon: stepMeta[4].icon, title: stepMeta[4].label, items: ["Najdeme ověřenou domácí péči ve vašem okolí", "Provedeme vás žádostí o příspěvek na péči"] },
    ],
    links: [{ label: "Najít domácí péči", href: "/search" }, { label: "Průvodce příspěvkem", href: "/prispevek" }],
  },
  {
    id: "demence", Icon: Brain, title: "Táta má demenci",
    lead: "Diagnóza demence mění hodně. Důležité je bezpečí a klidný režim.",
    guide: [
      { icon: stepMeta[0].icon, title: stepMeta[0].label, items: ["Zajistěte bezpečí domova (sporák, zámky, orientační prvky)", "Zaveďte předvídatelný denní režim", "Spojte se s poradnou pro pečující"] },
      { icon: stepMeta[1].icon, title: stepMeta[1].label, items: ["Nemoc postupuje — plánujte další fáze dopředu", "Myslete na svéprávnost a plnou moc, dokud to jde", "Hlídejte vlastní vyčerpání"] },
      { icon: stepMeta[2].icon, title: stepMeta[2].label, items: ["Příspěvek na péči — u demence často vyšší stupeň", "Při zhoršení požádejte o přehodnocení stupně"] },
      { icon: stepMeta[3].icon, title: stepMeta[3].label, items: ["Domov se zvláštním režimem (specializace na demenci)", "Denní stacionář, odlehčovací pobyty", "Svépomocné skupiny pro pečující"] },
      { icon: stepMeta[4].icon, title: stepMeta[4].label, items: ["Vyfiltrujeme zařízení se zkušeností s demencí", "Spočítáme financování pobytové péče"] },
    ],
    links: [{ label: "Zařízení s podporou paměti", href: "/search" }, { label: "Spočítat financování", href: "/finance" }],
  },
  {
    id: "nemocnice", Icon: Stethoscope, title: "Po návratu z nemocnice",
    lead: "Propuštění je blízko a doma to zatím nezvládne sám.",
    guide: [
      { icon: stepMeta[0].icon, title: stepMeta[0].label, items: ["Vyžádejte si propouštěcí zprávu a doporučení", "Zajistěte zdravotnické pomůcky domů", "Zvažte krátkodobý (respitní) pobyt"] },
      { icon: stepMeta[1].icon, title: stepMeta[1].label, items: ["Riziko zhoršení bez návazné péče", "Nepodceňte rehabilitaci v prvních týdnech"] },
      { icon: stepMeta[2].icon, title: stepMeta[2].label, items: ["Příspěvek na péči", "Úhrada zdravotní péče pojišťovnou (ošetřovatelství doma)"] },
      { icon: stepMeta[3].icon, title: stepMeta[3].label, items: ["Krátkodobá pobytová péče", "Domácí zdravotní péče (home care), fyzioterapie"] },
      { icon: stepMeta[4].icon, title: stepMeta[4].label, items: ["Najdeme volný krátkodobý pobyt s rychlým nástupem", "Koordinátorka pomůže s přechodem z nemocnice"] },
    ],
    links: [{ label: "Najít krátkodobou péči", href: "/search" }, { label: "Promluvit s koordinátorkou", href: "/koordinator" }],
  },
  {
    id: "nestaci", Icon: Repeat, title: "Domácí péče přestává stačit",
    lead: "Potřeb přibývá a domácí péče už nestíhá pokrýt celý den.",
    guide: [
      { icon: stepMeta[0].icon, title: stepMeta[0].label, items: ["Zhodnoťte, kolik hodin péče denně reálně potřebuje", "Porovnejte náklady domácí vs. pobytové péče", "Prohlédněte si vhodná zařízení"] },
      { icon: stepMeta[1].icon, title: stepMeta[1].label, items: ["Přechod do zařízení není selhání rodiny", "Rozhodujte s předstihem, ne v krizi"] },
      { icon: stepMeta[2].icon, title: stepMeta[2].label, items: ["Při zhoršení požádejte o vyšší stupeň příspěvku", "U pobytu jde příspěvek přímo zařízení"] },
      { icon: stepMeta[3].icon, title: stepMeta[3].label, items: ["Pobytová péče (domov pro seniory)", "Kombinace stacionáře a domácí péče jako mezikrok"] },
      { icon: stepMeta[4].icon, title: stepMeta[4].label, items: ["Porovnáme pobytová zařízení podle stavu a rozpočtu", "Spočítáme reálný doplatek rodiny"] },
    ],
    links: [{ label: "Najít pobytovou péči", href: "/search" }, { label: "Spočítat financování", href: "/finance" }],
  },
  {
    id: "domov", Icon: HomeIcon, title: "Potřebujeme najít domov seniorů",
    lead: "Rozhodnutí padlo. Teď najít to správné místo.",
    guide: [
      { icon: stepMeta[0].icon, title: stepMeta[0].label, items: ["Ujasněte si lokalitu (blízko rodiny) a rozpočet", "Vyberte 2–3 zařízení a domluvte prohlídky", "Připravte dokumenty"] },
      { icon: stepMeta[1].icon, title: stepMeta[1].label, items: ["Čekací doby — žádost podávejte včas", "Při prohlídce sledujte personál a atmosféru, ne jen vybavení"] },
      { icon: stepMeta[2].icon, title: stepMeta[2].label, items: ["Příspěvek na péči jde domovu", "Doložte rozhodnutí o stupni závislosti"] },
      { icon: stepMeta[3].icon, title: stepMeta[3].label, items: ["Domov pro seniory, domov se zvláštním režimem", "Sociální pracovník zařízení vám poradí s nástupem"] },
      { icon: stepMeta[4].icon, title: stepMeta[4].label, items: ["Porovnáme domovy podle shody s vaší situací", "Připravíte dokumenty jednou, sdílíte všem najednou"] },
    ],
    links: [{ label: "Porovnat domovy", href: "/search" }, { label: "Připravit dokumenty", href: "/documents" }],
  },
  {
    id: "prispevek", Icon: ClipboardList, title: "Jak získat příspěvek na péči",
    lead: "Státní podpora, na kterou má senior nárok.",
    guide: [
      { icon: stepMeta[0].icon, title: stepMeta[0].label, items: ["Zjistěte orientační stupeň závislosti", "Podejte žádost na úřadu práce", "Připravte lékařské zprávy"] },
      { icon: stepMeta[1].icon, title: stepMeta[1].label, items: ["Při sociálním šetření popisujte horší dny, ne ty dobré", "Proti rozhodnutí lze do 15 dnů podat odvolání"] },
      { icon: stepMeta[2].icon, title: stepMeta[2].label, items: ["Příspěvek na péči (880–19 200 Kč dle stupně)", "Lze kombinovat s příspěvkem na bydlení"] },
      { icon: stepMeta[3].icon, title: stepMeta[3].label, items: ["Sociální poradny pomohou s vyplněním", "Sociální odbor obce poradí v místě"] },
      { icon: stepMeta[4].icon, title: stepMeta[4].label, items: ["Provedeme vás krok za krokem celým procesem", "Spočítáte si orientační nárok během dvou minut"] },
    ],
    links: [{ label: "Průvodce příspěvkem", href: "/prispevek" }],
  },
  {
    id: "vycerpani", Icon: BatteryLow, title: "Pečující rodina je vyčerpaná",
    lead: "Pečovat o blízkého je náročné. Na pomoc máte právo i vy.",
    guide: [
      { icon: stepMeta[0].icon, title: stepMeta[0].label, items: ["Přiznejte si, že potřebujete oddech — je to v pořádku", "Zvažte odlehčovací (respitní) pobyt", "Rozdělte péči mezi více členů rodiny"] },
      { icon: stepMeta[1].icon, title: stepMeta[1].label, items: ["Vyhoření pečujících je vážné a časté", "Nezůstávejte na to sami"] },
      { icon: stepMeta[2].icon, title: stepMeta[2].label, items: ["Příspěvek na péči lze použít i na odlehčovací služby", "Možná sleva na dani za vyživovanou osobu"] },
      { icon: stepMeta[3].icon, title: stepMeta[3].label, items: ["Odlehčovací (respitní) pobyty", "Denní stacionáře", "Psychologické poradny a svépomocné skupiny"] },
      { icon: stepMeta[4].icon, title: stepMeta[4].label, items: ["Najdeme odlehčovací službu, ať si odpočinete", "Koordinátorka převezme část organizace za vás"] },
    ],
    links: [{ label: "Odlehčovací služby", href: "/search" }, { label: "Promluvit s koordinátorkou", href: "/koordinator" }],
  },
  {
    id: "finance", Icon: Coins, title: "Jak financovat péči",
    lead: "Péče stojí peníze, ale možností je víc, než se zdá.",
    guide: [
      { icon: stepMeta[0].icon, title: stepMeta[0].label, items: ["Spočítejte si orientační rozvahu", "Ověřte nárok na příspěvek na péči a na bydlení", "Zjistěte, co hradí pojišťovna"] },
      { icon: stepMeta[1].icon, title: stepMeta[1].label, items: ["Pozor na nevýhodné finanční produkty", "Rozhodnutí o majetku nedělejte ve spěchu"] },
      { icon: stepMeta[2].icon, title: stepMeta[2].label, items: ["Příspěvek na péči, příspěvek na bydlení", "Úhrada ošetřovatelské péče pojišťovnou"] },
      { icon: stepMeta[3].icon, title: stepMeta[3].label, items: ["Nezávislé finanční poradenství (placené, ne provizní)", "Sociální poradny zdarma"] },
      { icon: stepMeta[4].icon, title: stepMeta[4].label, items: ["Spočítáme rozpočet a vysvětlíme každý zdroj", "Ukážeme, co stát a pojišťovna pokryjí"] },
    ],
    links: [{ label: "Průvodce financováním", href: "/finance" }, { label: "Příspěvek na péči", href: "/prispevek" }],
  },
  {
    id: "umrti", Icon: Bird, title: "Po úmrtí partnera",
    lead: "Náhlá samota a spousta praktických věcí najednou.",
    guide: [
      { icon: stepMeta[0].icon, title: stepMeta[0].label, items: ["Dejte si čas — nic se nemusí řešit hned", "Zhodnoťte, co partner dříve zajišťoval", "Zajistěte společnost na část dne"] },
      { icon: stepMeta[1].icon, title: stepMeta[1].label, items: ["Riziko osamělosti a zhoršení soběstačnosti", "Myslete na psychickou podporu, nejen na péči"] },
      { icon: stepMeta[2].icon, title: stepMeta[2].label, items: ["Vdovský/vdovecký důchod", "Přehodnocení příspěvků po změně situace"] },
      { icon: stepMeta[3].icon, title: stepMeta[3].label, items: ["Domácí péče nebo společnost na část dne", "Krizová linka a psychologická poradna"] },
      { icon: stepMeta[4].icon, title: stepMeta[4].label, items: ["Najdeme domácí péči i společnost", "Koordinátorka pomůže se zorientovat bez spěchu"] },
    ],
    links: [{ label: "Najít domácí péči", href: "/search" }, { label: "Promluvit s koordinátorkou", href: "/koordinator" }],
  },
];

export default function SituacePage() {
  const [open, setOpen] = useState<Situation | null>(null);
  return (
    <AppShell title="Životní situace" greeting={false}>
      <div className="mx-auto max-w-4xl px-5 py-6 sm:px-7">
        {!open ? (
          <>
            <BackLink href="/pomoc" label="Pomoc a podpora" />
            <h1 className="font-serif text-[1.7333rem] font-medium leading-tight text-ink">V jaké situaci právě jste?</h1>
            <p className="mt-2 max-w-xl text-[0.9333rem] leading-relaxed text-ink-2 a11y-dim">
              Nemusíte vědět, jakou službu nebo formulář hledat. Vyberte situaci, která vám je blízká — a my vám ukážeme cestu.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SITUATIONS.map((s) => (
                <button key={s.id} onClick={() => setOpen(s)} className="card flex flex-col items-start p-5 text-left transition-colors hover:border-sage-bd a11y-tap">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage-l text-sage-d">
                    <s.Icon size={22} strokeWidth={1.8} />
                  </span>
                  <h2 className="mt-3 font-serif text-[1.1333rem] font-medium leading-snug text-ink">{s.title}</h2>
                  <span className="mt-3 flex items-center gap-1 text-[0.8667rem] font-medium text-sage-d">Ukázat cestu <ArrowRight size={14} /></span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <SituationGuide s={open} onBack={() => setOpen(null)} />
        )}
      </div>
    </AppShell>
  );
}

function SituationGuide({ s, onBack }: { s: Situation; onBack: () => void }) {
  const [step, setStep] = useState(0);
  const TOTAL = s.guide.length;
  const cur = s.guide[step];

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-[0.8667rem] font-medium text-ink-2 hover:text-ink">
        <ArrowLeft size={15} /> Zpět na situace
      </button>

      <div className="mt-4 flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sage-l text-sage-d">
          <s.Icon size={28} strokeWidth={1.8} />
        </span>
        <div>
          <h1 className="font-serif text-[1.7333rem] font-medium leading-tight text-ink">{s.title}</h1>
          <p className="mt-1.5 text-[1rem] text-ink-2 a11y-dim">{s.lead}</p>
        </div>
      </div>

      {/* Průvodce krok za krokem */}
      <div className="mt-6 card p-6">
        {/* Progress kroky */}
        <div className="flex flex-wrap gap-1.5">
          {s.guide.map((g, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7333rem] font-medium transition-colors a11y-tap ${
                i === step ? "border-sage bg-sage text-white" : i < step ? "border-sage-bd bg-sage-l text-sage-d" : "border-line-2 bg-surface text-ink-3"
              }`}
            >
              {g.icon} <span className="hidden sm:inline">{g.title}</span><span className="sm:hidden">{i + 1}</span>
            </button>
          ))}
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-2 text-[0.6667rem] font-semibold uppercase tracking-wider text-sage">
            Krok {step + 1} z {TOTAL}
          </div>
          <h2 className="mt-1 flex items-center gap-2 font-serif text-[1.3333rem] font-medium text-ink">
            <span className="text-sage">{cur.icon}</span> {cur.title}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {cur.items.map((it) => (
              <li key={it} className="flex items-start gap-2.5 text-[0.9333rem] text-ink">
                <Check size={16} className="mt-0.5 shrink-0 text-sage" strokeWidth={2.5} /> {it}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex items-center gap-3">
          {step > 0 && <button onClick={() => setStep((x) => x - 1)} className="btn btn-ghost text-[0.8667rem]"><ArrowLeft size={15} /> Zpět</button>}
          <span className="ml-auto" />
          {step < TOTAL - 1 ? (
            <button onClick={() => setStep((x) => x + 1)} className="btn btn-primary text-[0.8667rem]">Další krok <ArrowRight size={15} /></button>
          ) : (
            <span className="text-[0.8rem] text-ink-3">Hotovo — níže najdete pomoc a služby</span>
          )}
        </div>
      </div>

      {/* Co může udělat SENIOR HOUSE */}
      <div className="mt-4 overflow-hidden rounded-xl2 border border-sage-bd bg-sage-l p-5">
        <div className="text-[0.6667rem] font-semibold uppercase tracking-wider text-sage-d">Co pro vás SENIOR HOUSE může udělat</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {s.links.map((l) => (
            <Link key={l.href + l.label} href={l.href} className="btn btn-primary text-[0.8667rem]">{l.label} <ArrowRight size={15} /></Link>
          ))}
          <Link href="/koordinator" className="flex items-center gap-1.5 rounded-xl border border-sage-bd bg-white/60 px-4 py-2.5 text-[0.8667rem] font-medium text-sage-d hover:bg-white"><Phone size={14} /> Probrat s koordinátorkou</Link>
        </div>
      </div>

    </div>
  );
}
