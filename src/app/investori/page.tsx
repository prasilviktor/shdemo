"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Users, Monitor, Globe, User, Search, FolderLock, Send, DollarSign } from "lucide-react";
import { Logo, Reveal } from "@/components/ui";
import { INVESTOR_EMAIL } from "@/lib/contact";

/* ─── data ──────────────────────────────────────────────────── */

const modules = [
  { icon: User, title: "Profil péče", body: "Jeden profil sdílený napříč poskytovateli. Dokumenty nahrajete jednou." },
  { icon: Search, title: "Chytré párování", body: "Potřeby, lokalita, rozpočet a typ péče — spárováno automaticky." },
  { icon: FolderLock, title: "Trezor dokumentů", body: "Zdravotní, sociální, právní dokumenty bezpečně na jednom místě." },
  { icon: Send, title: "Správa žádostí", body: "Žádosti do více zařízení, sledování stavu — vše přehledně." },
  { icon: DollarSign, title: "Finanční koordinace", body: "Příspěvky, pojištění, úspory — srozumitelně, bez tlaku." },
  { icon: Monitor, title: "Dashboard poskytovatele", body: "CRM pro domovy — příjem, čekací listiny, profily klientů." },
];

const impactCards = [
  {
    icon: Users, iconColor: "text-sage-d", iconBg: "bg-sage-l",
    headline: "300 tis.",
    sublabel: "neformálních pečovatelů v ČR bez systémové podpory",
    body: "Každý třetí z nich věnuje péči více než 20 hodin týdně. ČR má nejvyšší podíl každodenních pečovatelů nad 50 let v celém OECD. Jsou neviditelní. My je vidíme.",
  },
  {
    icon: Monitor, iconColor: "text-amber", iconBg: "bg-amber-l",
    headline: "368 tis.",
    sublabel: "příjemců příspěvku na péči v ČR — systém, který se nedokáže sám koordinovat",
    body: "70–90 % veškeré dlouhodobé péče zajišťují rodiny, ne stát. Systém to ví. Nikdo to dosud digitálně neřešil. SENIOR HOUSE propojí rodiny se státní správou a příspěvky.",
  },
  {
    icon: Globe, iconColor: "text-sky", iconBg: "bg-sky-l",
    headline: "+21 %",
    sublabel: "nárůst potřeby péče v EU do roku 2070 (JRC / Evropská komise)",
    body: "Mission-driven byznys s jasným sociálním dopadem přitahuje jiný typ kapitálu, jiné partnery a jiná regulatorní okna. Doctolib, Alan, Kry — všichni začali takhle.",
  },
];

const partners = ["MPSV", "Úřad práce ČR", "Alzheimerova spol.", "ŽIVOT 90", "Elpida", "Sue Ryder"];

const timeline = [
  { year: "2026", label: "MVP — ČR", detail: "Rodiny, poskytovatelé, koordinátor", active: true },
  { year: "2027", label: "Ekosystém", detail: "Pojišťovny, finance, lékaři", active: false },
  { year: "2028–29", label: "DACH expanze", detail: "Německo, Rakousko, Švýcarsko", active: false },
  { year: "2030+", label: "Evropská vrstva", detail: "Sdílená infrastruktura pro stárnoucí Evropu", active: false },
];

const ecoNodes = [
  { label: "Rodiny", tier: "active" },
  { label: "Poskytovatelé", tier: "active" },
  { label: "Zdravotnictví", tier: "primary" },
  { label: "Pojišťovny", tier: "primary" },
  { label: "Finanční instituce", tier: "future" },
  { label: "Municipality", tier: "future" },
  { label: "Koordinátoři", tier: "future" },
  { label: "MPSV / Stát", tier: "future" },
];

/* ─── page ───────────────────────────────────────────────────── */

