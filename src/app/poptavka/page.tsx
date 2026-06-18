"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check, MapPin, Clock, Star, Sparkles, Send, ChevronRight,
  Plus, X, CheckCircle2, CircleDashed, AlertCircle, ArrowRight,
  FileText, Phone, Building2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { providers } from "@/data/providers";
import { useSelection } from "@/lib/selection-context";
import { useApplications } from "@/lib/applications-context";
import { useSenior } from "@/lib/senior-context";
import type { Provider } from "@/lib/types";

const DOCS_AVAILABLE = [
  "Lékařská zpráva — Dr. Horáček",
  "Rozhodnutí o příspěvku na péči (stupeň III)",
];

type Status = "idle" | "confirming" | "sent";

type FacilityResult = {
  id: string;
  name: string;
  status: "responded" | "needs_docs" | "pending";
  statusLabel: string;
  waitEstimate: string;
  note: string;
};

const MOCK_RESULTS: Record<string, Omit<FacilityResult, "id" | "name">> = {
  default: {
    status: "pending", statusLabel: "Čeká na odpověď", waitEstimate: "3–6 měsíců",
    note: "Žádost přijata. Odpověď obvykle do 5–7 dnů.",
  },
};

function matchLabel(score: number): { text: string; cls: string } {
  if (score >= 93) return { text: "Velmi vhodné", cls: "border-sage-bd bg-sage-l text-sage-d" };
  if (score >= 85) return { text: "Dobrá shoda", cls: "border-amber-bd bg-amber-l text-amber" };
  return { text: "Vhodná alternativa", cls: "border-line-2 bg-surface-2 text-ink-2" };
}

export default function PoptavkaPage() {
  return (
    <AppShell title="Poptat zařízení" greeting={false}>
      <Inner />
    </AppShell>
  );
}

function Inner() {
  const { selected, toggle, count, clear } = useSelection();
  const { createApplicationsFrom } = useApplications();
  const { active } = useSenior();
  const [status, setStatus] = useState<Status>("idle");
  const [detailProvider, setDetailProvider] = useState<Provider | null>(null);
  const [sentProviders, setSentProviders] = useState<Provider[]>([]);

  const selectedProviders = providers.filter((p) => selected.includes(p.id));

  function confirmSend() {
    createApplicationsFrom(selectedProviders);
    setSentProviders(selectedProviders);
    clear();
    setStatus("sent");
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-6 sm:px-7">

      {/* Hlavička */}
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage text-white">
          <Sparkles size={20} />
        </span>
        <div>
          <h1 className="font-serif text-[1.6rem] font-medium text-ink">Poptat zařízení</h1>
          <p className="mt-0.5 text-[0.9333rem] text-ink-2 a11y-dim">
            Vybraná zařízení poptáme za vás — na základě profilu {active.name.split(" ")[0]}.
          </p>
        </div>
      </div>

      {status === "idle" && (
        <>
          {count === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-line-2 py-12 text-center">
              <p className="text-[1rem] text-ink">Nemáte vybraná žádná zařízení.</p>
              <p className="mt-2 text-[0.8667rem] text-ink-2 a11y-dim">Vyberte zařízení v Najít péči a pak je poptáte najednou.</p>
              <Link href="/search" className="btn btn-primary mt-5 a11y-tap">Najít péči</Link>
            </div>
          ) : (
            <>
              <div className="mt-5 flex flex-col gap-3">
                {selectedProviders.map((p) => (
                  <FacilityCard
                    key={p.id}
                    provider={p}
                    selected={selected.includes(p.id)}
                    onToggle={() => toggle(p.id)}
                    onDetail={() => setDetailProvider(p)}
                  />
                ))}
              </div>

              <Link
                href="/search"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line-2 py-3 text-[0.9333rem] font-medium text-ink-2 transition-colors hover:border-sage-bd hover:text-sage-d a11y-tap"
              >
                <Plus size={16} /> Přidat další domovy
              </Link>

              <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-sage-bd bg-sage-l/30 px-5 py-4">
                <p className="text-[0.8667rem] text-ink-2">
                  <span className="font-medium text-ink">{count} {count === 1 ? "zařízení vybráno" : count < 5 ? "zařízení vybrána" : "zařízení vybráno"}</span> — poptáme je za vás.
                </p>
                <button
                  onClick={() => setStatus("confirming")}
                  className="btn btn-primary shrink-0"
                >
                  <Send size={15} /> Poptat vybraná <ChevronRight size={15} />
                </button>
              </div>
            </>
          )}
        </>
      )}

      {status === "confirming" && (
        <ConfirmDialog
          selected={selectedProviders}
          onConfirm={confirmSend}
          onCancel={() => setStatus("idle")}
        />
      )}

      {status === "sent" && (
        <ResultsView providers={sentProviders} />
      )}

      {/* Detail overlay */}
      {detailProvider && (
        <FacilityDetail provider={detailProvider} onClose={() => setDetailProvider(null)} />
      )}
    </div>
  );
}

