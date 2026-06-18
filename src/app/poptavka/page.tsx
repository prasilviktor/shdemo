"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Send, Check, CircleCheck, AlertCircle,
  MapPin, X, Plus, Sparkles, CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ProviderVisual } from "@/components/ui";
import { useSelection } from "@/lib/selection-context";
import { useApplications } from "@/lib/applications-context";
import { useSenior } from "@/lib/senior-context";
import { providers, mockDocuments } from "@/data/providers";
import type { Provider } from "@/lib/types";

type Step = "recap" | "confirm" | "sent";

function verdictOf(p: Provider): { text: string; cls: string } {
  if (p.matchScore >= 93) return { text: "Velmi vhodné", cls: "bg-sage-l text-sage-d border-sage-bd" };
  if (p.matchScore >= 82) return { text: "Dobrá shoda", cls: "bg-amber-l text-amber border-amber-bd" };
  return { text: "Vhodná alternativa", cls: "bg-surface-2 text-ink-2 border-line-2" };
}

export default function PoptavkaPage() {
  return (
    <AppShell title="Poptat zařízení" greeting={false}>
      <Inner />
    </AppShell>
  );
}

function Inner() {
  const router = useRouter();
  const { selected, remove, clear, count } = useSelection();
  const { createApplicationsFrom } = useApplications();
  const { active } = useSenior();
  const [step, setStep] = useState<Step>("recap");
  const [consent, setConsent] = useState(false);
  const [detail, setDetail] = useState<Provider | null>(null);

  const chosen = providers.filter((p) => selected.includes(p.id));

  const ready = mockDocuments.filter((d) => d.status === "verified" || d.status === "pending");
  const missingRequired = mockDocuments.filter((d) => d.status === "missing" && d.required);

  function send() {
    createApplicationsFrom(chosen);
    clear();
    setStep("sent");
  }

  /* ── Prázdný výběr ── */
  if (count === 0 && step !== "sent") {
    return (
      <div className="mx-auto max-w-xl px-5 py-12 text-center sm:px-7">
        <p className="text-[1rem] text-ink">Nemáte vybraná žádná zařízení.</p>
        <p className="mt-2 text-[0.8667rem] text-ink-2 a11y-dim">
          Vyberte zařízení v Najít péči a pak je poptáte najednou.
        </p>
        <Link href="/search" className="btn btn-primary mt-5 a11y-tap">Najít péči</Link>
      </div>
    );
  }

  /* ── Po odeslání ── */
  if (step === "sent") {
    return (
      <div className="mx-auto max-w-xl px-5 py-10 text-center sm:px-7">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sage-l text-sage-d">
          <CheckCircle2 size={34} strokeWidth={2} />
        </span>
        <h1 className="mt-5 font-serif text-[1.8rem] font-medium leading-tight text-ink">
          Poptávka odeslána
        </h1>
        <p className="mt-2 text-[1rem] leading-relaxed text-ink-2 a11y-dim">
          Předali jsme ji {chosen.length} {chosen.length === 1 ? "zařízení" : "zařízením"} a hlídáme odpovědi.
          Vše najdete v Žádostech.
        </p>
        <div className="mt-6 flex flex-col items-center gap-2.5">
          <Link href="/zadosti" className="btn btn-primary w-full max-w-xs a11y-tap">
            Sledovat v Žádostech <ArrowRight size={16} />
          </Link>
          <Link href="/search" className="btn btn-ghost w-full max-w-xs a11y-tap">
            Zpět na Najít péči
          </Link>
        </div>
      </div>
    );
  }

  /* ═══ FÁZE 1 — Rekapitulace (jednoduchá) ═══ */
  if (step === "recap") {
    return (
      <div className="mx-auto max-w-2xl px-5 py-6 sm:px-7">
        <Link href="/search" className="a11y-tap mb-4 inline-flex items-center gap-1.5 text-[0.8667rem] font-medium text-ink-2 hover:text-ink">
          <ArrowLeft size={15} /> Zpět na Najít péči
        </Link>

        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sage text-white">
            <Sparkles size={20} />
          </span>
          <div>
            <h1 className="font-serif text-[1.7333rem] font-medium leading-tight text-ink">
              Poptat {count} {count === 1 ? "zařízení" : count < 5 ? "zařízení" : "zařízení"}?
            </h1>
            <p className="mt-1 text-[0.9333rem] text-ink-2 a11y-dim">Pro {active.name} — podle profilu, stavu a rozpočtu.</p>
          </div>
        </div>

        {/* Seznam zařízení + verdikt */}
        <div className="mt-5 overflow-hidden rounded-xl2 border border-line bg-surface">
          {chosen.map((p, i) => {
            const v = verdictOf(p);
            return (
              <div key={p.id} className={`flex items-center gap-3 px-5 py-4 ${i > 0 ? "border-t border-line" : ""}`}>
                <div className="min-w-0 flex-1">
                  <div className="text-[0.9667rem] font-medium text-ink">{p.name}</div>
                  <div className="mt-0.5 flex items-center gap-1 text-[0.8333rem] text-ink-3"><MapPin size={11} /> {p.location}</div>
                </div>
                <span className={`hidden shrink-0 rounded-full border px-3 py-1 text-[0.7667rem] font-medium sm:inline-block ${v.cls}`}>{v.text}</span>
                <button onClick={() => setDetail(p)} className="shrink-0 rounded-lg border border-line-2 px-3 py-2 text-[0.8rem] font-medium text-ink-2 hover:border-sage-bd hover:text-sage-d a11y-tap">
                  Detail
                </button>
                <button onClick={() => remove(p.id)} aria-label="Odebrat ze výběru" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-3 hover:bg-surface-2 hover:text-peach a11y-tap">
                  <X size={16} />
                </button>
              </div>
            );
          })}
        </div>

        <Link href="/search" className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl2 border border-dashed border-line-2 py-3 text-[0.8667rem] font-medium text-ink-2 hover:border-sage-bd hover:text-sage-d a11y-tap">
          <Plus size={16} /> Přidat další domovy
        </Link>

        {/* Co uděláme za vás */}
        <div className="mt-5 rounded-xl2 border border-sage-bd bg-sage-l/40 p-5">
          <h2 className="text-[0.7333rem] font-semibold uppercase tracking-wider text-sage-d">Co uděláme za vás</h2>
          <ul className="mt-3 space-y-2.5">
            {[
              `Kontaktujeme ${count === 1 ? "zařízení" : "všechna zařízení"} do 24 hodin`,
              "Přiložíme dokumenty, které máte v trezoru",
              "Ohlídáme odpovědi a upozorníme vás na každou změnu",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-[0.9333rem] text-ink-2">
                <Check size={16} className="mt-0.5 shrink-0 text-sage" strokeWidth={2.5} /> {t}
              </li>
            ))}
          </ul>
        </div>

        <button onClick={() => setStep("confirm")} className="btn btn-primary mt-6 w-full py-3.5 text-[1rem] a11y-tap">
          Pokračovat <ArrowRight size={17} />
        </button>

        {detail && <ProviderDetailModal p={detail} onClose={() => setDetail(null)} />}
      </div>
    );
  }

  /* ═══ FÁZE 2 — Potvrzení (co odešleme + souhlas) ═══ */
  return (
    <div className="mx-auto max-w-2xl px-5 py-6 sm:px-7">
      <button onClick={() => setStep("recap")} className="a11y-tap mb-4 inline-flex items-center gap-1.5 text-[0.8667rem] font-medium text-ink-2 hover:text-ink">
        <ArrowLeft size={15} /> Zpět
      </button>

      <h1 className="font-serif text-[1.7333rem] font-medium leading-tight text-ink">
        Než odešleme poptávku
      </h1>
      <p className="mt-1 text-[0.9333rem] text-ink-2 a11y-dim">
        Zkontrolujte, co {count} {count === 1 ? "zařízení obdrží" : "zařízení obdrží"}.
      </p>

      {/* Kam poptávka půjde — souhrn (zde už needitovatelné) */}
      <div className="mt-5 rounded-xl2 border border-line bg-surface p-5">
        <h2 className="text-[0.7333rem] font-semibold uppercase tracking-wider text-ink-3">Poptávka půjde do</h2>
        <div className="mt-3 space-y-2.5">
          {chosen.map((p) => (
            <div key={p.id} className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[0.7rem] font-semibold" style={{ background: `hsl(${p.hue},32%,92%)`, color: `hsl(${p.hue},34%,32%)` }}>
                {p.initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[0.9333rem] font-medium text-ink">{p.name}</div>
                <div className="flex items-center gap-1 text-[0.8rem] text-ink-3"><MapPin size={10} /> {p.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Co odešleme s poptávkou */}
      <div className="mt-5 rounded-xl2 border border-line bg-surface p-5">
        <h2 className="text-[0.7333rem] font-semibold uppercase tracking-wider text-ink-3">Co odešleme s poptávkou</h2>
        <div className="mt-3 space-y-2">
          {ready.map((d) => (
            <div key={d.id} className="flex items-center gap-2.5 text-[0.9333rem] text-ink">
              <CircleCheck size={17} className="shrink-0 text-sage" /> {d.name}
            </div>
          ))}
          {missingRequired.map((d) => (
            <div key={d.id} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.9333rem] text-amber">
              <span className="flex items-center gap-2.5"><AlertCircle size={17} className="shrink-0" /> {d.name} chybí</span>
              <Link href="/documents" className="font-medium underline underline-offset-2 hover:no-underline">doplnit</Link>
              <span className="text-ink-3">nebo poslat bez něj</span>
            </div>
          ))}
        </div>
      </div>

      {/* Souhlas — klient musí zaškrtnout */}
      <button
        onClick={() => setConsent((c) => !c)}
        className="mt-4 flex w-full items-start gap-3 rounded-xl2 border border-line bg-surface px-4 py-4 text-left a11y-tap"
      >
        <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
          consent ? "border-sage bg-sage text-white" : "border-line-2 bg-surface text-transparent"
        }`}>
          <Check size={14} strokeWidth={3} />
        </span>
        <span className="text-[0.8667rem] leading-relaxed text-ink-2">
          Souhlasím se sdílením vybraných dokumentů s těmito zařízeními za účelem poptávky. Souhlas mohu kdykoli odvolat.
        </span>
      </button>

      {/* Odeslat — aktivní až po souhlasu */}
      <button
        onClick={send}
        disabled={!consent}
        className="btn btn-primary mt-5 w-full py-3.5 text-[1rem] a11y-tap disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Send size={17} /> Odeslat poptávky
      </button>
      {!consent && (
        <p className="mt-2 text-center text-[0.8rem] text-ink-3">Pro odeslání potvrďte souhlas se sdílením dokumentů.</p>
      )}
    </div>
  );
}

/* ─── Detail zařízení (kompaktní) ─── */
function ProviderDetailModal({ p, onClose }: { p: Provider; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-paper sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <ProviderVisual hue={p.hue} className="h-40 w-full" />
          <button onClick={onClose} aria-label="Zavřít" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink hover:bg-paper">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">
          <h2 className="font-serif text-[1.3333rem] font-medium text-ink">{p.name}</h2>
          <p className="mt-1 flex items-center gap-1 text-[0.8667rem] text-ink-3"><MapPin size={13} /> {p.location} · {p.operator}</p>

          <p className="mt-4 text-[0.9333rem] leading-relaxed text-ink-2 a11y-dim">{p.description}</p>

          {p.included?.length > 0 && (
            <>
              <h3 className="mt-5 text-[0.7333rem] font-semibold uppercase tracking-wider text-ink-3">V ceně</h3>
              <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {p.included.map((it) => (
                  <li key={it} className="flex items-start gap-2 text-[0.8667rem] text-ink-2 a11y-dim">
                    <Check size={15} className="mt-0.5 shrink-0 text-sage" /> {it}
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-5 flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3">
            <span className="text-[0.8333rem] text-ink-2">Doplatek po příspěvku</span>
            <span className="font-serif text-[1.2rem] font-medium text-ink">od {p.monthlyCopay.toLocaleString("cs")} Kč / měs.</span>
          </div>

          <button onClick={onClose} className="btn btn-ghost mt-4 w-full a11y-tap">Zavřít</button>
        </div>
      </div>
    </div>
  );
}