export default function InvestorsPage() {
  return (
    <main className="overflow-x-hidden">
      {/* Lehká hlavička */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-paper/95 backdrop-blur-xl">
        <div className="sh-container flex h-[72px] items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[0.7333rem] font-medium uppercase tracking-wider text-ink-3 sm:block">
              Pro investory
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
              <ArrowLeft size={15} /> Zpět pro rodiny
            </Link>
            <a href={`mailto:${INVESTOR_EMAIL}`} className="btn btn-primary px-5 py-2.5 text-sm">
              Kontakt
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-ink pt-[72px] text-paper">
        <div className="sh-container py-20 md:py-28">
          <Reveal className="max-w-2xl">
            <span className="text-[0.7333rem] font-medium uppercase tracking-widest text-sage-bd">
              Investiční příležitost
            </span>
            <h1 className="mt-4 font-serif text-[2.6rem] font-semibold leading-[1.05] text-paper sm:text-5xl">
              Evropa stárne.<br />Infrastruktura nestačí.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-2">
              SENIOR HOUSE buduje sdílenou infrastrukturu pro dlouhodobou péči —
              propojuje rodiny, poskytovatele, zdravotnictví, pojišťovny
              a financování. Ne adresář, ale operační vrstva trhu.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`mailto:${INVESTOR_EMAIL}`} className="btn btn-primary">
                Kontakt pro investory <ArrowRight size={16} />
              </a>
              <Link href="/zacit" className="btn border border-white/20 text-paper hover:bg-white/5">
                Vyzkoušet produkt
              </Link>
            </div>
          </Reveal>

          {/* Trh v číslech */}
          <Reveal delay={80}>
            <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/5 sm:grid-cols-4">
              {[
                ["22 %", "obyvatel EU starších 65 let (Eurostat, 2025)"],
                ["130 M", "seniorů v EU do roku 2050"],
                ["6,4 %", "CAGR trhu péče v Evropě 2024–2030"],
                ["€1,74T", "globální trh LTC v roce 2030"],
              ].map(([n, l]) => (
                <div key={n} className="bg-white/[0.03] px-5 py-6 text-center">
                  <div className="font-serif text-3xl font-semibold text-sage-bd">{n}</div>
                  <div className="mt-1.5 text-[0.7333rem] leading-snug text-ink-2">{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="mt-6 grid gap-3 pb-2 sm:grid-cols-3">
              {[
                ["Stárnoucí populace", "Do 2050 bude 30 % Evropanů starších 65 let. Poptávka poroste po celá desetiletí."],
                ["Přetížený systém", "Kapacity domovů a pečovatelů nestačí tempu demografické změny."],
                ["Fragmentovaný trh", "Tisíce poskytovatelů bez sdílené infrastruktury. Rodiny začínají od nuly."],
              ].map(([t, b]) => (
                <div key={t} className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-5">
                  <span className="mb-3 inline-block h-1.5 w-1.5 rounded-full bg-sage" />
                  <div className="text-[0.8667rem] font-medium text-paper">{t}</div>
                  <div className="mt-1.5 text-[0.7333rem] leading-relaxed text-ink-2">{b}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SOCIETAL IMPACT ──────────────────────────────────── */}
      <section
        className="py-24"
        style={{ background: "#F5EFE6", borderTop: "0.5px solid #E8DDD0", borderBottom: "0.5px solid #E8DDD0" }}
      >
        <div className="sh-container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-[0.7333rem] font-medium uppercase tracking-widest text-amber">
              Celospolečenský přínos
            </span>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-ink">
              Péče o seniory je<br />
              <em className="font-serif font-semibold not-italic text-sage-d">
                celospolečenská odpovědnost.
              </em>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-2">
              Každý rok se desítky tisíc rodin ocitnou nepřipraveny před jedním
              z nejtěžších rozhodnutí v životě. SENIOR HOUSE propojuje rodiny,
              stát i poskytovatele — a vytváří infrastrukturu, která dává smysl
              lidem i kapitálu.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {impactCards.map((c, i) => (
              <Reveal key={c.headline} delay={i * 60}>
                <div
                  className="flex h-full flex-col gap-4 rounded-2xl border p-7"
                  style={{ background: "white", borderColor: "#E8DDD0" }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.iconBg}`}>
                      <c.icon size={20} className={c.iconColor} />
                    </div>
                    <div>
                      <div className="font-serif text-3xl font-semibold leading-none text-ink">{c.headline}</div>
                      <div className="mt-1 text-[0.7333rem] leading-snug text-ink-3">{c.sublabel}</div>
                    </div>
                  </div>
                  <p
                    className="text-[0.8rem] leading-relaxed text-ink-2"
                    style={{ borderTop: "0.5px solid #F0EDE8", paddingTop: "14px" }}
                  >
                    {c.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={180}>
            <div className="mt-8 flex flex-col gap-5 rounded-2xl bg-ink p-8 md:flex-row md:items-center">
              <p className="flex-1 font-serif text-[1.1333rem] font-light italic leading-relaxed text-paper">
                „Stavíme infrastrukturu, která{" "}
                <span className="font-normal not-italic text-sage-bd">
                  odlehčuje rodinám, systému i státu
                </span>{" "}
                — a přitom tvoří jednu z největších investičních příležitostí
                v evropském zdravotnictví."
              </p>
              <div className="flex flex-wrap gap-2 md:max-w-[220px]">
                {partners.map((p) => (
                  <span key={p} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.6667rem] text-ink-2">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PLATFORM MODULES ─────────────────────────────────── */}
      <section className="bg-surface-2 py-24">
        <div className="sh-container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-[0.7333rem] font-medium uppercase tracking-widest text-sage">Platforma</span>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-ink">
              Šest technologických modulů.
            </h2>
            <p className="mt-4 text-base text-ink-2">Každý řeší konkrétní zlomové místo v procesu péče.</p>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m, i) => (
              <Reveal key={m.title} delay={i * 50}>
                <div className="card h-full p-6 transition-shadow hover:shadow-soft-lg">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-l text-sage-d">
                    <m.icon size={18} />
                  </div>
                  <h3 className="mt-4 text-[1rem] font-semibold text-ink">{m.title}</h3>
                  <p className="mt-1.5 text-[0.8667rem] leading-relaxed text-ink-2">{m.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISION ───────────────────────────────────────────── */}
      <section className="bg-ink py-24 text-paper">
        <div className="sh-container">
          <Reveal>
            <span className="text-[0.7333rem] font-medium uppercase tracking-widest text-sage-bd">
              Vize infrastruktury
            </span>
            <h2 className="mt-3 max-w-lg font-serif text-4xl font-semibold leading-tight text-paper">
              Hledání péče je jen začátek.
            </h2>
          </Reveal>

          <Reveal delay={80}>
            <div className="relative mt-12">
              <div className="absolute left-2 right-0 top-[18px] h-px bg-white/8" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {timeline.map((t) => (
                  <div key={t.year} className="relative pt-10">
                    <div className={`absolute left-0 top-2.5 h-4 w-4 rounded-full border-[1.5px] border-sage ${t.active ? "bg-sage" : "bg-ink"}`} />
                    <div className="text-[0.7333rem] font-medium text-sage-bd">{t.year}</div>
                    <div className="mt-1 text-[0.8667rem] font-medium text-paper">{t.label}</div>
                    <div className="mt-1 text-[0.7333rem] leading-snug text-ink-2">{t.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ecoNodes.map((n) => (
                <div
                  key={n.label}
                  className={`rounded-xl border px-3 py-2.5 text-center text-[0.7333rem] ${
                    n.tier === "active"
                      ? "border-sage/40 bg-sage/25 font-medium text-sage-l"
                      : n.tier === "primary"
                      ? "border-sage/20 bg-sage/12 text-sage-bd"
                      : "border-white/[0.07] bg-white/[0.04] text-ink-2"
                  }`}
                >
                  {n.label}
                </div>
              ))}
            </div>
            <p className="mt-3 text-[0.6667rem] text-ink-2">
              Aktivní v MVP &nbsp;·&nbsp; V horizontu 2027 &nbsp;·&nbsp; Dlouhodobá vize
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-paper py-24">
        <div className="sh-container text-center">
          <Reveal>
            <p className="mx-auto max-w-2xl font-serif text-3xl font-light italic leading-snug text-ink sm:text-4xl">
              „Důstojnost si zaslouží infrastrukturu."
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a href={`mailto:${INVESTOR_EMAIL}`} className="btn btn-ink">
                Kontakt pro investory <ArrowRight size={16} />
              </a>
              <Link href="/zacit" className="btn btn-ghost">Vyzkoušet demo</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-line/60 bg-paper py-10">
        <div className="sh-container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="font-serif text-lg font-semibold text-ink">
            Senior<span className="text-sage">House</span>
          </span>
          <p className="text-sm text-ink-3">
            © {new Date().getFullYear()} SENIOR HOUSE · GDPR · Ověření poskytovatelé
          </p>
        </div>
      </footer>
    </main>
  );
}
