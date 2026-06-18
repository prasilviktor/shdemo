"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Phone, Mail, MapPin, Calendar, Activity, Brain, Pill, FileText,
  Wallet, Clock, MessageSquare, Save, BellRing, X, AlertTriangle, Check,
  HeartHandshake, Stethoscope, Building2, StickyNote, ArrowRight, ChevronDown,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useSenior, careWantedLabels, availabilityLabels } from "@/lib/senior-context";

const CARE_OPTIONS = ["domaci", "pobytova", "odlehcovaci", "stacionar"];
const AVAIL_OPTIONS = ["ihned", "do_mesice", "nespecha", "vlastni"];
const BUDGET_BANDS = [
  { label: "do 8 000 Kč", min: 0, max: 8000 },
  { label: "8–12 000 Kč", min: 8000, max: 12000 },
  { label: "12–18 000 Kč", min: 12000, max: 18000 },
  { label: "18 000 Kč+", min: 18000, max: 30000 },
];

const ALLOWANCE_LEVELS = [
  { key: "I", label: "Stupeň I", amount: "880 Kč/měs" },
  { key: "II", label: "Stupeň II", amount: "4 400 Kč/měs" },
  { key: "III", label: "Stupeň III", amount: "12 800 Kč/měs" },
  { key: "IV", label: "Stupeň IV", amount: "19 200 Kč/měs" },
];

export default function ProfilPage() {
  return (
    <AppShell title="Profil péče" greeting={false}>
      <Inner />
    </AppShell>
  );
}

