"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check, Circle, ArrowRight, Phone, MapPin, CalendarClock, AlertTriangle, X, Pencil,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { providers } from "@/data/providers";
import { useSenior } from "@/lib/senior-context";

const DONE = ["Profil péče", "Dokumentace", "Registrace", "Žádost o příspěvek"];
const IN_PROGRESS = [
  { label: "Výběr zařízení", note: "3 vhodná zařízení s volnou kapacitou" },
  { label: "Domluvení návštěvy", note: "Čeká na potvrzení termínu" },
  { label: "Posouzení zdravotního stavu", note: "Naplánováno po návštěvě" },
];
const WATCH = [
  { label: "Chybí lékařská zpráva", tone: "peach" },
  { label: "Není potvrzen termín návštěvy", tone: "amber" },
];

export default function PlanPage() {
  const { active } = useSenior();
  const [editOpen, setEditOpen] = useState(false);
  const top = [...providers].sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  const doneCount = DONE.length;
  const totalCount = DONE.length + IN_PROGRESS.length;
  const pct = Math.round((doneCount / totalCount) * 100);

  return (
    <AppShell title="Plán péče" greeting={false}>
      <div className="mx-auto max-w-5xl px-5 py-6 sm:px-7">
        {/* ═══ PROFIL SENIORA (nahoře) ═══ */}
        <div className="overflow-hidden rounded-xl2 border border-line bg-surface">
          <div className="h-1 bg-gradient-to-r from-sage via-sage-bd to-transparent" />
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-sage-bd bg-gradient-to-br from-[#c8e0d4] to-[#a0c8b8] font-serif text-[1.4667rem] text-sage-d">
                {active.initials}
              </span>
              <div>
                <div className="text-[0.6667rem] font-semibold uppercase tracking-wider text-sage">Profil seniora</div>
                <h1 className="mt-0.5 font-serif text-[1.6rem] font-medium text-ink">{active.name}</h1>
                <div className="mt-0.5 text-[0.8667rem] text-ink-2 a11y-dim">{active.age} let · {active.location} · {active.careLabel}</div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {active.tags.map((t) => (
                    <span key={t} className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[0.7333rem] text-ink-2">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => setEditOpen(true)} className="btn btn-ghost shrink-0 text-[0.8667rem]">
              <Pencil size={14} /> Upravit profil
            </button>
          </div>
        </div>

        {/* ═══ DVOUSLOUPEC: CESTA | AKTIVNÍ PRAVÁ STRANA ═══ */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr,360px]">
          {/* LEVÁ — cesta péče */}
          <div className="card p-6">
            <div className="card-lbl">Cesta péče</div>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-sage" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-[0.8rem] font-medium text-sage-d">{doneCount}/{totalCount}</span>
            </div>
            <ol className="relative ml-3 border-l-2 border-line">
              {DONE.map((step) => (
                <li key={step} className="relative mb-5 pl-6 last:mb-0">
                  <span className="absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-sage text-white"><Check size={12} strokeWidth={3} /></span>
                  <div className="text-[0.9333rem] font-medium text-ink">{step}</div>
                  <div className="text-[0.8rem] text-sage-d">Dokončeno</div>
                </li>
              ))}
              {IN_PROGRESS.map((step, i) => (
                <li key={step.label} className="relative mb-5 pl-6 last:mb-0">
                  <span className={`absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full border-2 ${i === 0 ? "border-amber bg-amber-l" : "border-line-2 bg-surface"}`}>
                    <Circle size={8} className={i === 0 ? "fill-amber text-amber" : "fill-line-2 text-line-2"} />
                  </span>
                  <div className="text-[0.9333rem] font-medium text-ink">{step.label}</div>
                  <div className="text-[0.8rem] text-ink-3">{i === 0 ? <span className="text-amber">Probíhá · </span> : null}{step.note}</div>
                </li>
              ))}
            </ol>
          </div>

          {/* PRAVÁ — aktivní */}
          <div className="flex flex-col gap-4">
            {/* Doporučený krok */}
            <div className="overflow-hidden rounded-xl2 border border-sage-bd bg-sage-l">
              <div className="p-5">
                <div className="flex items-center gap-2 text-[0.6667rem] font-semibold uppercase tracking-wider text-sage-d">
                  <CalendarClock size={13} /> Aktuální doporučený krok
                </div>
                <div className="mt-2 font-serif text-[1.2rem] font-medium leading-snug text-ink">
                  Naplánovat návštěvu Domova U Tří lip
                </div>
                <p className="mt-1 text-[0.8667rem] text-sage-d">Volné místo za ~2 týdny. Návštěva je poslední krok před rozhodnutím.</p>
                <Link href="/messages" className="btn btn-primary mt-3 w-full text-[0.8667rem]">Naplánovat návštěvu <ArrowRight size={15} /></Link>
              </div>
            </div>

            {/* Koordinátorka */}
            <div className="card p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-sage-bd bg-gradient-to-br from-[#c8e0d4] to-[#a0c8b8] font-serif text-[0.9333rem] text-sage-d">JP</span>
                <div className="min-w-0">
                  <div className="text-[0.6667rem] font-semibold uppercase tracking-wider text-sage">Koordinátorka</div>
                  <div className="font-serif text-[1rem] font-medium text-ink">Jana Procházková</div>
                </div>
              </div>
              <div className="mt-3 text-[0.8rem] text-ink-2 a11y-dim">
                <span className="font-medium text-ink">Poslední aktivita: </span>Doporučila 3 zařízení · před 2 h
              </div>
              <div className="mt-3 flex gap-2">
                <Link href="/koordinator" className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line-2 py-2 text-[0.8rem] font-medium text-ink-2 hover:bg-surface-2"><Phone size={13} /> Zavolat</Link>
                <Link href="/messages" className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-sage py-2 text-[0.8rem] font-medium text-white hover:bg-sage-d">Zpráva</Link>
              </div>
            </div>

            {/* Na co si dát pozor */}
            <div className="card p-5">
              <div className="card-lbl">Na co si dát pozor</div>
              <div className="space-y-2">
                {WATCH.map((w) => (
                  <div key={w.label} className={`flex items-start gap-2.5 rounded-xl px-3.5 py-2.5 ${w.tone === "peach" ? "bg-peach-l" : "bg-amber-l"}`}>
                    <AlertTriangle size={15} className={`mt-0.5 shrink-0 ${w.tone === "peach" ? "text-peach" : "text-amber"}`} />
                    <span className={`text-[0.8667rem] font-medium ${w.tone === "peach" ? "text-peach" : "text-amber"}`}>{w.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Doporučená zařízení + financování */}
        <div className="mt-4 grid gap-4 md:grid-cols-[1.5fr,1fr]">
          <div className="card p-5">
            <div className="card-lbl">
              Doporučená zařízení
              <Link href="/search" className="text-[0.7333rem] font-normal normal-case tracking-normal text-sage">Porovnat →</Link>
            </div>
            {top.map((p) => (
              <Link key={p.id} href="/search" className="mb-2 flex items-center gap-3 rounded-xl border border-line bg-paper px-3.5 py-3 transition-colors last:mb-0 hover:border-line-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-[0.8rem] font-medium text-sage-d">{p.initials}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[0.8667rem] font-medium text-ink">{p.name}</div>
                  <div className="flex items-center gap-1 truncate text-[0.7333rem] text-ink-3"><MapPin size={10} /> {p.location} · {p.availabilityLabel}</div>
                </div>
                <span className="badge badge-sage shrink-0">{p.matchScore}%</span>
              </Link>
            ))}
          </div>

          <div className="card p-5">
            <div className="card-lbl">
              Financování
              <Link href="/finance" className="text-[0.7333rem] font-normal normal-case tracking-normal text-sage">Spočítat →</Link>
            </div>
            <div className="space-y-2">
              {[["Důchod", "19 000 Kč"], ["Příspěvek na péči", "4 400 Kč"], ["Rodina", "3 000 Kč"]].map(([l, v]) => (
                <div key={l} className="flex justify-between text-[0.8667rem]"><span className="text-ink-2 a11y-dim">{l}</span><span className="font-medium text-sage-d">{v}</span></div>
              ))}
              <div className="flex justify-between border-t border-line pt-2 text-[0.8667rem]"><span className="font-medium text-ink">Doplatek rodiny</span><span className="font-semibold text-ink">{active.copay}</span></div>
            </div>
            <Link href="/finance" className="btn btn-ghost mt-3 w-full text-[0.8667rem]">Otevřít rozvahu</Link>
          </div>
        </div>
      </div>

      {/* Slide-over: úprava profilu */}
      {editOpen && <ProfileEditor onClose={() => setEditOpen(false)} />}
    </AppShell>
  );
}

function ProfileEditor({ onClose }: { onClose: () => void }) {
  const { active } = useSenior();
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-sm" onClick={onClose}>
      <div className="flex h-full w-full max-w-md flex-col bg-paper shadow-soft-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-serif text-[1.2rem] font-medium text-ink">Upravit profil péče</h2>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full text-ink-2 hover:bg-surface-2"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <p className="mb-4 rounded-xl bg-sage-l px-3.5 py-2.5 text-[0.8rem] leading-relaxed text-sage-d">
            Na těchto údajích stojí doporučení zařízení, výpočet financování i plán péče. Změny se promítnou všude.
          </p>

          <Field label="Jméno" defaultValue={active.name} />
          <Field label="Věk" defaultValue={String(active.age)} suffix="let" />
          <Field label="Lokalita" defaultValue={active.location} />

          <div className="mb-4">
            <label className="field-label">Stupeň závislosti</label>
            <div className="flex flex-wrap gap-1.5">
              {["Stupeň I", "Stupeň II", "Stupeň III", "Stupeň IV"].map((s) => (
                <button key={s} className={`chip a11y-tap ${active.tags.includes(s) ? "border-sage bg-sage-l text-sage-d" : "border-line-2 bg-surface text-ink-2"}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="field-label">Zdravotní stav</label>
            <div className="flex flex-wrap gap-1.5">
              {["Mírná demence", "Pokročilá demence", "Chodítko", "Vozík", "Po hospitalizaci", "Imobilní"].map((s) => (
                <button key={s} className={`chip a11y-tap ${active.tags.includes(s) ? "border-sage bg-sage-l text-sage-d" : "border-line-2 bg-surface text-ink-2"}`}>{s}</button>
              ))}
            </div>
          </div>

          <Field label="Aktuální péče" defaultValue={active.careLabel} />
          <div className="mb-4">
            <label className="field-label">Poznámky pro koordinátorku</label>
            <textarea rows={3} className="field-input" placeholder="Cokoli důležitého o zvyklostech, lécích, preferencích…" />
          </div>
        </div>

        <div className="border-t border-line px-5 py-4">
          <div className="flex gap-2">
            <button onClick={onClose} className="btn btn-ghost flex-1 text-[0.8667rem]">Zrušit</button>
            <button onClick={onClose} className="btn btn-primary flex-1 text-[0.8667rem]">Uložit změny</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, defaultValue, suffix }: { label: string; defaultValue: string; suffix?: string }) {
  return (
    <div className="mb-4">
      <label className="field-label">{label}</label>
      <div className="flex items-center gap-2 rounded-xl border border-line-2 bg-surface px-3.5 py-2.5 focus-within:border-sage focus-within:ring-2 focus-within:ring-sage/25">
        <input defaultValue={defaultValue} className="w-full bg-transparent text-[0.9333rem] text-ink focus:outline-none" />
        {suffix && <span className="shrink-0 text-[0.8667rem] text-ink-3">{suffix}</span>}
      </div>
    </div>
  );
}
