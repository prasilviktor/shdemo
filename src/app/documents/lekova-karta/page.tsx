"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2, ArrowLeft, Check, Pill, Info } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useSenior } from "@/lib/senior-context";

type Med = {
  id: string;
  name: string;
  dose: string;
  morning: boolean;
  noon: boolean;
  evening: boolean;
  night: boolean;
  note: string;
};

function emptyMed(): Med {
  return { id: "m" + Date.now() + Math.random().toString(36).slice(2, 6), name: "", dose: "", morning: false, noon: false, evening: false, night: false, note: "" };
}

const TIMES: { key: keyof Pick<Med, "morning" | "noon" | "evening" | "night">; label: string }[] = [
  { key: "morning", label: "Ráno" },
  { key: "noon", label: "Poledne" },
  { key: "evening", label: "Večer" },
  { key: "night", label: "Na noc" },
];

export default function LekovaKartaPage() {
  return (
    <AppShell title="Seznam léků">
      <Inner />
    </AppShell>
  );
}

function Inner() {
  const router = useRouter();
  const { active } = useSenior();
  const [meds, setMeds] = useState<Med[]>([
    { ...emptyMed(), name: "Donepezil", dose: "5 mg", evening: true, note: "" },
    emptyMed(),
  ]);
  const [saved, setSaved] = useState(false);

  function update(id: string, patch: Partial<Med>) {
    setMeds((list) => list.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }
  function remove(id: string) {
    setMeds((list) => (list.length > 1 ? list.filter((m) => m.id !== id) : list));
  }
  function add() {
    setMeds((list) => [...list, emptyMed()]);
  }
  function save() {
    setSaved(true);
    setTimeout(() => router.push("/documents"), 900);
  }

  const filledCount = meds.filter((m) => m.name.trim()).length;

  return (
    <div className="mx-auto max-w-2xl px-5 py-6 sm:px-7">
      <Link href="/documents" className="inline-flex items-center gap-1.5 text-[0.8667rem] font-medium text-ink-2 hover:text-ink a11y-tap">
        <ArrowLeft size={16} /> Zpět do trezoru
      </Link>

      <div className="mt-3 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sage-l text-sage">
          <Pill size={20} />
        </span>
        <div>
          <h1 className="font-serif text-[1.6rem] font-medium leading-tight text-ink">Seznam léků</h1>
          <p className="text-[0.8667rem] text-ink-2 a11y-dim">Pro {active.name} — vyplníte u nás, nemusíte nic skenovat.</p>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-sky-bd bg-sky-l px-4 py-3 text-[0.8667rem] text-sky">
        <Info size={16} className="mt-0.5 shrink-0" />
        Vypište léky, které senior pravidelně užívá. Najdete je na krabičkách nebo na receptu. Když si nejste jistí, vyplňte aspoň název — zbytek doplníme společně.
      </div>

      {/* Léky */}
      <div className="mt-5 space-y-4">
        {meds.map((m, i) => (
          <div key={m.id} className="rounded-xl2 border border-line bg-surface p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-[0.7333rem] font-semibold uppercase tracking-wider text-ink-3">Lék {i + 1}</span>
              <button
                onClick={() => remove(m.id)}
                aria-label="Odebrat lék"
                disabled={meds.length <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-3 hover:bg-peach-l hover:text-peach disabled:opacity-30"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="mt-2 grid gap-3 sm:grid-cols-[1fr,140px]">
              <div>
                <label className="field-label">Název léku</label>
                <input
                  className="field-input"
                  value={m.name}
                  onChange={(e) => update(m.id, { name: e.target.value })}
                  placeholder="např. Donepezil"
                />
              </div>
              <div>
                <label className="field-label">Dávka</label>
                <input
                  className="field-input"
                  value={m.dose}
                  onChange={(e) => update(m.id, { dose: e.target.value })}
                  placeholder="např. 5 mg"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="field-label">Kdy užívat</label>
              <div className="flex flex-wrap gap-2">
                {TIMES.map((t) => {
                  const on = m[t.key];
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => update(m.id, { [t.key]: !on } as Partial<Med>)}
                      aria-pressed={on}
                      className={`a11y-tap rounded-full border px-4 py-2 text-[0.8667rem] font-medium transition-colors ${
                        on ? "border-sage bg-sage-l text-sage-d" : "border-line-2 bg-surface text-ink-2 hover:border-ink-3"
                      }`}
                    >
                      {on && <Check size={14} className="mr-1 inline" />}
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-3">
              <label className="field-label">Poznámka (nepovinné)</label>
              <input
                className="field-input"
                value={m.note}
                onChange={(e) => update(m.id, { note: e.target.value })}
                placeholder="např. před jídlem"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={add}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl2 border border-dashed border-line-2 py-3.5 text-[0.9333rem] font-medium text-ink-2 hover:border-sage-bd hover:text-sage-d a11y-tap"
      >
        <Plus size={18} /> Přidat další lék
      </button>

      {/* Uložit */}
      <div className="sticky bottom-3 mt-6">
        <button
          onClick={save}
          disabled={saved}
          className="btn btn-primary w-full py-3.5 text-[1rem] a11y-tap"
        >
          {saved ? <><Check size={18} /> Uloženo</> : `Uložit do trezoru${filledCount ? ` (${filledCount})` : ""}`}
        </button>
      </div>
    </div>
  );
}