/* ── Karta zařízení ── */
function FacilityCard({ provider: p, selected, onToggle, onDetail }: {
  provider: Provider; selected: boolean; onToggle: () => void; onDetail: () => void;
}) {
  const ml = matchLabel(p.matchScore);
  return (
    <div className={`overflow-hidden rounded-xl border-2 transition-all ${
      selected ? "border-sage shadow-soft" : "border-line bg-surface hover:border-sage-bd"
    }`}>
      <div className="flex items-center gap-3 px-4 py-4">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
            selected ? "border-sage bg-sage text-white" : "border-line-2 bg-surface"
          }`}
          aria-label={selected ? "Odebrat ze výběru" : "Přidat do výběru"}
        >
          {selected && <Check size={13} strokeWidth={3} />}
        </button>

        {/* Info — kliknutelné pro detail */}
        <button
          onClick={onDetail}
          className="min-w-0 flex-1 text-left"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[1rem] font-medium text-ink hover:text-sage-d transition-colors">{p.name}</span>
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[0.7667rem] font-medium ${ml.cls}`}>
              <Star size={10} className="fill-current" /> {ml.text}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[0.8333rem] text-ink-3">
            <span className="flex items-center gap-1"><MapPin size={11} /> {p.location}</span>
            <span className={`flex items-center gap-1 ${p.availability === "immediate" ? "text-sage-d" : "text-amber"}`}>
              <Clock size={11} /> {p.availabilityLabel}
            </span>
            <span>od {p.monthlyCopay.toLocaleString("cs")} Kč / měs.</span>
          </div>
        </button>

        {/* Detail tlačítko */}
        <button
          onClick={onDetail}
          className="shrink-0 flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-[0.8rem] text-ink-2 hover:border-sage-bd hover:text-sage-d transition-colors a11y-tap"
        >
          Detail <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

