"use client";

import Link from "next/link";
import { Compass, FileText, Wallet, Building2, ArrowRight, LifeBuoy, Phone } from "lucide-react";
import { AppShell } from "@/components/app-shell";

/* ─── Průvodci ─── */
const GUIDES = [
  {
    href: "/situace",
    icon: Compass,
    title: "Životní situace",
    desc: "Nevíte, kde začít? Vyberte situaci, která vám je blízká — dostanete konkrétní průvodce.",
    cta: "Vybrat situaci",
  },
  {
    href: "/prispevek",
    icon: FileText,
    title: "Příspěvek na péči",
    desc: "Jak požádat o státní příspěvek, jaké jsou stupně závislosti a kolik dostanete.",
    cta: "Průvodce příspěvkem",
  },
  {
    href: "/finance",
    icon: Wallet,
    title: "Financování péče",
    desc: "Z čeho lze péči hradit, kolik stojí jednotlivé typy a jak sestavit rodinný rozpočet.",
    cta: "Průvodce financováním",
  },
  {
    href: "/prohlidka",
    icon: Building2,
    title: "Prohlídka zařízení",
    desc: "Na co se ptát při návštěvě domova, co sledovat a jak porovnat více zařízení.",
    cta: "Průvodce prohlídkou",
  },
];

export default function PomocPage() {
  return (
    <AppShell title="Pomoc a podpora" greeting={false}>
      <div className="mx-auto max-w-3xl px-5 py-6 sm:px-7">

        <h1 className="font-serif text-[1.7333rem] font-medium text-ink">Pomoc a podpora</h1>
        <p className="mt-1 text-[0.9333rem] text-ink-2 a11y-dim">
          Průvodci, které vám pomohou zorientovat se — bez zbytečného žargonu.
        </p>

        {/* Průvodci */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {GUIDES.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="card flex flex-col items-start p-5 transition-colors hover:border-sage-bd"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage-l text-sage-d">
                <g.icon size={22} strokeWidth={1.8} />
              </span>
              <h2 className="mt-3 font-serif text-[1.2rem] font-medium leading-snug text-ink">{g.title}</h2>
              <p className="mt-1.5 text-[0.8667rem] leading-relaxed text-ink-2 a11y-dim">{g.desc}</p>
              <span className="mt-4 flex items-center gap-1 text-[0.8667rem] font-medium text-sage-d">
                {g.cta} <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>

        {/* Kam se mohu obrátit — samostatná karta */}
        <Link
          href="/pomoc/kam-se-obratit"
          className="mt-3 flex items-center gap-4 rounded-xl2 border border-line bg-surface p-5 transition-colors hover:border-sage-bd"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sage-l text-sage-d">
            <LifeBuoy size={22} strokeWidth={1.8} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-serif text-[1.2rem] font-medium leading-snug text-ink">Kam se mohu obrátit</span>
            <span className="mt-0.5 block text-[0.8667rem] leading-relaxed text-ink-2 a11y-dim">
              Nezávislé linky pomoci a státní instituce — bez vazby na SENIOR HOUSE.
            </span>
          </span>
          <ArrowRight size={18} className="shrink-0 text-ink-3" />
        </Link>

      </div>
    </AppShell>
  );
}
