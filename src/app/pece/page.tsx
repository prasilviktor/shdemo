"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check, CircleDot, Circle, Upload, ArrowRight,
  FileText, MessageSquare, CalendarClock, Clock, ChevronRight,
  User, Phone, MapPin, Pencil, Activity, Pill, Wallet, Info,
  Sparkles, Star, Send,
} from "lucide-react";
import { providers } from "@/data/providers";
import { AppShell } from "@/components/app-shell";
import { useSenior, careWantedLabels } from "@/lib/senior-context";
import { useApplications } from "@/lib/applications-context";
import { useSelection } from "@/lib/selection-context";
import { applicationSummary, stageMeta, type Application, type AppStage } from "@/data/applications";

// Redesigned phases — from user's perspective, not internal process terminology
const PHASES = [
  { label: "Profil", desc: "Stav a potřeby" },
  { label: "Dokumenty", desc: "Podklady připraveny" },
  { label: "Výběr", desc: "Vhodná zařízení" },
  { label: "Žádosti odeslány", desc: "Čekáme na odpovědi" },
  { label: "Zařízení reagují", desc: "Posuzují žádost" },
  { label: "Nabídka", desc: "Volné místo" },
  { label: "Nástup", desc: "Péče zajištěna" },
];
const CURRENT = 4;

const COORDINATOR = {
  name: "Jana Procházková",
  role: "Koordinátorka péče",
  initials: "JP",
  lastWhen: "včera 15:42",
  working: "Čeká na vyjádření 3 zařízení a připravuje podklady k návštěvě Domova U Tří lip.",
};

const toneBadge: Record<string, string> = {
  peach: "badge-peach", amber: "badge-amber", neutral: "badge-neutral", sky: "badge-sky", sage: "badge-sage",
};

export default function PecePage() {
  return (
    <AppShell title="Přehled" greeting={false}>
      <Inner />
    </AppShell>
  );
}

