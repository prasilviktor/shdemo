"use client";

import Link from "next/link";
import {
  ArrowRight, Phone, Check, User, HelpCircle, ChevronRight,
  Search, FolderLock, Send, DollarSign, ShieldCheck, ClipboardList,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing-nav";
import { Reveal } from "@/components/ui";
import { PHONE_DISPLAY, PHONE_TEL, PHONE_HOURS } from "@/lib/contact";

/* ─── data ──────────────────────────────────────────────────── */

const facilities = [
  {
    name: "Domov U Tří lip",
    location: "Praha 6",
    type: "Domov se zvláštním režimem",
    tags: [
      { label: "Alzheimer", variant: "sage" },
      { label: "Volné místo", variant: "sage" },
      { label: "od 28 000 Kč", variant: "neutral" },
    ],
    matchLabel: "Vysoká shoda",
    matchVariant: "high",
    matchPct: 94,
    dist: "2,3 km",
    hue: 125,
  },
  {
    name: "Rezidence Klidná řeka",
    location: "Praha 4",
    type: "Domov pro seniory",
    tags: [
      { label: "Volné místo", variant: "sage" },
      { label: "Čeká na dokumenty", variant: "amber" },
    ],
    matchLabel: "Vysoká shoda",
    matchVariant: "high",
    matchPct: 88,
    dist: "5,1 km",
    hue: 165,
  },
  {
    name: "Vlídná ruka — domácí péče",
    location: "Praha",
    type: "Terénní a domácí péče",
    tags: [
      { label: "Dostupné ihned", variant: "sage" },
      { label: "od 180 Kč/hod", variant: "neutral" },
    ],
    matchLabel: "Střední shoda",
    matchVariant: "mid",
    matchPct: 72,
    dist: "celá Praha",
    hue: 200,
  },
];

/* Co pro rodinu ohlídáme — užitky, ne technologie */
const benefits = [
  {
    icon: Search,
    title: "Doporučení na míru",
    body: "Podle zdravotního stavu, místa i rozpočtu vám ukážeme zařízení, která mají skutečně volno.",
  },
  {
    icon: ClipboardList,
    title: "Žádosti bez papírování",
    body: "Jedna žádost do více zařízení najednou. Stav každé z nich vidíte na jednom místě.",
  },
  {
    icon: FolderLock,
    title: "Dokumenty na jednom místě",
    body: "Zdravotní zprávy a doklady nahrajete jednou — už je nebudete dokládat znovu a znovu.",
  },
  {
    icon: DollarSign,
    title: "Příspěvky a financování",
    body: "Pomůžeme získat příspěvek na péči a srozumitelně spočítáme, kolik bude péče stát.",
  },
];

const beforeSteps = [
  { label: 'Google „domov pro seniory Praha"', detail: "Adresáře, reklamy, neaktuální informace", cost: "→ 3–5 hodin průzkumu" },
  { label: "Volání zařízení jedno po druhém", detail: "Žádná dostupnost, žádné ceny, přepojování", cost: "→ Týdny čekání" },
  { label: "Stejné formuláře u každého zařízení", detail: "Zdravotní zprávy a doklady znovu a znovu", cost: "→ Duplikace, chyby, ztracené doklady" },
  { label: "Nikdo to nekoordinuje", detail: "Rodina, lékaři, pojišťovna — každý jinde", cost: "→ Chaos, vina, vyčerpání" },
];

const afterSteps = [
  { label: "Jeden profil péče", detail: "Zdravotní stav, mobilita, preference — jednou", gain: "→ 20 minut, hotovo" },
  { label: "Doporučená zařízení ihned", detail: "Párování dle dostupnosti, ceny, typu péče", gain: "→ Konkrétní výsledky okamžitě" },
  { label: "Žádosti do více zařízení najednou", detail: "Dokumenty se sdílejí automaticky", gain: "→ Jeden klik, všechna zařízení" },
  { label: "Koordinátorka vede celý proces", detail: "Rodina, lékaři, poskytovatelé — jedno místo", gain: "→ Jasno, klid, postup vpřed" },
];

/* Skutečná sekvence — číslování zde nese informaci */
const howItWorks = [
  {
    n: "1",
    title: "Řeknete nám o vašem blízkém",
    body: "Šest jednoduchých otázek — kdo, jaká péče, kde a jak rychle. Zabere to asi 20 minut. Můžete i zavolat, vyplníme to s vámi.",
  },
  {
    n: "2",
    title: "Dostanete doporučená zařízení",
    body: "Ukážeme vám domovy a služby, které odpovídají potřebám a mají volnou kapacitu. Žádné slepé obvolávání.",
  },
  {
    n: "3",
    title: "Koordinátorka vše vyřídí s vámi",
    body: "Žádosti, dokumenty, prohlídky i příspěvek na péči. Jeden člověk, který zná váš případ — zdarma.",
  },
];

/* ─── helpers ────────────────────────────────────────────────── */

function FacilityThumb({ hue }: { hue: number }) {
  return (
    <div
      className="h-10 w-10 shrink-0 overflow-hidden rounded-xl"
      style={{ background: `hsl(${hue},28%,86%)` }}
    >
      <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
        <rect x="10" y="16" width="20" height="14" rx="2" fill="white" opacity={0.85} />
        <polygon points="8,18 20,9 32,18" fill={`hsl(${hue},32%,50%)`} opacity={0.55} />
        <rect x="14" y="20" width="5" height="4" rx="1" fill={`hsl(${hue},28%,70%)`} opacity={0.6} />
        <rect x="22" y="20" width="5" height="4" rx="1" fill={`hsl(${hue},28%,70%)`} opacity={0.6} />
      </svg>
    </div>
  );
}

/* ─── page ───────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <main className="overflow-x-hidden">
      <MarketingNav />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative pt-[72px]">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(900px 500px at 80% 0%, #E7EDE6 0%, transparent 60%), radial-gradient(700px 400px at 5% 20%, #F2E5DC 0%, transparent 50%)",
          }}
        />
        <div className="sh-container grid gap-12 py-16 md:grid-cols-[1.1fr,0.9fr] md:items-center md:py-24">
          <Reveal>
            <span className="chip border-sage/30 bg-sage-l text-sage-d">
              <span className="inline-block h-2 w-2 rounded-full bg-sage-d" />
              Zdarma pro rodiny i seniory
            </span>
            <h1 className="mt-6 font-serif text-[2.6rem] font-semibold leading-[1.08] text-ink sm:text-5xl">
              Najdeme tu správnou péči pro vašeho blízkého.
            </h1>
            <p className="mt-5 max-w-xl text-[1.1333rem] leading-relaxed text-ink-2 a11y-dim">
              Domovy pro seniory, domácí péče i příspěvky — na jednom místě.
              Koordinátorka vás celým procesem provede, krok za krokem.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/zacit" className="btn btn-primary px-6 py-3.5 text-[1.0667rem]">
                Začít hledat péči <ArrowRight size={18} />
              </Link>
              <a
                href={PHONE_TEL}
                className="btn btn-ghost gap-2 px-6 py-3.5 text-[1.0667rem] font-semibold text-sage-d"
              >
                <Phone size={18} /> {PHONE_DISPLAY}
              </a>
            </div>
            <p className="mt-4 text-[0.9333rem] text-ink-3 a11y-dim">
              {PHONE_HOURS} · hovor i celá služba jsou pro rodiny zdarma
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.9333rem] text-ink-2">
              {["Ověření poskytovatelé", "Bez skrytých poplatků", "Vaše data v bezpečí (GDPR)"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <Check size={15} className="text-sage" /> {t}
                </span>
              ))}
            </div>
          </Reveal>

          {/* Hero mockup — Doporučená zařízení */}
          <Reveal delay={120}>
            <div className="card overflow-hidden p-0">
              <div className="flex items-center justify-between border-b border-line/60 bg-surface-2 px-4 py-3">
                <span className="text-[0.8667rem] font-medium text-ink">Doporučená zařízení pro vás</span>
                <span className="text-[0.7333rem] text-ink-3">Praha · 3 výsledky</span>
              </div>
              {facilities.map((f) => (
                <div key={f.name} className="flex items-center gap-3 border-t border-line/40 bg-white px-4 py-3">
                  <FacilityThumb hue={f.hue} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[0.9333rem] font-medium text-ink">{f.name}</div>
                    <div className="text-[0.7333rem] text-ink-3">{f.location} · {f.type}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {f.tags.map((tag) => (
                        <span
                          key={tag.label}
                          className={`badge text-[0.6667rem] ${
                            tag.variant === "sage" ? "badge-sage" : tag.variant === "amber" ? "badge-amber" : "badge-neutral"
                          }`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className={`text-[0.7333rem] font-semibold ${f.matchVariant === "high" ? "text-sage-d" : "text-amber"}`}>
                      {f.matchLabel}
                    </div>
                    <div className="mt-1 h-1 w-12 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${f.matchPct}%`,
                          background: f.matchVariant === "high" ? "#4A7C5A" : "#F5C97B",
                        }}
                      />
                    </div>
                    <div className="mt-1 text-[0.6667rem] text-ink-3">{f.dist}</div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-line/40 bg-surface-2 px-4 py-2.5">
                <span className="text-[0.7333rem] text-ink-3">Profil péče: 5 / 6 kroků vyplněno</span>
                <span className="text-[0.7333rem] font-medium text-sage">Zobrazit vše →</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PŘÍBĚH: dnes vs. se SENIOR HOUSE ─────────────────── */}
      <section id="pribeh" className="bg-white py-20 md:py-24">
        <div className="sh-container">
          <Reveal>
            <span className="text-[0.7333rem] font-medium uppercase tracking-widest text-sage">
              Možná to znáte
            </span>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-ink">
              Tatínek měl mrtvici. Co teď?
            </h2>
            <p className="mt-3 max-w-xl text-[1rem] text-ink-2 a11y-dim">
              Takhle vypadá hledání péče dnes — a takhle se SENIOR HOUSE.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <Reveal delay={60}>
              <div className="overflow-hidden rounded-2xl border border-line/60">
                <div className="bg-peach-l px-5 py-3 text-[0.8667rem] font-medium text-peach">
                  Dnes — bez SENIOR HOUSE
                </div>
                {beforeSteps.map((s) => (
                  <div key={s.label} className="flex items-start gap-3 border-t border-line/40 bg-white px-5 py-3.5">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-peach-l">
                      <span className="h-1.5 w-1.5 rounded-full bg-peach" />
                    </div>
                    <div>
                      <div className="text-[0.8667rem] font-medium text-ink">{s.label}</div>
                      <div className="text-[0.7867rem] text-ink-3">{s.detail}</div>
                      <div className="mt-1 text-[0.7333rem] font-medium text-peach">{s.cost}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="overflow-hidden rounded-2xl border border-line/60">
                <div className="bg-sage-l px-5 py-3 text-[0.8667rem] font-medium text-sage-d">
                  Se SENIOR HOUSE
                </div>
                {afterSteps.map((s) => (
                  <div key={s.label} className="flex items-start gap-3 border-t border-line/40 bg-white px-5 py-3.5">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sage-l">
                      <Check size={12} className="text-sage-d" />
                    </div>
                    <div>
                      <div className="text-[0.8667rem] font-medium text-ink">{s.label}</div>
                      <div className="text-[0.7867rem] text-ink-3">{s.detail}</div>
                      <div className="mt-1 text-[0.7333rem] font-medium text-sage-d">{s.gain}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── JAK TO FUNGUJE — 3 kroky ─────────────────────────── */}
      <section id="jak-to-funguje" className="bg-surface-2 py-20 md:py-24">
        <div className="sh-container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-[0.7333rem] font-medium uppercase tracking-widest text-sage">
              Jak to funguje
            </span>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-ink">
              Tři kroky k zajištěné péči.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {howItWorks.map((s, i) => (
              <Reveal key={s.n} delay={i * 60}>
                <div className="card h-full p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage font-serif text-[1.2rem] font-semibold text-white">
                    {s.n}
                  </span>
                  <h3 className="mt-4 text-[1.0667rem] font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-[0.9333rem] leading-relaxed text-ink-2 a11y-dim">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/zacit" className="btn btn-primary px-6 py-3 text-[1rem]">
                Začít — zabere to 20 minut <ArrowRight size={17} />
              </Link>
              <span className="text-[0.9333rem] text-ink-3">
                nebo zavolejte na{" "}
                <a href={PHONE_TEL} className="font-semibold text-sage-d hover:underline">{PHONE_DISPLAY}</a>
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PODPORA: koordinátorka + poradna ─────────────────── */}
      <section id="podpora" className="bg-paper py-20 md:py-24">
        <div className="sh-container">
          <Reveal className="max-w-lg">
            <span className="text-[0.7333rem] font-medium uppercase tracking-widest text-sage">
              Lidský přístup
            </span>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-ink">
              Za každým případem<br />stojí člověk.
            </h2>
            <p className="mt-4 text-[1rem] leading-relaxed text-ink-2 a11y-dim">
              Nejste v tom sami. Koordinátorka vede váš případ a poradna
              otevírá dveře, o kterých většina lidí ani neví.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* Koordinátorka */}
            <Reveal delay={60}>
              <div className="card overflow-hidden p-0 shadow-soft-lg">
                <div className="p-6">
                  <span className="chip border-sage/30 bg-sage-l text-[0.6667rem] text-sage-d">
                    <User size={11} /> Osobní koordinátorka
                  </span>
                  <h3 className="mt-4 font-serif text-[1.4667rem] font-semibold leading-snug text-ink">
                    Jeden člověk,<br />celý případ.
                  </h3>
                  <p className="mt-2 text-[0.9333rem] leading-relaxed text-ink-2 a11y-dim">
                    Koordinátorka se aktivně stará o váš případ — od prvního
                    kontaktu až po nástup. Vidíte pokrok, ne ticho.
                  </p>
                </div>
                <div className="border-t border-line/60 bg-surface-2 p-5">
                  <div className="mb-3 flex items-start gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage-l">
                      <User size={13} className="text-sage-d" />
                    </div>
                    <div>
                      <div className="max-w-[220px] rounded-xl rounded-tl-sm border border-line/60 bg-white px-3 py-2 text-[0.7333rem] leading-relaxed text-ink">
                        Domov U Tří lip potvrdil termín prohlídky na čtvrtek 12. 6. v 10:00. Připravím vám shrnutí předem.
                      </div>
                      <div className="mt-1 text-[0.6rem] text-ink-3">Markéta K., koordinátorka · před 2 hod</div>
                    </div>
                  </div>
                  <div className="mb-4 flex justify-end">
                    <div>
                      <div className="max-w-[180px] rounded-xl rounded-tr-sm bg-sage px-3 py-2 text-[0.7333rem] leading-relaxed text-white">
                        Děkuji, budeme tam. Máte i zprávu od Rezidence Klidná řeka?
                      </div>
                      <div className="mt-1 text-right text-[0.6rem] text-ink-3">Vy · před 1 hod</div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-line/60 bg-white px-4 py-3">
                    <div className="mb-2 flex justify-between text-[0.6667rem]">
                      <span className="text-ink-2">Stav případu</span>
                      <span className="font-medium text-sage-d">Krok 3 / 5</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                      <div className="h-full w-[60%] rounded-full bg-sage" />
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-[0.6rem] text-ink-3">
                      <span className="inline-flex items-center gap-0.5"><Check size={10} className="text-sage" /> Naplánování prohlídky</span>
                      <span aria-hidden>·</span> Čeká: Rozhodnutí rodiny
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Poradna */}
            <Reveal delay={100}>
              <div className="card overflow-hidden p-0 shadow-soft-lg">
                <div className="p-6">
                  <span className="chip border-sage/30 bg-sage-l text-[0.6667rem] text-sage-d">
                    <HelpCircle size={11} /> Pomoc a podpora
                  </span>
                  <h3 className="mt-4 font-serif text-[1.4667rem] font-semibold leading-snug text-ink">
                    Poradna, která<br />otevírá dveře.
                  </h3>
                  <p className="mt-2 text-[0.9333rem] leading-relaxed text-ink-2 a11y-dim">
                    Průvodce životními situacemi. Propojíme vás se státní
                    správou, neziskovkami i financováním — bez byrokracie.
                  </p>
                </div>
                <div className="border-t border-line/60 bg-surface-2 p-5">
                  <div className="mb-3 text-[0.7333rem] font-medium text-ink-2">Vaše životní situace:</div>
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    <span className="badge badge-peach">Tatínek po mrtvici</span>
                    <span className="badge badge-sage">Hledám domov</span>
                    <span className="badge badge-sky">Příspěvek na péči</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5 rounded-xl border border-line/60 bg-white px-3.5 py-3">
                      <ChevronRight size={13} className="mt-0.5 shrink-0 text-sage" />
                      <div className="text-[0.7333rem] leading-relaxed text-ink">
                        <span className="font-medium">Příspěvek na péči III. stupeň</span> — na základě vašeho popisu může tatínek nárokovat až 12 800 Kč/měs. Pomohu vám podat žádost na Úřadu práce.
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 rounded-xl border border-line/60 bg-white px-3.5 py-3">
                      <ChevronRight size={13} className="mt-0.5 shrink-0 text-sky" />
                      <div className="text-[0.7333rem] leading-relaxed text-ink">
                        <span className="font-medium">Česká alzheimerovská společnost</span> — bezplatná poradna pro rodiny. Propojím vás s regionálním poradcem.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CO OHLÍDÁME ──────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-24">
        <div className="sh-container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-[0.7333rem] font-medium uppercase tracking-widest text-sage">
              Co všechno ohlídáme
            </span>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-ink">
              Abyste se mohli soustředit na sebe a svého blízkého.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((m, i) => (
              <Reveal key={m.title} delay={i * 50}>
                <div className="card h-full p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-l text-sage-d">
                    <m.icon size={18} />
                  </div>
                  <h3 className="mt-4 text-[1rem] font-semibold text-ink">{m.title}</h3>
                  <p className="mt-1.5 text-[0.8667rem] leading-relaxed text-ink-2 a11y-dim">{m.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-paper py-20 md:py-28">
        <div className="sh-container text-center">
          <Reveal>
            <p className="mx-auto max-w-2xl font-serif text-3xl font-light italic leading-snug text-ink sm:text-4xl">
              „Nemusíte na to být sami."
            </p>
            <p className="mx-auto mt-6 max-w-xl text-[1.0667rem] leading-relaxed text-ink-2 a11y-dim">
              Ať řešíte akutní situaci, nebo se chcete jen připravit —
              začněte šesti otázkami, nebo nám rovnou zavolejte.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/zacit" className="btn btn-ink px-6 py-3.5 text-[1.0667rem]">
                Začít hledat péči <ArrowRight size={17} />
              </Link>
              <a href={PHONE_TEL} className="btn btn-ghost gap-2 px-6 py-3.5 text-[1.0667rem] font-semibold text-sage-d">
                <Phone size={17} /> {PHONE_DISPLAY}
              </a>
            </div>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-[0.8667rem] text-ink-3">
              <ShieldCheck size={14} className="text-sage" /> Pro rodiny zdarma · {PHONE_HOURS}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="border-t border-line/60 bg-paper py-10">
        <div className="sh-container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="font-serif text-lg font-semibold text-ink">
            Senior<span className="text-sage">House</span>
          </span>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-5">
            <a href={PHONE_TEL} className="flex items-center gap-1.5 text-sm font-medium text-sage-d">
              <Phone size={14} /> {PHONE_DISPLAY}
            </a>
            <Link href="/investori" className="text-sm text-ink-3 hover:text-ink">
              Pro investory
            </Link>
            <p className="text-sm text-ink-3">
              © {new Date().getFullYear()} SENIOR HOUSE · GDPR
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