/* ── Detail zařízení overlay ── */
function FacilityDetail({ provider: p, onClose }: { provider: Provider; onClose: () => void }) {
  const ml = matchLabel(p.matchScore);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 p-0 sm:p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl bg-surface shadow-soft-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hlavička */}
        <div className="flex shrink-0 items-start justify-between border-b border-line px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-[1.4667rem] font-medium text-ink">{p.name}</h2>
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[0.7667rem] font-medium ${ml.cls}`}>
                <Star size={10} className="fill-current" /> {ml.text}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-[0.8667rem] text-ink-3">
              <MapPin size={13} /> {p.location} · {p.distanceKm} km
            </div>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-3 hover:bg-surface-2" aria-label="Zavřít">
            <X size={18} />
          </button>
        </div>

        {/* Scrollovatelný obsah */}
        <div className="flex-1 overflow-y-auto">
          {/* Foto placeholder */}
          <div className="bg-gradient-to-br from-[#e8f0ea] to-[#d4e6d8] px-6 py-8 text-center">
            <Building2 size={48} className="mx-auto text-sage/40" />
            <p className="mt-2 text-[0.8rem] text-sage-d/60">Fotografie zařízení</p>
          </div>

          <div className="space-y-5 px-6 py-5">
            <p className="text-[0.9333rem] leading-relaxed text-ink-2 a11y-dim">{p.description}</p>

            {/* Proč vhodné */}
            <div className="rounded-xl bg-sage-l px-4 py-3.5">
              <div className="mb-1.5 text-[0.6667rem] font-semibold uppercase tracking-wider text-sage-d/70">Proč vhodné</div>
              <p className="text-[0.9rem] leading-relaxed text-sage-d">{p.whyFit}</p>
            </div>

            {/* Klíčové info */}
            <div className="grid grid-cols-2 gap-3">
              <InfoBox label="Dostupnost" value={p.availabilityLabel} tone={p.availability === "immediate" ? "sage" : "amber"} />
              <InfoBox label="Doplatek" value={`od ${p.monthlyCopay.toLocaleString("cs")} Kč/měs.`} />
              <InfoBox label="Hodnocení" value={<><Star size={13} className="fill-amber text-amber" /> {p.rating} · {p.reviewCount} recenzí</>} />
              <InfoBox label="Provozovatel" value={p.operator} />
            </div>

            {/* Co je zahrnuto */}
            <div>
              <div className="mb-2 text-[0.7333rem] font-semibold uppercase tracking-wider text-ink-3">Co je zahrnuto</div>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {p.included.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-[0.8667rem] text-ink-2">
                    <Check size={14} className="shrink-0 text-sage" strokeWidth={2.5} />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Finance */}
            <div>
              <div className="mb-2 text-[0.7333rem] font-semibold uppercase tracking-wider text-ink-3">Financování</div>
              <div className="overflow-hidden rounded-xl border border-line">
                {p.finance.map((f, i) => (
                  <div key={i} className={`flex items-center justify-between px-4 py-2.5 text-[0.8667rem] ${
                    i > 0 ? "border-t border-line" : ""
                  } ${f.kind === "total" ? "bg-sage-l font-semibold text-sage-d" : ""}`}>
                    <span className={f.kind === "support" ? "text-sage-d" : "text-ink-2"}>{f.label}</span>
                    <span className={f.amount < 0 ? "text-sage-d" : f.kind === "total" ? "text-sage-d" : "text-ink"}>
                      {f.amount < 0 ? `−${Math.abs(f.amount).toLocaleString("cs")}` : `${f.amount.toLocaleString("cs")}`} Kč
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Poznámka koordinátorky */}
            {p.advisorNote && (
              <div className="rounded-xl border border-amber-bd bg-amber-l px-4 py-3.5">
                <div className="mb-1 text-[0.6667rem] font-semibold uppercase tracking-wider text-amber">Poznámka koordinátorky</div>
                <p className="text-[0.8667rem] leading-relaxed text-ink-2">{p.advisorNote}</p>
              </div>
            )}

            {/* Požadované dokumenty */}
            <div>
              <div className="mb-2 text-[0.7333rem] font-semibold uppercase tracking-wider text-ink-3">Požadované dokumenty</div>
              <div className="space-y-1.5">
                {p.requiredDocs.map((d) => (
                  <div key={d} className="flex items-center gap-2 text-[0.8667rem] text-ink-2">
                    <FileText size={13} className="shrink-0 text-ink-3" />
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Akce */}
        <div className="shrink-0 flex gap-2 border-t border-line px-6 py-4">
          <button onClick={onClose} className="btn btn-primary flex-1 text-[0.9333rem]">
            <Check size={15} /> Hotovo
          </button>
          <Link href="/messages" className="btn btn-ghost flex-1 text-[0.9333rem]">
            <Phone size={15} /> Kontaktovat
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "sage" | "amber" }) {
  return (
    <div className="rounded-xl border border-line bg-paper px-3.5 py-3">
      <div className="text-[0.6667rem] font-semibold uppercase tracking-wider text-ink-3">{label}</div>
      <div className={`mt-0.5 flex items-center gap-1 text-[0.9rem] font-medium ${
        tone === "sage" ? "text-sage-d" : tone === "amber" ? "text-amber" : "text-ink"
      }`}>{value}</div>
    </div>
  );
}

/* ── Potvrzovací dialog (samostatná stránka, ne modal) ── */
function ConfirmDialog({ selected, onConfirm, onCancel }: {
  selected: Provider[]; onConfirm: () => void; onCancel: () => void;
}) {
  const [consent, setConsent] = useState(false);
  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-line bg-surface shadow-soft">
      <div className="border-b border-line px-6 py-5">
        <h2 className="font-serif text-[1.3333rem] font-medium text-ink">
          Odeslat poptávky do {selected.length} {selected.length === 1 ? "zařízení" : "zařízení"}?
        </h2>
      </div>

      <div className="divide-y divide-line px-6">
        {selected.map((p) => {
          const ml = matchLabel(p.matchScore);
          return (
            <div key={p.id} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <div className="text-[0.9333rem] font-medium text-ink">{p.name}</div>
                <div className="flex items-center gap-1 text-[0.8rem] text-ink-3">
                  <MapPin size={10} /> {p.location}
                </div>
              </div>
              <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[0.7667rem] font-medium ${ml.cls}`}>
                {ml.text}
              </span>
            </div>
          );
        })}
      </div>

      <div className="border-t border-line bg-paper-2/50 px-6 py-4">
        <div className="text-[0.7333rem] font-semibold uppercase tracking-wider text-ink-3">Co uděláme za vás</div>
        <ul className="mt-2.5 space-y-2">
          {[
            `Kontaktujeme ${selected.length} ${selected.length === 1 ? "zařízení" : "zařízení"} do 24 hodin`,
            `Přiložíme: ${DOCS_AVAILABLE.join(" · ")}`,
            "Hlídáme odpovědi a upozorníme vás na každou změnu",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[0.9rem] text-ink-2">
              <Check size={15} className="mt-0.5 shrink-0 text-sage" strokeWidth={2.5} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Souhlas — klient musí zaškrtnout */}
      <div className="border-t border-line px-6 py-4">
        <button
          onClick={() => setConsent((c) => !c)}
          className="flex w-full items-start gap-3 text-left a11y-tap"
        >
          <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
            consent ? "border-sage bg-sage text-white" : "border-line-2 bg-surface text-transparent"
          }`}>
            <Check size={14} strokeWidth={3} />
          </span>
          <span className="text-[0.8667rem] leading-relaxed text-ink-2">
            Souhlasím se sdílením vybraných dokumentů z trezoru s těmito zařízeními za účelem poptávky. Souhlas mohu kdykoli odvolat.
          </span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line px-6 py-4">
        <button onClick={onCancel} className="btn btn-ghost text-[0.9333rem]">Zpět</button>
        <button
          onClick={onConfirm}
          disabled={!consent}
          className="btn btn-primary text-[1rem] px-6 py-3 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={16} /> Odeslat poptávky
        </button>
      </div>
    </div>
  );
}

/* ── Výsledková obrazovka ── */
function ResultsView({ providers: sent }: { providers: Provider[] }) {
  const results: FacilityResult[] = sent.map((p) => ({
    id: p.id, name: p.name, ...MOCK_RESULTS.default,
  }));
  const pending = results.length;

  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-line bg-surface shadow-soft">
      <div className="flex items-center gap-3 border-b border-line bg-sage-l/40 px-6 py-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sage text-white">
          <Check size={20} strokeWidth={2.5} />
        </span>
        <div>
          <h2 className="font-serif text-[1.3333rem] font-medium text-ink">Poptávky odeslány</h2>
          <p className="text-[0.8667rem] text-ink-2 a11y-dim">Koordinátorka sleduje odpovědi a upozorní vás na každou změnu.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-line border-b border-line">
        <StatCell n={pending} label="poptávek odesláno" cls="text-sage-d" />
        <StatCell n={pending} label="čeká na odpověď" cls="text-ink-3" />
      </div>

      <div className="divide-y divide-line">
        {results.map((r) => (
          <div key={r.id} className="flex items-start gap-3 px-5 py-4">
            <CircleDashed size={18} className="shrink-0 text-ink-3 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[0.9333rem] font-medium text-ink">{r.name}</span>
                <div className="flex items-center gap-2 text-[0.8rem]">
                  <span className="font-medium text-ink-3">{r.statusLabel}</span>
                  <span className="text-ink-3">· {r.waitEstimate}</span>
                </div>
              </div>
              <p className="mt-0.5 text-[0.8333rem] text-ink-2 a11y-dim">{r.note}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 border-t border-line px-6 py-4">
        <Link href="/zadosti" className="btn btn-primary flex-1 text-[0.9333rem]">
          <ArrowRight size={15} /> Přejít na Žádosti
        </Link>
        <Link href="/search" className="btn btn-ghost flex-1 text-[0.9333rem]">Zpět na Najít péči</Link>
      </div>
    </div>
  );
}

function StatCell({ n, label, cls }: { n: number; label: string; cls: string }) {
  return (
    <div className="py-3 text-center">
      <div className={`font-serif text-[1.4667rem] font-medium leading-none ${cls}`}>{n}</div>
      <div className="mt-0.5 text-[0.7333rem] text-ink-3">{label}</div>
    </div>
  );
}