function Inner() {
  const { active } = useSenior();
  const { apps } = useApplications();
  const s = applicationSummary(apps);

  // 3–5 nejvýznamnějších žádostí
  const prio: Record<AppStage, number> = { action: 0, offer: 1, review: 2, waitlist: 3, accepted: 4, ended: 9 };
  const topApps = [...apps]
    .filter((a) => a.stage !== "ended")
    .sort((x, y) => prio[x.stage] - prio[y.stage])
    .slice(0, 4);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-5 sm:px-7">

      {/* ═══ STAV PŘÍPADU — redesigned ═══ */}
      <section className="overflow-hidden rounded-xl2 border border-line bg-surface shadow-soft">
        <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-[0.6667rem] font-semibold uppercase tracking-wider text-sage-d">Kde se právě nacházíme</div>
            <h1 className="truncate font-serif text-[1.4667rem] font-medium leading-tight text-ink">{active.name}</h1>
            <p className="text-[0.8667rem] text-ink-2 a11y-dim">Hledáme dlouhodobé pobytové zařízení.</p>
          </div>
          <div className="shrink-0 rounded-xl border border-sage-bd bg-sage-l px-4 py-2.5 text-left sm:text-right">
            <div className="text-[0.6667rem] font-semibold uppercase tracking-wider text-sage-d">Nejbližší umístění</div>
            <div className="mt-0.5 font-serif text-[1rem] font-medium text-ink">Domov Pohoda</div>
            <div className="text-[0.8rem] text-sage-d">za 2–3 měsíce</div>
          </div>
        </div>
        {/* Compact progress — krok N z M + info ikonka */}
        <div className="border-t border-line bg-paper-2/40 px-4 py-3 sm:px-6">
          <PhaseProgress current={CURRENT} total={PHASES.length} phases={PHASES} />
        </div>
      </section>

      {/* ═══ DALŠÍ KROK — calm, not alarming ═══ */}
      <section className="overflow-hidden rounded-xl2 border border-sky-bd bg-sky-l shadow-soft">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky/15 text-sky">
            <Info size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[0.6667rem] font-semibold uppercase tracking-wider text-sky">Další krok</div>
            <h2 className="font-serif text-[1.2667rem] font-medium leading-tight text-ink">
              Domov Pohoda potřebuje neurologickou zprávu.
            </h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-[0.8333rem] text-ink-2 a11y-dim">
              <Clock size={13} className="text-sky" /> Termín: 12. června · Koordinátorka vás provede
            </p>
          </div>
          <Link href="/zadosti" className="btn btn-primary shrink-0 text-[0.9333rem]">
            <Upload size={16} /> Nahrát dokument
          </Link>
        </div>
      </section>

      {/* ═══ DOPORUČENÁ ZAŘÍZENÍ + KOORDINÁTOR ═══ */}
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <RecommendedFacilitiesCard />

        {/* Koordinátor */}
        <section className="card flex flex-col p-5">
          <div className="card-lbl">Váš koordinátor</div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-sage-bd bg-gradient-to-br from-[#c8e0d4] to-[#a0c8b8] font-serif text-[1rem] text-sage-d">
              {COORDINATOR.initials}
            </span>
            <div className="min-w-0">
              <div className="font-serif text-[1.0667rem] font-medium leading-tight text-ink">{COORDINATOR.name}</div>
              <div className="flex items-center gap-1.5 text-[0.7667rem] text-sage-d">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-sage" /> Aktivní {COORDINATOR.lastWhen}
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="text-[0.6667rem] font-semibold uppercase tracking-wider text-ink-3">Právě řeší</div>
            <p className="mt-0.5 text-[0.8333rem] leading-snug text-ink-2 a11y-dim">{COORDINATOR.working}</p>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <Link href="/messages" className="btn btn-primary text-[0.8667rem]"><MessageSquare size={15} /> Napsat zprávu</Link>
            <Link href="/koordinator" className="btn btn-ghost text-[0.8667rem]"><CalendarClock size={15} /> Naplánovat hovor</Link>
          </div>
        </section>
      </div>

      {/* ═══ ŽÁDOSTI ═══ */}
      <section className="card flex flex-col p-5">
        <div className="card-lbl">
          Žádosti — {s.total} aktivních
          <Link href="/zadosti" className="text-[0.7333rem] font-normal normal-case tracking-normal text-sage">Otevřít všechny →</Link>
        </div>
        <div className="flex-1 space-y-2">
          {topApps.map((a) => <MiniApp key={a.id} app={a} />)}
        </div>
        <Link href="/zadosti" className="btn btn-ink mt-3 w-full text-[0.9333rem]">
          <FileText size={16} /> Otevřít všechny žádosti
        </Link>
      </section>

      {/* ═══ KONTAKTY ═══ */}
      <section className="card p-5">
        <div className="card-lbl">
          Kontakty
          <Link href="/profil#kontakty" className="text-[0.7333rem] font-normal normal-case tracking-normal text-sage">Upravit →</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Contact role="Klient" name={active.name} detail={`${active.age} let · ${active.location}`} />
          <Contact role="Spravuje účet" name={active.contacts.manager.name}
            detail={`${active.contacts.manager.relation} · ${active.contacts.manager.phone}`} />
          <Contact role="Kontakt pro zařízení" name={active.contacts.facilityContact.name}
            detail={`${active.contacts.facilityContact.relation} · ${active.contacts.facilityContact.phone}`} />
        </div>
      </section>
    </div>
  );
}

