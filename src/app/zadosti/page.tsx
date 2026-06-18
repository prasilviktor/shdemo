"use client";

import { useState, useMemo } from "react";
import {
  MapPin, Clock, Upload, Send, CalendarClock, CalendarPlus,
  Check, CircleDashed, X,
  AlertTriangle, Building2, Star, BadgeCheck,
  Brain, Home, Sun,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useApplications } from "@/lib/applications-context";
import {
  stageMeta, chanceMeta, careKindText, timeAgo, formatDate,
  careKindAccent,
  type Application, type AppStage, type CareKind,
} from "@/data/applications";
import { providers } from "@/data/providers";

const toneBadge: Record<string, string> = {
  peach: "badge-peach", amber: "badge-amber", neutral: "badge-neutral",
  sky: "badge-sky", sage: "badge-sage",
};

export default function ZadostiPage() {
  return (
    <AppShell title="Žádosti" greeting={false}>
      <Inner />
    </AppShell>
  );
}

function Inner() {
  const { apps, endApplication } = useApplications();
  const [confirmEnd, setConfirmEnd] = useState<Application | null>(null);
  const [detailApp, setDetailApp] = useState<Application | null>(null);

  const stagePrio: Record<AppStage, number> = {
    action: 0, offer: 1, review: 2, waitlist: 3, accepted: 4, ended: 5,
  };

  // Dvě skupiny: co po vás něco chce × na co se jen čeká
  const { needsYou, waiting } = useMemo(() => {
    const active = [...apps].filter((a) => a.stage !== "ended");
    const sortFn = (x: Application, y: Application) => stagePrio[x.stage] - stagePrio[y.stage];
    return {
      needsYou: active.filter((a) => a.stage === "action" || a.stage === "offer").sort(sortFn),
      waiting: active.filter((a) => a.stage === "review" || a.stage === "waitlist" || a.stage === "accepted").sort(sortFn),
    };
  }, [apps]);

  const total = needsYou.length + waiting.length;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-6 sm:px-7">

      {/* Hlavička */}
      <div>
        <h1 className="font-serif text-[1.7333rem] font-medium text-ink">Žádosti</h1>
        <p className="mt-1 text-[0.9333rem] text-ink-2 a11y-dim">
          Přehled zařízení, kam jste podali žádost. Nahoře to, co teď potřebuje vaši reakci.
        </p>
      </div>

      {total === 0 && (
        <div className="rounded-xl2 border border-dashed border-line py-12 text-center text-[0.9333rem] text-ink-2">
          Zatím nemáte žádné aktivní žádosti.
        </div>
      )}

      {/* Skupina 1 — potřebuje reakci */}
      {needsYou.length > 0 && (
        <section>
          <h2 className="mb-2.5 flex items-center gap-2 text-[0.9333rem] font-semibold text-ink">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-peach-l text-peach"><AlertTriangle size={13} /></span>
            Potřebuje vaši reakci
            <span className="text-[0.8333rem] font-normal text-ink-2">({needsYou.length})</span>
          </h2>
          <div className="space-y-3">
            {needsYou.map((a) => (
              <ListRow key={a.id} app={a} onEnd={() => setConfirmEnd(a)} onDetail={() => setDetailApp(a)} />
            ))}
          </div>
        </section>
      )}

      {/* Skupina 2 — čeká se */}
      {waiting.length > 0 && (
        <section>
          <h2 className="mb-2.5 flex items-center gap-2 text-[0.9333rem] font-semibold text-ink">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 text-ink-2"><Clock size={13} /></span>
            Čeká se na vyjádření
            <span className="text-[0.8333rem] font-normal text-ink-2">({waiting.length})</span>
          </h2>
          <div className="space-y-3">
            {waiting.map((a) => (
              <ListRow key={a.id} app={a} onEnd={() => setConfirmEnd(a)} onDetail={() => setDetailApp(a)} />
            ))}
          </div>
        </section>
      )}

      {confirmEnd && (
        <EndModal
          app={confirmEnd}
          onCancel={() => setConfirmEnd(null)}
          onConfirm={() => { endApplication(confirmEnd.id); setConfirmEnd(null); }}
        />
      )}

      {detailApp && (
        <ApplicationDetail app={detailApp} onClose={() => setDetailApp(null)} />
      )}
    </div>
  );
}

