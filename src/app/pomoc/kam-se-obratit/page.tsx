"use client";

import Link from "next/link";
import { Phone, Globe, Mail, MapPin, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { BackLink } from "@/components/ui";
import { useSenior } from "@/lib/senior-context";

/* ─── Neziskové organizace a linky pomoci ─── */
const ORGS = [
  {
    name: "ŽIVOT 90 — Senior telefon",
    desc: "Bezplatná krizová linka a sociální poradenství pro seniory a pečující.",
    phone: "800 157 157",
    web: "zivot90.cz",
    email: "info@zivot90.cz",
    free: true,
  },
  {
    name: "Linka seniorů (Elpida)",
    desc: "Anonymní bezplatná telefonická krizová pomoc pro seniory a pečující, nonstop.",
    phone: "800 200 007",
    web: "elpida.cz",
    free: true,
  },
  {
    name: "Česká alzheimerovská společnost",
    desc: "Poradenství, svépomocné skupiny a respitní péče pro rodiny pečující o člověka s demencí.",
    phone: "283 880 346",
    web: "alzheimer.cz",
    email: "info@alzheimer.cz",
  },
  {
    name: "Národní rada osob se zdravotním postižením",
    desc: "Bezplatné sociálně-právní poradenství, pomoc s dávkami a příspěvky.",
    phone: "266 753 421",
    web: "nrzp.cz",
  },
  {
    name: "Česká gerontologická a geriatrická společnost",
    desc: "Odborné informace o péči o seniory a seznam geriatrických pracovišť.",
    web: "cggs.cz",
  },
];

/* ─── Státní a obecní instituce ─── */
const STATE_ORGS = [
  {
    name: "Ministerstvo práce a sociálních věcí",
    desc: "Sociální dávky, příspěvek na péči, registr poskytovatelů sociálních služeb.",
    web: "mpsv.cz",
    note: "Celostátní",
  },
  {
    name: "Úřad práce ČR",
    desc: "Žádosti o příspěvek na péči, dávky pro osoby se zdravotním postižením.",
    web: "uradprace.cz",
    note: "Pobočka ve vašem okrese",
  },
  {
    name: "Sociální odbor obecního / městského úřadu",
    desc: "Sociální pracovník v místě bydliště — žádosti o sociální služby, domácí péče, pečovatelská služba.",
    note: "Kontakt závisí na vaší obci",
  },
  {
    name: "Krajský úřad — odbor sociálních věcí",
    desc: "Registrace a kontrola poskytovatelů sociálních služeb, podněty a stížnosti.",
    note: "Kontakt závisí na vašem kraji",
  },
];

function OrgCard({ name, desc, phone, web, email, free, note }: {
  name: string; desc: string; phone?: string; web?: string; email?: string; free?: boolean; note?: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-[0.9333rem] font-medium leading-snug text-ink">{name}</h4>
        {free && (
          <span className="shrink-0 rounded-full bg-sage-l px-2 py-0.5 text-[0.7333rem] font-medium text-sage-d">Zdarma</span>
        )}
      </div>
      <p className="mt-1 text-[0.8667rem] leading-relaxed text-ink-2 a11y-dim">{desc}</p>
      {note && (
        <p className="mt-1.5 flex items-center gap-1 text-[0.8rem] text-ink-3">
          <MapPin size={12} /> {note}
        </p>
      )}
      {(phone || web || email) && (
        <div className="mt-3 space-y-1.5 border-t border-line pt-3 text-[0.8667rem]">
          {phone && <div className="flex items-center gap-2 text-ink"><Phone size={13} className="text-sage" /> <span className="font-medium">{phone}</span></div>}
          {web && <div className="flex items-center gap-2 text-ink-2"><Globe size={13} className="text-sage" /> {web}</div>}
          {email && <div className="flex items-center gap-2 text-ink-2"><Mail size={13} className="text-sage" /> {email}</div>}
        </div>
      )}
    </div>
  );
}

export default function KamSeObratitPage() {
  const { seniors, activeId } = useSenior();
  const active = seniors.find((s) => s.id === activeId);
  const location = active?.location;

  return (
    <AppShell title="Kam se mohu obrátit" greeting={false}>
      <div className="mx-auto max-w-3xl px-5 py-6 sm:px-7">
        <BackLink href="/pomoc" label="Pomoc a podpora" />

        <h1 className="font-serif text-[1.7333rem] font-medium text-ink">Kam se mohu obrátit</h1>
        <p className="mt-1 text-[0.9333rem] text-ink-2 a11y-dim">
          Nezávislé organizace a státní instituce, které vám mohou pomoci — bez vazby na SENIOR HOUSE.
        </p>

        {/* Neziskové organizace */}
        <h2 className="mt-7 text-[0.8667rem] font-semibold uppercase tracking-wider text-ink-3">Neziskové organizace a linky pomoci</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {ORGS.map((o) => (
            <OrgCard key={o.name} {...o} />
          ))}
        </div>

        {/* Státní instituce */}
        <h2 className="mt-8 text-[0.8667rem] font-semibold uppercase tracking-wider text-ink-3">Státní a obecní instituce</h2>

        {location ? (
          <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-sage-bd bg-sage-l/50 px-4 py-3">
            <MapPin size={16} className="shrink-0 text-sage-d" />
            <p className="text-[0.8667rem] text-sage-d">
              Vaše lokalita: <strong>{location}</strong>. Pro přesné kontakty vyhledejte příslušný úřad nebo sociální odbor pro tuto obec.
            </p>
          </div>
        ) : (
          <div className="mt-3 flex items-start gap-3 rounded-xl border border-line bg-surface-2 px-4 py-3">
            <MapPin size={16} className="mt-0.5 shrink-0 text-ink-3" />
            <div>
              <p className="text-[0.8667rem] text-ink-2">
                Vyplňte lokalitu v profilu klienta a zobrazíme vám, kde přesně hledat pomoc ve vašem místě.
              </p>
              <Link href="/profil" className="mt-2 inline-flex items-center gap-1 text-[0.8667rem] font-medium text-sage-d hover:underline">
                Doplnit lokalitu <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        )}

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {STATE_ORGS.map((o) => (
            <OrgCard key={o.name} {...o} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
