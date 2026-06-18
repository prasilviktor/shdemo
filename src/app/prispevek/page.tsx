"use client";

import { useState } from "react";
import {
  Contact, ClipboardList, Pill, Stethoscope, FileText, Home, Lightbulb,
  type LucideIcon,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { InfoTip, BackLink } from "@/components/ui";

type WizAnswers = Record<number, number>;

const degrees = [
  { level: "Stupeň I", name: "Lehká závislost", amount: "880 Kč", desc: "Pravidelná pomoc s několika každodenními činnostmi, většinu věcí zvládne sám.", tags: ["hygiena", "oblékání", "nákup"] },
  { level: "Stupeň II", name: "Středně těžká závislost", amount: "4 400 Kč", desc: "Pomoc je potřeba každý den u více oblastí — hygiena, stravování, pohyb, orientace.", tags: ["chůze", "vaření", "léky"] },
  { level: "Stupeň III", name: "Těžká závislost", amount: "12 800 Kč", desc: "Každodenní péče téměř nepřetržitě. Nezvládá základní funkce bez asistence.", tags: ["dohled", "přesuny", "komunikace"] },
  { level: "Stupeň IV", name: "Úplná závislost", amount: "19 200 Kč", desc: "Plná závislost na péči druhé osoby po celý den, včetně duševních a komunikačních potřeb.", tags: ["demence", "imobilita", "trvalá péče"], highlight: true },
];

const checkItems: [LucideIcon, string, string][] = [
  [Contact, "Občanský průkaz seniora", "Povinná identifikace při podání žádosti i při sociálním šetření."],
  [ClipboardList, "Lékařské zprávy a propouštěcí dokumentace", "Zprávy z nemocnic a ambulancí — ideálně za poslední rok."],
  [Pill, "Seznam léků s dávkováním", "Posuzovatelé potřebují vědět, jaká medikace je nutná a jak náročná je její správa."],
  [Stethoscope, "Kontakt na praktického lékaře", "Úřad práce si může od lékaře vyžádat vyjádření o zdravotním stavu."],
  [FileText, "Popis běžného dne seniora", "Krátký vlastní popis toho, s čím senior potřebuje pomoc a jak dlouho to trvá."],
  [Home, "Doklad o bydlišti (pokud jiné než v OP)", "Nutné, pokud senior bydlí na jiné adrese, než je zapsáno v OP."],
];

const timeline: [string, string, string][] = [
  ["Podání žádosti na úřadu práce", "Žádost se podává osobně nebo v zastoupení na krajské pobočce úřadu práce.", "Zkontrolujte otevírací dobu předem a přineste kopie všech dokumentů."],
  ["Sociální šetření v domácnosti", "Sociální pracovník navštíví seniora doma a pozoruje, jak zvládá běžné činnosti. Trvá 30–60 minut.", "Neschovávejte pomůcky ani potíže — popište situaci tak, jak skutečně je."],
  ["Posouzení zdravotního stavu", "Posudkový lékař OSSZ posoudí zdravotní dokumentaci a zprávu ze šetření.", "Pokud máte nové lékařské zprávy, doložte je i v této fázi."],
  ["Rozhodnutí úřadu práce", "Úřad vydá písemné rozhodnutí. Proti němu lze do 15 dnů podat odvolání.", "Rozhodnutí si pečlivě pročtěte a uložte — budete ho potřebovat."],
  ["Vyplácení příspěvku", "Příspěvek se vyplácí měsíčně, zpravidla od měsíce přiznání.", "Nezapomeňte každoročně doložit, jak je příspěvek využíván."],
];

const faq: [string, string][] = [
  ["Kdo k nám přijde?", "Sociální pracovník z úřadu práce. Jeho cílem je objektivně zhodnotit, co senior zvládá a kde potřebuje pomoc — ne vás zkoumat ani hodnotit."],
  ["Na co se bude ptát?", "Na každodenní činnosti: vstávání, stravování, hygiena, pohyb, orientace, léky. Může požádat seniora, aby některé věci předvedl."],
  ["Musím mít uklizeno?", "Ne. Pracovník hodnotí schopnosti seniora, ne pořádek v bytě. Umělé vylepšení situace může vést k nižšímu stupni."],
  ["Může být přítomna rodina?", "Ano, přítomnost rodinného příslušníka je možná a doporučuje se, zejména pokud má senior potíže s komunikací."],
  ["Co když bude senior v ten den v dobrém stavu?", "Popište sociálnímu pracovníkovi průměrný nebo horší den. Přineste si připravený popis typického dne."],
];

const wizardSteps: { q: string; hint: string; opts: [string, string, number][] }[] = [
  { q: "Jakou pomoc senior potřebuje?", hint: "Vyberte, co nejlépe popisuje každodenní situaci.", opts: [
    ["Pomoc s některými činnostmi", "Hygiena, nakupování, vaření — zvládne většinu sám", 1],
    ["Pravidelná denní pomoc", "Pomoc je potřeba každý den u více věcí", 2],
    ["Téměř nepřetržitá asistence", "Bez pomoci nezvládne základní denní úkony", 3],
    ["Plná závislost na péči", "Potřebuje pomoc po celý den, včetně noci", 4],
  ]},
  { q: "Jak často je pomoc potřeba?", hint: "Průměrný týden v domácím prostředí.", opts: [
    ["Několikrát týdně", "Pomoc není každodenní rutina", 1],
    ["Každý den, několik hodin", "Ranní i večerní pomoc je standardem", 2],
    ["Celý den, téměř nepřetržitě", "Pečující nemůže dlouhodobě odejít", 3],
  ]},
  { q: "Jak je na tom s orientací a pamětí?", hint: "Řeč, orientace v čase a prostoru, rozpoznávání blízkých.", opts: [
    ["Bez omezení nebo jen mírné obtíže", "Komunikace a orientace v pořádku", 0],
    ["Střední potíže", "Občasné bloudění, problémy s krátkodobou pamětí", 1],
    ["Vážné potíže", "Dezorientace, nerozpoznává blízké, potřebuje dohled", 2],
  ]},
  { q: "Jak je to s pohybem?", hint: "Schopnost vstát, chodit, přesuny mezi místnostmi.", opts: [
    ["Pohybuje se samostatně nebo s pomůckou", "Hůl, chodítko, ale bez asistence osoby", 0],
    ["Potřebuje asistenci při přesunech", "Vstávání, přechody po bytě s dopomocí", 1],
    ["Leží nebo je na vozíku", "Přesuny vyžadují fyzickou pomoc druhé osoby", 2],
  ]},
];

function calcDegree(a: WizAnswers) {
  const s = (a[0] ?? 1) + (a[1] ?? 1) + (a[2] ?? 0) + (a[3] ?? 0);
  if (s <= 2) return degrees[0];
  if (s <= 4) return degrees[1];
  if (s <= 6) return degrees[2];
  return degrees[3];
}

export default function PrispevekPage() {
  return (
    <AppShell title="Příspěvek na péči" greeting={false}>
      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-7">
        <BackLink href="/pomoc" label="Pomoc a podpora" />
        <div className="text-[0.6667rem] font-medium uppercase tracking-wider text-sage">
          Finanční podpora státu
        </div>
        <h1 className="mt-2 font-serif text-[2.1333rem] font-medium leading-tight text-ink">
          Průvodce příspěvkem na péči
        </h1>
        <p className="mt-3 max-w-xl text-[1rem] leading-relaxed text-ink-2 a11y-dim">
          Provedeme vás celým procesem jednoduše, lidsky a krok za krokem. Bez
          formulářového chaosu, bez zbytečného stresu.
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          {["Zdarma pro rodiny", "Žádné závazky", "GDPR chráněno"].map((t) => (
            <span key={t} className="flex items-center gap-1.5 text-[0.8rem] text-ink-2 a11y-dim">
              <span className="h-1.5 w-1.5 rounded-full bg-sage" /> {t}
            </span>
          ))}
        </div>

        <section className="mt-12 border-t border-line pt-10">
          <SectionEyebrow n="01" label="Základ" />
          <h2 className="flex items-center font-serif text-[1.4667rem] font-medium text-ink">
            Co je příspěvek na péči?
            <InfoTip label="Příspěvek na péči" text="Opakovaná státní dávka pro osoby závislé na pomoci jiné osoby. Vyplácí ji úřad práce přímo příjemci, který s ní hradí péči dle vlastní volby." />
          </h2>
          <p className="mt-2 max-w-xl text-[0.9333rem] leading-relaxed text-ink-2 a11y-dim">
            Finanční podpora od státu pro lidi, kteří kvůli zdravotnímu stavu
            potřebují pomoc druhé osoby. Je to právo, ne žádost o laskavost.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {degrees.map((d) => (
              <div key={d.level} className={`card p-5 ${d.highlight ? "ring-1 ring-sage-bd" : ""}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[0.7333rem] font-semibold uppercase tracking-wider text-sage">{d.level}</span>
                  <span className="font-serif text-[1.2rem] font-medium text-ink">{d.amount}<span className="text-[0.7333rem] font-normal text-ink-3"> /měs</span></span>
                </div>
                <div className="mt-1.5 text-[0.9333rem] font-medium text-ink">{d.name}</div>
                <p className="mt-1.5 text-[0.8rem] leading-relaxed text-ink-2 a11y-dim">{d.desc}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {d.tags.map((t) => (
                    <span key={t} className="rounded-full bg-surface-2 px-2 py-0.5 text-[0.6667rem] text-ink-2">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="wizard" className="mt-12 border-t border-line pt-10">
          <SectionEyebrow n="02" label="Interaktivní" />
          <div className="overflow-hidden rounded-xl2 border-2 border-sage-bd bg-surface shadow-soft">
            <div className="flex items-center gap-3 border-b border-sage-bd bg-sage-l px-6 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage text-[1rem] text-white">?</span>
              <div>
                <h2 className="font-serif text-[1.2667rem] font-medium text-sage-d">Zjistěte orientační nárok</h2>
                <p className="text-[0.8rem] text-sage-d/80">Pět otázek, dvě minuty — výsledek je orientační.</p>
              </div>
            </div>
            <div className="p-6"><Wizard /></div>
          </div>
        </section>

        <section className="mt-12 border-t border-line pt-10">
          <SectionEyebrow n="03" label="Příprava" />
          <h2 className="font-serif text-[1.4667rem] font-medium text-ink">Co si připravit</h2>
          <div className="mt-5 space-y-2">
            {checkItems.map(([Icon, name, why]) => (
              <div key={name} className="card flex items-start gap-3 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sage-l text-sage-d"><Icon size={18} /></span>
                <div>
                  <div className="text-[0.9333rem] font-medium text-ink">{name}</div>
                  <div className="mt-0.5 text-[0.8rem] leading-relaxed text-ink-2 a11y-dim">{why}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t border-line pt-10">
          <SectionEyebrow n="04" label="Postup" />
          <h2 className="font-serif text-[1.4667rem] font-medium text-ink">Jak proces probíhá</h2>
          <div className="mt-5 space-y-3">
            {timeline.map(([t, body, tip], i) => (
              <div key={t} className="card p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sage text-[0.8rem] font-semibold text-white">{i + 1}</span>
                  <h3 className="text-[1rem] font-medium text-ink">{t}</h3>
                </div>
                <p className="mt-2 text-[0.8667rem] leading-relaxed text-ink-2 a11y-dim">{body}</p>
                <div className="mt-2 flex items-start gap-2 rounded-lg bg-amber-l px-3 py-2 text-[0.8rem] text-amber">
                  <Lightbulb size={15} className="mt-0.5 shrink-0" /> {tip}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t border-line pt-10">
          <SectionEyebrow n="05" label="Otázky" />
          <h2 className="font-serif text-[1.4667rem] font-medium text-ink">Sociální šetření — časté otázky</h2>
          <div className="mt-5"><Faq /></div>
        </section>

        <p className="mt-8 rounded-xl bg-sage-l px-4 py-3 text-center text-[0.8667rem] text-sage-d">
          Chcete vším projít s člověkem? Koordinátor vám zavolá a vysvětlí krok za krokem — zdarma.
        </p>
      </div>
    </AppShell>
  );
}

function SectionEyebrow({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sage-l font-serif text-[0.8rem] font-medium text-sage-d">{n}</span>
      <span className="text-[0.7333rem] font-semibold uppercase tracking-wider text-sage">{label}</span>
    </div>
  );
}

function Wizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<WizAnswers>({});
  const [done, setDone] = useState(false);

  const select = (v: number) => setAnswers((a) => ({ ...a, [step]: v }));
  const next = () => {
    if (answers[step] === undefined) return;
    if (step === wizardSteps.length - 1) { setDone(true); return; }
    setStep((s) => s + 1);
  };
  const reset = () => { setStep(0); setAnswers({}); setDone(false); };

  const current = wizardSteps[step];
  const result = calcDegree(answers);

  return (
    <div className="rounded-xl2 border border-line bg-paper-2 p-6">
      <div className="mb-6 flex gap-1.5">
        {wizardSteps.map((_, i) => (
          <div key={i} className={`h-[3px] flex-1 rounded-full transition-all ${done || i < step ? "bg-sage-bd" : i === step ? "bg-sage" : "bg-line"}`} />
        ))}
      </div>

      {!done ? (
        <>
          <p className="font-serif text-[1.2rem] font-medium text-ink">{current.q}</p>
          <p className="mt-1 text-[0.8667rem] text-ink-2 a11y-dim">{current.hint}</p>
          <div className="mt-5 flex flex-col gap-2.5">
            {current.opts.map(([label, sub, val]) => (
              <button
                key={val}
                onClick={() => select(val)}
                className={`rounded-xl border px-4 py-3 text-left transition-colors a11y-tap ${
                  answers[step] === val ? "border-sage bg-sage-l" : "border-line bg-surface hover:border-sage-bd"
                }`}
              >
                <span className="block text-[0.9333rem] font-medium text-ink">{label}</span>
                <span className="text-[0.8rem] text-ink-2 a11y-dim">{sub}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3">
            {step > 0 && (
              <button onClick={() => setStep((s) => s - 1)} className="btn btn-ghost text-[0.8667rem]">← Zpět</button>
            )}
            <span className="ml-auto text-[0.8rem] text-ink-3">{step + 1} z {wizardSteps.length}</span>
            <button onClick={next} disabled={answers[step] === undefined} className="btn btn-primary text-[0.8667rem]">
              {step === wizardSteps.length - 1 ? "Zobrazit výsledek" : "Pokračovat →"}
            </button>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-sage-bd bg-sage-l p-6">
          <div className="text-[0.7333rem] font-semibold uppercase tracking-wider text-sage-d">Orientační výsledek</div>
          <p className="mt-2 font-serif text-[1.3333rem] font-medium text-sage-d">{result.level} — {result.name}</p>
          <p className="mt-1 font-serif text-[1.7333rem] font-medium text-ink">{result.amount}<span className="text-[0.8667rem] font-normal text-ink-3"> /měsíc</span></p>
          <div className="mt-4 space-y-2">
            {["Podejte žádost na úřadu práce ve vašem městě", "Připravte si lékařské zprávy a popis péče", "Uvítejte sociálního pracovníka doma"].map((s, i) => (
              <div key={i} className="flex items-start gap-2.5 text-[0.8667rem] text-ink">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage text-[0.7333rem] font-medium text-white">{i + 1}</span>
                {s}
              </div>
            ))}
          </div>
          <p className="mt-4 border-t border-sage-bd pt-3 text-[0.8rem] leading-relaxed text-ink-2 a11y-dim">
            Toto je orientační odhad na základě vašich odpovědí. Skutečný stupeň
            závislosti určuje posudkový lékař OSSZ. Výsledek tohoto průvodce není
            oficiálním posouzením a nelze ho předložit úřadům.
          </p>
          <button onClick={reset} className="btn btn-ghost mt-4 text-[0.8667rem]">← Začít znovu</button>
        </div>
      )}
    </div>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-2">
      {faq.map(([q, a], i) => (
        <div key={q} className="overflow-hidden rounded-xl border border-line">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between bg-paper-2 px-5 py-3.5 text-left text-[0.9333rem] font-medium text-ink"
          >
            {q}
            <span className={`text-ink-3 transition-transform ${open === i ? "rotate-180" : ""}`}>▾</span>
          </button>
          {open === i && (
            <div className="bg-paper-2 px-5 pb-4 text-[0.8667rem] leading-relaxed text-ink-2 a11y-dim">{a}</div>
          )}
        </div>
      ))}
    </div>
  );
}
