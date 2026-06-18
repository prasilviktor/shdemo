import Link from "next/link";
import {
  ArrowLeft, Users, Heart, ClipboardList, Eye, Coins,
  Check, AlertTriangle, MessageSquare,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

const SECTIONS = [
  {
    icon: Eye,
    title: "První dojem a prostředí",
    items: [
      "Jak na vás zapůsobila vstupní hala a společné prostory?",
      "Je zařízení čisté, světlé a bez nepříjemných pachů?",
      "Pohybují se klienti volně, nebo sedí zavřeni na pokojích?",
      "Je zde zahrada nebo venkovní prostor přístupný klientům?",
      "Jsou prostory přizpůsobeny lidem na vozíku nebo s omezenou mobilitou?",
    ],
  },
  {
    icon: Users,
    title: "Personál",
    items: [
      "Jak se personál chová ke klientům — oslovuje je jménem, má čas?",
      "Kolik pečovatelů připadá na jednoho klienta (denní a noční směna)?",
      "Jak dlouho zde průměrně pracují pečovatelé? Vysoká fluktuace je varovný signál.",
      "Je v zařízení přítomna zdravotní sestra — a kdy?",
      "Kdo je přidělen jako kontaktní pečovatel pro konkrétního klienta?",
    ],
  },
  {
    icon: Heart,
    title: "Péče a každodenní život",
    items: [
      "Jak vypadá typický den klienta — ranní vstávání, jídla, aktivity?",
      "Jsou k dispozici aktivizační programy, kulturní akce, fyzioterapie?",
      "Jak zařízení zvládá klienty s demencí nebo nočním neklidem?",
      "Jaká je politika návštěv? Mohou příbuzní přijít kdykoliv?",
      "Může si klient přinést vlastní věci, nábytek, domácího mazlíčka?",
    ],
  },
  {
    icon: ClipboardList,
    title: "Administrativa a smlouva",
    items: [
      "Vyžádejte si vzor smlouvy před podpisem — ne až při přijetí.",
      "Co přesně je zahrnuto v základní ceně a co se platí zvlášť?",
      "Jaká je výpovědní lhůta a podmínky ukončení smlouvy?",
      "Jak zařízení postupuje při zhoršení zdravotního stavu klienta?",
      "Je zařízení registrováno jako poskytovatel sociálních služeb (MPSV)?",
    ],
  },
  {
    icon: Coins,
    title: "Financování a cena",
    items: [
      "Jaká je přesná celková cena za měsíc — pokoj, péče, strava, aktivity?",
      "Přijímá zařízení příspěvek na péči a jak s ním nakládá?",
      "Existují příplatky za nadstandard, které by klient pravidelně potřeboval?",
      "Jak se cena mění při zhoršení zdravotního stavu a vyšší náročnosti péče?",
    ],
  },
  {
    icon: MessageSquare,
    title: "Komunikace s rodinou",
    items: [
      "Kdo a jak vás bude kontaktovat při změně zdravotního stavu?",
      "Jak probíhá předání informací při střídání směn?",
      "Je možné zúčastnit se plánování péče a pravidelných hodnocení?",
      "Jak zařízení řeší stížnosti — existuje jasný postup?",
    ],
  },
];

const RED_FLAGS = [
  "Personál se vyhýbá přímým odpovědím nebo slibuje bez konkrétností.",
  "Klienti vypadají apaticky, sedí celý den bez aktivit.",
  "Nepříjemný zápach v pokojích nebo společných prostorách.",
  "Přetížení personál, nervózní atmosféra, vysoká fluktuace.",
  "Smlouva je nejasná v tom, co je zahrnuto v ceně.",
  "Zákaz spontánních návštěv nebo omezení kontaktu s rodinou.",
];

const COMPARE = [
  "Cena a co je v ní zahrnuto",
  "Počet klientů na pečovatele",
  "Zkušenost s konkrétním zdravotním stavem",
  "Vzdálenost od rodiny",
  "Dostupné aktivity a rehabilitace",
  "Celkový dojem z návštěvy",
];

export default function ProhlidkaPage() {
  return (
    <AppShell title="Prohlídka zařízení" greeting={false}>
      <div className="mx-auto max-w-3xl px-5 py-6 sm:px-7">
        <Link href="/pomoc" className="mb-5 flex items-center gap-1.5 text-[0.8667rem] font-medium text-ink-2 hover:text-ink">
          <ArrowLeft size={15} /> Pomoc a podpora
        </Link>

        <h1 className="font-serif text-[1.7333rem] font-medium text-ink">Prohlídka zařízení</h1>
        <p className="mt-1 text-[0.9333rem] text-ink-2 a11y-dim">
          Na co se ptát a co sledovat — ať z návštěvy odejdete s jasnou odpovědí.
        </p>

        {/* Checklist */}
        <div className="mt-6 space-y-4">
          {SECTIONS.map((s) => (
            <section key={s.title} className="card p-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-l text-sage-d">
                  <s.icon size={19} strokeWidth={1.8} />
                </span>
                <h2 className="font-serif text-[1.1333rem] font-medium text-ink">{s.title}</h2>
              </div>
              <ul className="mt-4 space-y-2.5">
                {s.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.9rem] text-ink">
                    <Check size={15} className="mt-0.5 shrink-0 text-sage" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Varovné signály */}
        <section className="mt-4 rounded-xl2 border border-amber-bd bg-amber-l/40 p-5">
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={19} className="shrink-0 text-amber" />
            <h2 className="font-serif text-[1.1333rem] font-medium text-ink">Varovné signály</h2>
          </div>
          <ul className="mt-4 space-y-2.5">
            {RED_FLAGS.map((f) => (
              <li key={f} className="flex items-start gap-3 text-[0.9rem] text-ink">
                <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber" />
                {f}
              </li>
            ))}
          </ul>
        </section>

        {/* Jak porovnat více zařízení */}
        <section className="mt-4 card p-5">
          <h2 className="font-serif text-[1.1333rem] font-medium text-ink">Jak porovnat více zařízení</h2>
          <p className="mt-1 text-[0.8667rem] text-ink-2 a11y-dim">
            Po každé prohlídce si poznamenejte tato kritéria. Snáze pak porovnáte.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {COMPARE.map((c, i) => (
              <div key={c} className="flex items-center gap-2.5 rounded-xl border border-line bg-paper px-3.5 py-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-l text-[0.7333rem] font-semibold text-sage-d">
                  {i + 1}
                </span>
                <span className="text-[0.8667rem] text-ink">{c}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link href="/doporucena" className="btn btn-primary flex-1 text-[0.9333rem]">
            Prohlédnout doporučená zařízení
          </Link>
          <Link href="/koordinator" className="btn btn-ghost flex-1 text-[0.9333rem]">
            Promluvit s koordinátorkou
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
