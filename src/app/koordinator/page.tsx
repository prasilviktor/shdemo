"use client";

import Link from "next/link";
import { Phone, Mail, MessageSquare, CalendarClock, Clock } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useSenior } from "@/lib/senior-context";

const HISTORY = [
  { when: "před 2 hodinami", text: "Doporučila 3 zařízení odpovídající situaci Marie.", kind: "rec" },
  { when: "včera", text: "Pomohla doplnit žádost o příspěvek na péči.", kind: "doc" },
  { when: "před 3 dny", text: "Telefonát — probrali jsme možnosti domácí vs. pobytové péče.", kind: "call" },
  { when: "před 5 dny", text: "Úvodní konzultace a sestavení plánu péče.", kind: "call" },
];

const NEXT_STEPS = [
  "Domluvit osobní návštěvu Domova U Tří lip",
  "Po návštěvě probrat dojmy a rozhodnutí",
  "Připravit podklady ke smlouvě",
];

export default function KoordinatorPage() {
  const { active } = useSenior();
  return (
    <AppShell title="Koordinátor péče" greeting={false}>
      <div className="mx-auto max-w-3xl px-5 py-6 sm:px-7">
        {/* Profil koordinátorky */}
        <div className="overflow-hidden rounded-xl2 border border-line bg-surface">
          <div className="h-1 bg-gradient-to-r from-sage via-sage-bd to-transparent" />
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-sage-bd bg-gradient-to-br from-[#c8e0d4] to-[#a0c8b8] font-serif text-[1.7333rem] text-sage-d">JP</span>
            <div className="flex-1">
              <div className="text-[0.6667rem] font-semibold uppercase tracking-wider text-sage">Vaše koordinátorka péče</div>
              <h1 className="mt-0.5 font-serif text-[1.6rem] font-medium text-ink">Jana Procházková</h1>
              <p className="mt-1 text-[0.8667rem] text-ink-2 a11y-dim">
                Provází vás péčí o {active.name.split(" ")[0]}. Spojení mezi vámi, zařízeními, lékaři a úřady.
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[0.8rem] text-sage-d">
                <Clock size={13} /> Obvykle odpovídá do hodiny · Po–Pá 8–18
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-4">
            <Link href="tel:" className="flex items-center justify-center gap-2 bg-surface py-3.5 text-[0.8667rem] font-medium text-sage-d transition-colors hover:bg-surface-2">
              <Phone size={16} /> Zavolat
            </Link>
            <Link href="/messages" className="flex items-center justify-center gap-2 bg-surface py-3.5 text-[0.8667rem] font-medium text-sage-d transition-colors hover:bg-surface-2">
              <MessageSquare size={16} /> Zprávy
            </Link>
            <Link href="mailto:" className="flex items-center justify-center gap-2 bg-surface py-3.5 text-[0.8667rem] font-medium text-ink-2 transition-colors hover:bg-surface-2">
              <Mail size={16} /> Email
            </Link>
            <button className="flex items-center justify-center gap-2 bg-surface py-3.5 text-[0.8667rem] font-medium text-ink-2 transition-colors hover:bg-surface-2">
              <CalendarClock size={16} /> Naplánovat hovor
            </button>
          </div>
        </div>

        {/* Kontakt */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="card p-4">
            <div className="text-[0.7333rem] font-semibold uppercase tracking-wider text-ink-3">Telefon</div>
            <div className="mt-1 font-serif text-[1.2rem] text-ink">+420 770 123 456</div>
          </div>
          <div className="card p-4">
            <div className="text-[0.7333rem] font-semibold uppercase tracking-wider text-ink-3">Email</div>
            <div className="mt-1 font-serif text-[1.2rem] text-ink">jana@seniorhouse.cz</div>
          </div>
        </div>

        {/* Další kroky */}
        <div className="mt-4 card p-5">
          <div className="card-lbl">Doporučené další kroky</div>
          <div className="space-y-2">
            {NEXT_STEPS.map((s, i) => (
              <div key={s} className={`flex items-start gap-3 rounded-xl px-3.5 py-3 ${i === 0 ? "bg-sage-l" : "bg-paper-2"}`}>
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.7333rem] font-semibold ${i === 0 ? "bg-sage text-white" : "border border-line-2 text-ink-3"}`}>{i + 1}</span>
                <span className={`text-[0.9333rem] ${i === 0 ? "font-medium text-sage-d" : "text-ink-2"}`}>{s}</span>
                {i === 0 && <Link href="/messages" className="ml-auto text-[0.8rem] font-medium text-sage underline-offset-2 hover:underline">Domluvit →</Link>}
              </div>
            ))}
          </div>
        </div>

        {/* Historie komunikace */}
        <div className="mt-4 card p-5">
          <div className="card-lbl">Historie komunikace</div>
          <ol className="relative ml-3 border-l-2 border-line">
            {HISTORY.map((h) => (
              <li key={h.text} className="relative mb-4 pl-5 last:mb-0">
                <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-sage bg-surface" />
                <div className="text-[0.8667rem] text-ink">{h.text}</div>
                <div className="text-[0.7333rem] text-ink-3">{h.when}</div>
              </li>
            ))}
          </ol>
          <Link href="/messages" className="btn btn-ghost mt-3 w-full text-[0.8667rem]">Zobrazit všechny zprávy</Link>
        </div>
      </div>
    </AppShell>
  );
}