function MiniApp({ app }: { app: Application }) {
  const meta = stageMeta[app.stage];
  const urgent = app.stage === "action";
  const offer = app.stage === "offer";
  const nextText =
    urgent ? app.stateLabel :
    offer ? "Nabídli volné místo" :
    app.stateLabel;
  return (
    <Link
      href="/zadosti"
      className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-colors hover:border-sage-bd ${
        urgent ? "border-peach-bd bg-peach-l/40" : offer ? "border-amber-bd bg-amber-l/40" : "border-line bg-paper"
      }`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[0.7333rem] font-semibold"
        style={{ background: `hsl(${app.hue},32%,92%)`, color: `hsl(${app.hue},34%,32%)` }}>
        {app.facility.split(" ").slice(0, 2).map((w) => w[0]).join("")}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[0.9rem] font-medium text-ink">{app.facility}</span>
          <span className={`badge ${toneBadge[meta.tone]} shrink-0`}>{meta.label}</span>
        </div>
        <div className="truncate text-[0.8rem] text-ink-2 a11y-dim">{nextText}</div>
      </div>
      <div className="shrink-0 text-right text-[0.7333rem]">
        {urgent && app.actionDue
          ? <span className="font-medium text-peach">do {app.actionDue}</span>
          : <span className="text-ink-3">{app.waitEstimate}</span>}
      </div>
    </Link>
  );
}

const MATCH_LABEL: Record<string, { text: string; cls: string }> = {
  high: { text: "Velmi vhodné", cls: "text-sage-d" },
  medium: { text: "Dobrá shoda", cls: "text-amber" },
  low: { text: "Vhodná alternativa", cls: "text-ink-3" },
};

function RecommendedFacilitiesCard() {
  const recommended = providers.filter((p) => p.recommended);
  const selection = useSelection();
  const router = useRouter();

  function poptat() {
    recommended.forEach((p) => selection.add(p.id));
    router.push("/poptavka");
  }

  return (
    <section className="overflow-hidden rounded-xl2 border border-sage-bd bg-surface shadow-soft">
      {/* Hlavička */}
      <div className="flex items-center justify-between border-b border-sage-bd/60 bg-sage-l/40 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage text-white">
            <Sparkles size={18} />
          </span>
          <div>
            <div className="text-[0.6667rem] font-semibold uppercase tracking-wider text-sage-d">Na základě vašeho profilu</div>
            <h2 className="font-serif text-[1.1333rem] font-medium leading-tight text-ink">
              Doporučená zařízení pro Vás
            </h2>
          </div>
        </div>
      </div>

      {/* Miniseznam */}
      <div className="divide-y divide-line">
        {recommended.map((p) => {
          const ml =
            p.matchScore >= 93 ? MATCH_LABEL.high
            : p.matchScore >= 85 ? MATCH_LABEL.medium
            : MATCH_LABEL.low;
          return (
            <div key={p.id} className="flex items-center gap-3 px-5 py-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[0.7333rem] font-semibold"
                style={{ background: `hsl(${p.hue},32%,92%)`, color: `hsl(${p.hue},34%,32%)` }}
              >
                {p.initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[0.9rem] font-medium text-ink">{p.name}</span>
                  <span className={`shrink-0 text-[0.7667rem] font-medium ${ml.cls}`}>{ml.text}</span>
                </div>
                <div className="flex items-center gap-2 text-[0.7667rem] text-ink-3">
                  <span className="flex items-center gap-1"><MapPin size={10} /> {p.location}</span>
                  <span>·</span>
                  <span className={p.availability === "immediate" ? "text-sage-d" : "text-amber"}>{p.availabilityLabel}</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[0.8rem] font-medium text-ink">od {p.monthlyCopay.toLocaleString("cs")} Kč</div>
                <div className="text-[0.7rem] text-ink-3">/ měs.</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dvě CTA */}
      <div className="grid grid-cols-2 gap-2 border-t border-sage-bd/60 bg-sage-l/20 px-5 py-3">
        <button onClick={poptat} className="btn btn-primary text-[0.8667rem]">
          <Send size={14} /> Poptat výběr
        </button>
        <Link href="/search" className="btn btn-ghost text-[0.8667rem]">
          Prohlédnout vše <ChevronRight size={14} />
        </Link>
      </div>
    </section>
  );
}

function Contact({ role, name, detail }: { role: string; name: string; detail: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-paper px-3.5 py-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink-2">
        <User size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[0.6667rem] font-semibold uppercase tracking-wider text-ink-3">{role}</div>
        <div className="truncate text-[0.9333rem] font-medium text-ink">{name}</div>
        <div className="truncate text-[0.8rem] text-ink-3">{detail}</div>
      </div>
    </div>
  );
}

/* ─── Compact phase progress ─── */
function PhaseProgress({
  current, total, phases,
}: {
  current: number; total: number; phases: { label: string; desc: string }[];
}) {
  const [open, setOpen] = useState(false);
  const pct = Math.round(((current - 1) / (total - 1)) * 100);
  const currentPhase = phases[current - 1];

  return (
    <div>
      {/* Řádek: krok X z Y + název + info */}
      <div className="flex items-center gap-2">
        <span className="text-[0.7333rem] font-semibold text-sage-d">Krok {current} z {total}</span>
        <span className="text-[0.7333rem] text-ink-3">·</span>
        <span className="text-[0.7333rem] font-medium text-ink">{currentPhase.label}</span>
        <button
          onClick={() => setOpen((v) => !v)}
          className="ml-auto flex h-6 w-6 items-center justify-center rounded-full text-ink-3 hover:bg-surface-2 transition-colors"
          aria-label="Co to znamená?"
        >
          <Info size={14} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-sage transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Rozbalovací info box */}
      {open && (
        <div className="mt-3 rounded-xl border border-sage-bd bg-sage-l px-4 py-3 text-[0.8333rem] text-ink-2 leading-relaxed">
          {currentPhase.desc} — zařízení dostávají žádosti a připravují posouzení. Jakmile některé odpoví, uvidíte to zde.
        </div>
      )}
    </div>
  );
}
