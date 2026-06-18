"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Users, Plus, Trash2, Info } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useSenior } from "@/lib/senior-context";

type Contact = {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email: string;
  primary: boolean;
};

function emptyContact(primary = false): Contact {
  return { id: "c" + Date.now() + Math.random().toString(36).slice(2, 6), name: "", relation: "", phone: "", email: "", primary };
}

export default function KontaktyPage() {
  return (
    <AppShell title="Kontaktní list">
      <Inner />
    </AppShell>
  );
}

function Inner() {
  const router = useRouter();
  const { active } = useSenior();

  const seed = active.contacts.manager;
  const [contacts, setContacts] = useState<Contact[]>([
    { ...emptyContact(true), name: seed.name, relation: seed.relation, phone: seed.phone, email: seed.email },
    emptyContact(),
  ]);
  const [saved, setSaved] = useState(false);

  function update(id: string, patch: Partial<Contact>) {
    setContacts((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }
  function setPrimary(id: string) {
    setContacts((list) => list.map((c) => ({ ...c, primary: c.id === id })));
  }
  function remove(id: string) {
    setContacts((list) => (list.length > 1 ? list.filter((c) => c.id !== id) : list));
  }
  function add() {
    setContacts((list) => [...list, emptyContact()]);
  }
  function save() {
    setSaved(true);
    setTimeout(() => router.push("/documents"), 900);
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-6 sm:px-7">
      <Link href="/documents" className="inline-flex items-center gap-1.5 text-[0.8667rem] font-medium text-ink-2 hover:text-ink a11y-tap">
        <ArrowLeft size={16} /> Zpět do trezoru
      </Link>

      <div className="mt-3 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sage-l text-sage">
          <Users size={20} />
        </span>
        <div>
          <h1 className="font-serif text-[1.6rem] font-medium leading-tight text-ink">Kontaktní list</h1>
          <p className="text-[0.8667rem] text-ink-2 a11y-dim">Pro {active.name} — koho má zařízení kontaktovat.</p>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-sky-bd bg-sky-l px-4 py-3 text-[0.8667rem] text-sky">
        <Info size={16} className="mt-0.5 shrink-0" />
        Uveďte osoby, které má zařízení kontaktovat. Hlavní kontakt dostává všechny zprávy jako první.
      </div>

      <div className="mt-5 space-y-4">
        {contacts.map((c, i) => (
          <div key={c.id} className="rounded-xl2 border border-line bg-surface p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPrimary(c.id)}
                aria-pressed={c.primary}
                className={`a11y-tap rounded-full border px-3 py-1.5 text-[0.8rem] font-medium transition-colors ${
                  c.primary ? "border-sage bg-sage-l text-sage-d" : "border-line-2 text-ink-2 hover:border-ink-3"
                }`}
              >
                {c.primary ? <><Check size={13} className="mr-1 inline" /> Hlavní kontakt</> : "Označit jako hlavní"}
              </button>
              <button
                onClick={() => remove(c.id)}
                aria-label="Odebrat kontakt"
                disabled={contacts.length <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-3 hover:bg-peach-l hover:text-peach disabled:opacity-30"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="field-label">Jméno</label>
                <input className="field-input" value={c.name} onChange={(e) => update(c.id, { name: e.target.value })} placeholder="Jméno a příjmení" />
              </div>
              <div>
                <label className="field-label">Vztah k seniorovi</label>
                <input className="field-input" value={c.relation} onChange={(e) => update(c.id, { relation: e.target.value })} placeholder="např. dcera, syn" />
              </div>
              <div>
                <label className="field-label">Telefon</label>
                <input className="field-input" inputMode="tel" value={c.phone} onChange={(e) => update(c.id, { phone: e.target.value })} placeholder="+420" />
              </div>
              <div>
                <label className="field-label">E-mail (nepovinné)</label>
                <input className="field-input" inputMode="email" value={c.email} onChange={(e) => update(c.id, { email: e.target.value })} placeholder="vas@email.cz" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={add}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl2 border border-dashed border-line-2 py-3.5 text-[0.9333rem] font-medium text-ink-2 hover:border-sage-bd hover:text-sage-d a11y-tap"
      >
        <Plus size={18} /> Přidat další kontakt
      </button>

      <div className="sticky bottom-3 mt-6">
        <button onClick={save} disabled={saved} className="btn btn-primary w-full py-3.5 text-[1rem] a11y-tap">
          {saved ? <><Check size={18} /> Uloženo</> : "Uložit do trezoru"}
        </button>
      </div>
    </div>
  );
}