/* ─── Kruhová ikona typu péče (vizuální kotva místo iniciál) ─── */
function CareIcon({ kind, size = 22 }: { kind: CareKind; size?: number }) {
  const map = { building: Building2, brain: Brain, home: Home, sun: Sun };
  const Icon = map[careKindAccent[kind].icon];
  return <Icon size={size} strokeWidth={1.8} />;
}

/* ─── SEZNAM řádek ─── */
function ListRow({ app, onEnd, onDetail }: {
  app: Application; onEnd: () => void; onDetail: () => void;
}) {
  const meta = stageMeta[app.stage];
  const ended = app.stage === "ended";
  const needsAction = app.stage === "action" || app.stage === "offer";
  const isOffer = app.stage === "offer";
  const accent = careKindAccent[app.careKind];

  return (
    <div className="relative flex overflow-hidden rounded-xl2 border border-line bg-surface shadow-soft">
      {/* Svislý barevný pruh — kotva podle typu péče */}
      <span className="w-1.5 shrink-0" style={{ background: accent.bar }} aria-hidden />

      <div className="min-w-0 flex-1 px-4 py-3 sm:px-5">
        {/* Zóna 1: identita — ikona + dominantní název + Detail vpravo */}
        <div className="flex items-start gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ background: accent.chipBg, color: accent.chipText }}
          >
            <CareIcon kind={app.careKind} size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-[1.1333rem] font-medium leading-snug text-ink">
              {app.facility}
            </h3>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.8667rem] text-ink-2">
              <span className="flex items-center gap-1"><MapPin size={13} /> {app.location}</span>
              <span aria-hidden className="text-ink-3">·</span>
              <span
                className="rounded-full px-2 py-0.5 text-[0.8rem] font-medium"
                style={{ background: accent.chipBg, color: accent.chipText }}
              >
                {careKindText(app.careKind)}
              </span>
              <span aria-hidden className="text-ink-3">·</span>
              <span className="flex items-center gap-1 text-ink-3"><Send size={12} /> Podáno {formatDate(app.submittedAt)}</span>
            </div>
          </div>
          <button
            onClick={onDetail}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-line-2 bg-surface px-3.5 py-2 text-[0.8667rem] font-medium text-ink hover:border-sage-bd hover:bg-sage-l a11y-tap"
          >
            Zobrazit detail
          </button>
        </div>

        {/* Zóna 2: stav */}
        {needsAction ? (
          <div className={`mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-xl px-3.5 py-2.5 ${isOffer ? "bg-amber-l" : "bg-peach-l"}`}>
            {isOffer
              ? <CalendarClock size={17} className="shrink-0 text-amber" />
              : <AlertTriangle size={17} className="shrink-0 text-peach" />}
            <span className={`flex-1 text-[0.9333rem] font-semibold ${isOffer ? "text-amber" : "text-peach"}`}>
              {app.stateLabel}
            </span>
            <span className={`flex items-center gap-1.5 text-[0.8667rem] font-semibold ${isOffer ? "text-amber" : "text-peach"}`}>
              {app.stage === "action" && app.actionDue
                ? <><CalendarClock size={14} /> do {app.actionDue}</>
                : <><Clock size={14} /> {app.waitEstimate}</>}
            </span>
          </div>
        ) : (
          // Skupina „Čeká se" — kompaktní textový stav
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-xl bg-paper px-3.5 py-2.5">
            <span className="text-[0.9333rem] font-semibold text-ink">{app.stateLabel}</span>
            <span className="flex items-center gap-3 text-[0.8667rem]">
              <span className="flex items-center gap-1 text-ink-2"><Clock size={14} /> {app.waitEstimate}</span>
              {!ended && <ChanceDot app={app} />}
            </span>
          </div>
        )}

        {/* Zóna 3: akce — hlavní vlevo, Ukončit odsazené vpravo a výstražné */}
        {needsAction && (
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <PrimaryCTA app={app} />
            <button
              onClick={onEnd}
              className="ml-auto flex items-center gap-1.5 rounded-lg border border-peach-bd px-3 py-2 text-[0.8667rem] font-medium text-peach hover:border-peach hover:bg-peach-l a11y-tap"
            >
              <X size={15} /> Ukončit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Kompaktní textová cesta žádosti (nahrazuje velkou progres-lištu) ─── */


/* ─── Detail overlay žádosti ─── */
const docIcon = {
  verified: <Check size={14} className="text-sage" />,
  delivered: <CircleDashed size={14} className="text-sky" />,
  missing: <AlertTriangle size={14} className="text-peach" />,
};
const docLabel = { verified: "Ověřeno", delivered: "Odesláno", missing: "Chybí" };
const fromLabel = { provider: "Zařízení", coordinator: "Koordinátorka", family: "Vy" };
const fromCls: Record<string, string> = { provider: "text-sky", coordinator: "text-sage-d", family: "text-ink-2" };

function ApplicationDetail({ app, onClose }: { app: Application; onClose: () => void }) {
  const meta = stageMeta[app.stage];
  const ended = app.stage === "ended";
  // Najdeme odpovídajícího providera pokud existuje
  const provider = providers.find((p) => p.name === app.facility);

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
              <h2 className="font-serif text-[1.4rem] font-medium text-ink">{app.facility}</h2>
              <span className={`badge ${toneBadge[meta.tone]}`}>{meta.label}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8rem] text-ink-2">
              <span className="flex items-center gap-1"><MapPin size={11} /> {app.location}</span>
              <span className="flex items-center gap-1"><Send size={11} /> Podáno {formatDate(app.submittedAt)}</span>
              <span className="flex items-center gap-1"><Clock size={11} /> {app.waitEstimate}</span>
              {!ended && <ChanceDot app={app} />}
            </div>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-3 hover:bg-surface-2">
            <X size={18} />
          </button>
        </div>

        {/* Scrollovatelný obsah */}
        <div className="flex-1 overflow-y-auto">
          {/* Foto / info zařízení z providers databáze */}
          {provider && (
            <div className="border-b border-line bg-gradient-to-br from-[#e8f0ea] to-[#d4e6d8] px-6 py-6">
              <div className="flex items-start gap-4">
                <Building2 size={32} className="shrink-0 text-sage/50 mt-0.5" />
                <div>
                  <p className="text-[0.9rem] leading-relaxed text-sage-d/80">{provider.tagline}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8rem] text-sage-d">
                    <span className="flex items-center gap-1"><Star size={12} className="fill-sage-d" /> {provider.rating} ({provider.reviewCount} recenzí)</span>
                    <span aria-hidden>·</span>
                    <span>{provider.distanceKm} km</span>
                    {provider.verified && <><span aria-hidden>·</span><span className="flex items-center gap-1"><BadgeCheck size={13} /> Ověřeno</span></>}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-5 px-6 py-5 md:grid-cols-2">
            <div className="space-y-5">
              {/* Stav žádosti */}
              <div>
                <Lbl>Aktuální stav</Lbl>
                <div className="rounded-xl bg-paper px-3.5 py-3">
                  <div className="text-[0.9333rem] font-medium text-ink">{app.stateLabel}</div>
                  {app.stage === "action" && app.actionDue && (
                    <div className="mt-1 text-[0.8rem] font-medium text-peach">
                      Termín akce: {app.actionDue}
                    </div>
                  )}
                </div>
              </div>

              {/* Kontakt */}
              <div>
                <Lbl>Kontaktní osoba</Lbl>
                <div className="text-[0.9333rem] font-medium text-ink">{app.contactName}</div>
                <div className="text-[0.8rem] text-ink-3">{app.contactRole}</div>
              </div>

              {/* Koordinátorka */}
              <div>
                <Lbl>Poznámka koordinátorky</Lbl>
                <div className="rounded-xl bg-sage-l px-3.5 py-2.5 text-[0.8667rem] leading-relaxed text-sage-d">
                  {app.coordinatorNote}
                </div>
              </div>

              {/* Dokumenty */}
              <div>
                <Lbl>Požadované dokumenty</Lbl>
                <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
                  {app.requiredDocs.map((d) => (
                    <li key={d.name} className={`flex items-center justify-between px-3.5 py-2 ${d.status === "missing" ? "bg-red-50" : ""}`}>
                      <span className="flex items-center gap-2 text-[0.8667rem] text-ink">
                        {docIcon[d.status]} {d.name}
                      </span>
                      <span className={`text-[0.7333rem] font-medium ${
                        d.status === "missing" ? "text-peach" : d.status === "delivered" ? "text-sky" : "text-sage-d"
                      }`}>{docLabel[d.status]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Historie komunikace */}
            <div>
              <Lbl>Historie komunikace</Lbl>
              <ol className="relative ml-1 space-y-3 border-l border-line pl-4">
                {[...app.history].reverse().map((e, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-line-2 ring-2 ring-surface" />
                    <div className="text-[0.7333rem] font-medium uppercase tracking-wide">
                      <span className={fromCls[e.from]}>{fromLabel[e.from]}</span>
                      <span className="ml-2 font-normal normal-case text-ink-3">{timeAgo(e.at)}</span>
                    </div>
                    <p className="mt-0.5 text-[0.8667rem] leading-snug text-ink-2 a11y-dim">{e.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Akce */}
        <div className="shrink-0 flex items-center justify-between gap-2 border-t border-line px-6 py-4">
          {!ended ? <PrimaryCTA app={app} /> : <span className="text-[0.8667rem] text-ink-3">Žádost ukončena</span>}
          <button onClick={onClose} className="btn btn-ghost text-[0.9333rem]">Zavřít</button>
        </div>
      </div>
    </div>
  );
}

function Lbl({ children }: { children: React.ReactNode }) {
  return <div className="mb-1.5 text-[0.6667rem] font-semibold uppercase tracking-[0.08em] text-ink-3">{children}</div>;
}

/* ─── modal ukončení ─── */
function EndModal({ app, onCancel, onConfirm }: { app: Application; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/30 backdrop-blur-[1px]" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-xl2 border border-line bg-surface p-6 shadow-soft-lg">
        <h2 className="font-serif text-[1.3333rem] font-medium text-ink">Ukončit poptávku u tohoto zařízení?</h2>
        <p className="mt-2 text-[0.9333rem] leading-relaxed text-ink-2 a11y-dim">
          <span className="font-medium text-ink">{app.facility}</span> přesuneme mezi ukončené žádosti.
          Můžete se k němu kdykoliv vrátit.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="btn btn-ghost text-[0.9333rem]">Zpět</button>
          <button onClick={onConfirm} className="btn text-[0.9333rem] bg-ink text-paper hover:bg-ink-2">Ukončit poptávku</button>
        </div>
      </div>
    </div>
  );
}

/* ─── badge stavu + šance ─── */
function ChanceDot({ app }: { app: Application }) {
  const cm = chanceMeta[app.chance];
  return (
    <span className="flex items-center gap-1.5 text-[0.8rem]" style={{ color: cm.dot }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: cm.dot }} /> {cm.label}
    </span>
  );
}

function PrimaryCTA({ app }: { app: Application }) {
  if (app.stage === "action")
    return <button className="flex items-center gap-2 rounded-lg bg-peach px-4 py-2.5 text-[0.8667rem] font-medium text-white hover:opacity-90 a11y-tap"><Upload size={16} /> Nahrát dokument</button>;
  if (app.stage === "offer")
    return <button className="flex items-center gap-2 rounded-lg bg-amber px-4 py-2.5 text-[0.8667rem] font-medium text-white hover:opacity-90 a11y-tap"><CalendarPlus size={16} /> Naplánovat návštěvu</button>;
  if (app.stage === "ended")
    return <span className="text-[0.8rem] text-ink-3">Ukončeno</span>;
  return <button className="flex items-center gap-2 rounded-lg border border-line-2 px-4 py-2.5 text-[0.8667rem] font-medium text-ink-2 hover:bg-surface-2 a11y-tap"><Send size={16} /> Napsat</button>;
}