function Inner() {
  const { active, updateProfile, updateContacts } = useSenior();
  const router = useRouter();

  const [p, setP] = useState(active.profile);
  const [c, setC] = useState(active.contacts);
  const [healthTouched, setHealthTouched] = useState(false);
  const [saved, setSaved] = useState<null | "saved" | "notified">(null);

  // GP state
  const [gp, setGp] = useState({
    name: "",
    clinic: "",
    phone: "",
    email: "",
    notes: "",
  });

  // Allowance level state — derive from active.allowanceLevel or default to III
  const initialLevel = active.allowanceLevel?.includes("IV") ? "IV"
    : active.allowanceLevel?.includes("III") ? "III"
    : active.allowanceLevel?.includes("II") ? "II"
    : active.allowanceLevel?.includes("I") ? "I" : "III";
  const [allowanceLevel, setAllowanceLevel] = useState(initialLevel);

  const setProf = (patch: Partial<typeof p>) => setP((x) => ({ ...x, ...patch }));
  const markHealth = () => setHealthTouched(true);

  // Accordion — výchozí otevřená je první karta
  const [openId, setOpenId] = useState<string>("zaklad");
  const toggle = (id: string) => setOpenId((cur) => (cur === id ? "" : id));
  const levelInfo = ALLOWANCE_LEVELS.find((l) => l.key === allowanceLevel);

  function save(notify: boolean) {
    updateProfile(active.id, p);
    updateContacts(active.id, c);
    setSaved(notify ? "notified" : "saved");
    setTimeout(() => router.push("/pece"), 1100);
  }

  const budgetActive = (b: { min: number; max: number }) => p.budgetMin === b.min && p.budgetMax === b.max;

  return (
    <div className="mx-auto max-w-3xl px-5 py-6 sm:px-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-[1.7333rem] font-medium text-ink">Profil péče</h1>
          <p className="mt-1 max-w-xl text-[0.9333rem] leading-relaxed text-ink-2 a11y-dim">
            Aktuální stav {active.name.split(" ")[0]}y. Čím přesnější údaje, tím lépe vám koordinátorka
            najde vhodná zařízení.
          </p>
        </div>
      </div>

      {/* Upozornění na změnu zdravotního stavu */}
      {healthTouched && (
        <div className="mt-5 flex items-start gap-3 rounded-xl2 border border-amber-bd bg-amber-l px-4 py-3">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber" />
          <p className="text-[0.8667rem] leading-relaxed text-amber">
            Změna stavu může ovlivnit vhodnost zařízení. Koordinátorka změnu zkontroluje a případně upraví doporučení a žádosti.
          </p>
        </div>
      )}

      <div className="mt-5 space-y-4">
        {/* ZÁKLADNÍ ÚDAJE KLIENTA */}
        <Card title="Základní údaje klienta" icon={User}
          open={openId === "zaklad"} onToggle={() => toggle("zaklad")}
          complete={Boolean(p.address && p.phone)}
          summary={`${active.name} · ${p.address || "bez adresy"}`}>
          <Grid>
            <Text label="Jméno" value={active.name} icon={User} readOnly />
            <Text label="Rok narození" value={String(p.birthYear)} icon={Calendar}
              onChange={(v) => setProf({ birthYear: Number(v) || p.birthYear })} />
            <Text label="Adresa / lokalita" value={p.address} icon={MapPin} wide
              onChange={(v) => setProf({ address: v })} />
            <Text label="Telefon" value={p.phone} icon={Phone}
              onChange={(v) => setProf({ phone: v })} />
            <Text label="E-mail (pokud existuje)" value={p.email} icon={Mail}
              onChange={(v) => setProf({ email: v })} placeholder="nepovinné" />
          </Grid>
        </Card>

        {/* PRAKTICKÝ LÉKAŘ */}
        <Card title="Praktický lékař" icon={Stethoscope}
          open={openId === "lekar"} onToggle={() => toggle("lekar")}
          complete={Boolean(gp.name)}
          summary={gp.name ? `${gp.name}${gp.clinic ? " · " + gp.clinic : ""}` : "Důležitý kontakt pro koordinaci péče"}>
          <p className="mb-4 text-[0.8667rem] text-ink-2 a11y-dim">
            Praktický lékař je jedním z nejdůležitějších kontaktů v celém procesu péče — koordinátorka s ním může přímo komunikovat při zajišťování podkladů.
          </p>
          <Grid>
            <Text label="Jméno lékaře" value={gp.name} icon={User}
              onChange={(v) => setGp({ ...gp, name: v })} placeholder="MUDr. ..." />
            <Text label="Ordinace / praxe" value={gp.clinic} icon={Building2}
              onChange={(v) => setGp({ ...gp, clinic: v })} placeholder="název ordinace" />
            <Text label="Telefon" value={gp.phone} icon={Phone}
              onChange={(v) => setGp({ ...gp, phone: v })} />
            <Text label="E-mail" value={gp.email} icon={Mail}
              onChange={(v) => setGp({ ...gp, email: v })} placeholder="nepovinné" />
          </Grid>
          <div className="mt-3">
            <label className="field-label flex items-center gap-1.5"><StickyNote size={13} className="text-ink-3" /> Poznámky</label>
            <textarea
              value={gp.notes}
              onChange={(e) => setGp({ ...gp, notes: e.target.value })}
              rows={2}
              placeholder="Např. objednávací dny, speciální pokyny…"
              className="field-input resize-none text-[0.9333rem] leading-relaxed"
            />
          </div>
        </Card>

        {/* PŘÍSPĚVEK NA PÉČI — stupeň závislosti */}
        <Card title="Příspěvek na péči — stupeň závislosti" icon={Wallet}
          open={openId === "prispevek"} onToggle={() => toggle("prispevek")}
          complete
          summary={levelInfo ? `${levelInfo.label} · ${levelInfo.amount}` : undefined}>
          <p className="mb-4 text-[0.8667rem] text-ink-2 a11y-dim">
            Stupeň závislosti se mění v čase. Aktualizujte ho vždy, když dojde ke změně — koordinátorka přepočítá finanční rozvahu a zkontroluje vhodnost zařízení.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {ALLOWANCE_LEVELS.map((lvl) => {
              const on = allowanceLevel === lvl.key;
              return (
                <button
                  key={lvl.key}
                  onClick={() => setAllowanceLevel(lvl.key)}
                  className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-center transition-colors a11y-tap ${
                    on ? "border-sage bg-sage-l text-sage-d" : "border-line bg-surface text-ink-2 hover:border-line-2"
                  }`}
                >
                  <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-[0.8667rem] font-semibold ${on ? "bg-sage text-white" : "bg-surface-2"}`}>
                    {lvl.key}
                  </span>
                  <span className="text-[0.8rem] font-medium">{lvl.label}</span>
                  <span className={`text-[0.7333rem] ${on ? "text-sage-d" : "text-ink-3"}`}>{lvl.amount}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[0.8rem] text-ink-3">
            Aktuálně: <span className="font-medium text-ink">
              {ALLOWANCE_LEVELS.find(l => l.key === allowanceLevel)?.label} ({ALLOWANCE_LEVELS.find(l => l.key === allowanceLevel)?.amount})
            </span>
          </p>
          <Link
            href="/prispevek"
            className="mt-3 flex items-center gap-1.5 text-[0.8667rem] font-medium text-sage-d hover:text-sage a11y-tap"
          >
            <ArrowRight size={14} /> Mám nárok na příspěvek na péči?
          </Link>
        </Card>

        {/* OSOBA SPRAVUJÍCÍ ÚČET */}
        <Card title="Osoba, která spravuje účet" icon={HeartHandshake} anchor="kontakty"
          open={openId === "kontakty"} onToggle={() => toggle("kontakty")}
          complete={Boolean(c.manager.name && c.manager.phone)}
          summary={c.manager.name ? `${c.manager.name}${c.manager.relation ? " · " + c.manager.relation : ""}` : "Kontaktní osoba a komunikace"}>
          <Grid>
            <Text label="Jméno" value={c.manager.name} icon={User}
              onChange={(v) => setC({ ...c, manager: { ...c.manager, name: v } })} />
            <Text label="Vztah ke klientovi" value={c.manager.relation} icon={HeartHandshake}
              onChange={(v) => setC({ ...c, manager: { ...c.manager, relation: v } })} />
            <Text label="Telefon" value={c.manager.phone} icon={Phone}
              onChange={(v) => setC({ ...c, manager: { ...c.manager, phone: v } })} />
            <Text label="E-mail" value={c.manager.email} icon={Mail}
              onChange={(v) => setC({ ...c, manager: { ...c.manager, email: v } })} />
          </Grid>
          <div className="mt-3">
            <Lbl>Preferovaný způsob komunikace</Lbl>
            <Pills options={["Telefon", "E-mail", "SMS"]} value={c.manager.prefer}
              onPick={(v) => setC({ ...c, manager: { ...c.manager, prefer: v } })} />
          </div>
          <div className="mt-4 border-t border-line pt-4">
            <Lbl>Hlavní kontaktní osoba pro zařízení</Lbl>
            <Grid>
              <Text label="Jméno" value={c.facilityContact.name} icon={User}
                onChange={(v) => setC({ ...c, facilityContact: { ...c.facilityContact, name: v } })} />
              <Text label="Telefon" value={c.facilityContact.phone} icon={Phone}
                onChange={(v) => setC({ ...c, facilityContact: { ...c.facilityContact, phone: v } })} />
            </Grid>
          </div>
        </Card>

        {/* ZDRAVOTNÍ A PEČOVATELSKÝ STAV */}
        <Card title="Zdravotní a pečovatelský stav" icon={Activity}
          open={openId === "zdravi"} onToggle={() => toggle("zdravi")}
          complete={Boolean(p.mobility && p.orientation)}
          summary={[p.mobility, p.orientation].filter(Boolean).join(" · ") || "Mobilita, paměť, diagnózy, léky"}>
          <Grid>
            <Text label="Mobilita" value={p.mobility} icon={Activity} wide
              onChange={(v) => { setProf({ mobility: v }); markHealth(); }} />
            <Text label="Orientace / paměť" value={p.orientation} icon={Brain} wide
              onChange={(v) => { setProf({ orientation: v }); markHealth(); }} />
            <Text label="Diagnózy (oddělte čárkou)" value={p.diagnoses.join(", ")} icon={FileText} wide
              onChange={(v) => { setProf({ diagnoses: v.split(",").map((x) => x.trim()).filter(Boolean) }); markHealth(); }} />
            <Text label="Léky" value={p.medications} icon={Pill} wide
              onChange={(v) => { setProf({ medications: v }); markHealth(); }} />
          </Grid>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <Toggle label="Pomoc s hygienou" on={p.hygieneHelp} onClick={() => { setProf({ hygieneHelp: !p.hygieneHelp }); markHealth(); }} />
            <Toggle label="Pomoc s jídlem" on={p.mealHelp} onClick={() => { setProf({ mealHelp: !p.mealHelp }); markHealth(); }} />
            <Toggle label="Noční dohled" on={p.nightWatch} onClick={() => { setProf({ nightWatch: !p.nightWatch }); markHealth(); }} />
          </div>
        </Card>

        {/* HLEDANÁ PÉČE */}
        <Card title="Hledaná péče" icon={FileText}
          open={openId === "pece"} onToggle={() => toggle("pece")}
          complete={p.careWanted.length > 0}
          summary={p.careWanted.length ? p.careWanted.map((o) => careWantedLabels[o]).join(", ") : "Jaký typ péče hledáte"}>
          <div className="flex flex-wrap gap-2">
            {CARE_OPTIONS.map((o) => {
              const on = p.careWanted.includes(o);
              return (
                <button key={o}
                  onClick={() => setProf({ careWanted: on ? p.careWanted.filter((x) => x !== o) : [...p.careWanted, o] })}
                  className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[0.9333rem] font-medium transition-colors a11y-tap ${
                    on ? "border-sage bg-sage-l text-sage-d" : "border-line bg-surface text-ink-2 hover:border-line-2"
                  }`}>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-md border-2 ${on ? "border-sage bg-sage text-white" : "border-line-2"}`}>
                    {on && <Check size={12} strokeWidth={3} />}
                  </span>
                  {careWantedLabels[o]}
                </button>
              );
            })}
          </div>
        </Card>

        {/* DOSTUPNOST + ROZPOČET */}
        <Card title="Dostupnost a rozpočet" icon={Clock}
          open={openId === "dostupnost"} onToggle={() => toggle("dostupnost")}
          complete
          summary={`${availabilityLabels[p.availability]} · ${BUDGET_BANDS.find((b) => p.budgetMin === b.min && p.budgetMax === b.max)?.label ?? "rozpočet nevybrán"}`}>
          <Lbl>Kdy potřebujete péči</Lbl>
          <Pills options={AVAIL_OPTIONS.map((o) => availabilityLabels[o])} value={availabilityLabels[p.availability]}
            onPick={(v) => {
              const key = AVAIL_OPTIONS.find((o) => availabilityLabels[o] === v) ?? p.availability;
              setProf({ availability: key });
            }} />

          <div className="mt-4">
            <Lbl>Měsíční rozpočet rodiny (doplatek)</Lbl>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {BUDGET_BANDS.map((b) => (
                <button key={b.label}
                  onClick={() => setProf({ budgetMin: b.min, budgetMax: b.max })}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-[0.8667rem] font-medium transition-colors a11y-tap ${
                    budgetActive(b) ? "border-sage bg-sage-l text-sage-d" : "border-line bg-surface text-ink-2 hover:border-line-2"
                  }`}>
                  <Wallet size={14} /> {b.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* POZNÁMKA */}
        <Card title="Poznámka pro koordinátora" icon={MessageSquare}
          open={openId === "poznamka"} onToggle={() => toggle("poznamka")}
          complete={Boolean(p.coordinatorNote)}
          summary={p.coordinatorNote || "Přání klienta, citlivé informace, preference"}>
          <textarea
            value={p.coordinatorNote}
            onChange={(e) => setProf({ coordinatorNote: e.target.value })}
            rows={3}
            placeholder="Cokoliv důležitého — přání klienta, citlivé informace, preference lokality…"
            className="field-input resize-none text-[0.9333rem] leading-relaxed"
          />
        </Card>
      </div>

      {/* AKCE */}
      <div className="sticky bottom-0 mt-5 -mx-5 flex flex-wrap items-center gap-2 border-t border-line bg-paper/95 px-5 py-3 backdrop-blur sm:-mx-7 sm:px-7">
        <button onClick={() => save(true)} className="btn btn-primary text-[0.9333rem]">
          <BellRing size={16} /> Uložit a upozornit koordinátora
        </button>
        <button onClick={() => save(false)} className="btn btn-ghost text-[0.9333rem]">
          <Save size={16} /> Uložit změny
        </button>
        <button onClick={() => router.push("/pece")} className="ml-auto flex items-center gap-1.5 text-[0.9333rem] text-ink-2 hover:text-ink a11y-tap">
          <X size={16} /> Zrušit
        </button>
      </div>

      {/* Potvrzení uložení */}
      {saved && (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <div className="flex items-center gap-2.5 rounded-xl border border-sage-bd bg-sage-l px-4 py-3 text-[0.9333rem] font-medium text-sage-d shadow-soft-lg">
            <Check size={18} />
            {saved === "notified"
              ? "Uloženo — koordinátorka byla upozorněna na změnu."
              : "Změny uloženy."}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Stavební bloky ─── */
function Card({
  title, icon: Icon, anchor, children, summary, complete, open, onToggle,
}: {
  title: string; icon: typeof User; anchor?: string; children: React.ReactNode;
  summary?: string; complete?: boolean; open: boolean; onToggle: () => void;
}) {
  return (
    <section id={anchor} className="card overflow-hidden p-0 scroll-mt-20">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="a11y-tap flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sage-l text-sage-d"><Icon size={18} /></span>
        <span className="min-w-0 flex-1">
          <span className="block font-serif text-[1.1333rem] font-medium leading-tight text-ink">{title}</span>
          {!open && summary && (
            <span className="mt-0.5 block truncate text-[0.8333rem] text-ink-2">{summary}</span>
          )}
        </span>
        {!open && (
          complete ? (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-sage-l px-2.5 py-1 text-[0.7333rem] font-medium text-sage-d">
              <Check size={12} /> Vyplněno
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-surface-2 px-2.5 py-1 text-[0.7333rem] font-medium text-ink-3">
              Doplnit
            </span>
          )
        )}
        <ChevronDown size={18} className={`shrink-0 text-ink-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t border-line px-5 pb-5 pt-4">{children}</div>}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

function Text({
  label, value, icon: Icon, onChange, readOnly = false, wide = false, placeholder,
}: {
  label: string; value: string; icon: typeof User; onChange?: (v: string) => void;
  readOnly?: boolean; wide?: boolean; placeholder?: string;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label className="field-label flex items-center gap-1.5"><Icon size={13} className="text-ink-3" /> {label}</label>
      <input
        className={`field-input text-[0.9333rem] ${readOnly ? "bg-surface-2 text-ink-2" : ""}`}
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}

function Lbl({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 text-[0.8667rem] font-medium text-ink-2">{children}</div>;
}

function Pills({ options, value, onPick }: { options: string[]; value: string; onPick: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value === o;
        return (
          <button key={o} onClick={() => onPick(o)}
            className={`rounded-full border px-3.5 py-1.5 text-[0.8667rem] font-medium transition-colors a11y-tap ${
              on ? "border-sage bg-sage-l text-sage-d" : "border-line bg-surface text-ink-2 hover:border-line-2"
            }`}>
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-[0.9rem] font-medium transition-colors a11y-tap ${
        on ? "border-sage bg-sage-l text-sage-d" : "border-line bg-surface text-ink-2 hover:border-line-2"
      }`}>
      {label}
      <span className={`flex h-5 w-9 items-center rounded-full px-0.5 transition-colors ${on ? "bg-sage" : "bg-line-2"}`}>
        <span className={`h-4 w-4 rounded-full bg-white transition-transform ${on ? "translate-x-4" : ""}`} />
      </span>
    </button>
  );
}
