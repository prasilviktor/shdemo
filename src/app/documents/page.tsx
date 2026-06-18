"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Upload, Lock, Share2, Trash2, RefreshCw, CheckCircle2, Circle,
  CircleDashed, Pencil, FileText, MoreHorizontal, X, ArrowRight,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { mockDocuments, providers } from "@/data/providers";
import type { CareDocument } from "@/lib/types";
import { InfoTip } from "@/components/ui";

export default function DocumentsPage() {
  return (
    <AppShell title="Dokumenty">
      <DocumentsInner />
    </AppShell>
  );
}

/* Systémové popisky kategorií — pro třídění a sdílení, v UI se nezobrazují. */
const categoryLabel: Record<CareDocument["category"], string> = {
  medical: "Zdravotní",
  legal: "Právní",
  financial: "Finanční",
  social: "Sociální",
};

function DocumentsInner() {
  const [docs, setDocs] = useState<CareDocument[]>(mockDocuments);
  const [shareFor, setShareFor] = useState<CareDocument | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<CareDocument | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadTargetId = useRef<string | null>(null);

  const isDone = (d: CareDocument) => d.status === "verified" || d.status === "pending";

  // Pořadí: nejdřív chybějící povinné, pak hotové, pak chybějící nepovinné
  const sorted = [...docs].sort((a, b) => {
    const rank = (d: CareDocument) =>
      d.status === "missing" && d.required ? 0 : isDone(d) ? 1 : 2;
    return rank(a) - rank(b);
  });

  const missingRequired = docs.filter((d) => d.status === "missing" && d.required);
  const firstMissing = missingRequired[0] ?? null;

  function triggerUpload(id: string) {
    uploadTargetId.current = id;
    fileRef.current?.click();
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const id = uploadTargetId.current;
    setDocs((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "verified",
              uploadedAt: Date.now(),
              sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
            }
          : d
      )
    );
    uploadTargetId.current = null;
    if (fileRef.current) fileRef.current.value = "";
    setMenuFor(null);
  }

  function deleteDoc(d: CareDocument) {
    // U povinných/řádků checklistu nemažeme řádek, jen vrátíme do stavu "chybí"
    setDocs((prev) =>
      prev.map((x) =>
        x.id === d.id
          ? { ...x, status: "missing", uploadedAt: 0, sizeLabel: "—", sharedWith: [] }
          : x
      )
    );
    setDeleteConfirm(null);
    setMenuFor(null);
  }

  function dateLabel(ts: number) {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString("cs", { day: "numeric", month: "numeric", year: "numeric" });
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-6 sm:px-7">
      {/* Hlavička */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-[1.7333rem] font-medium text-ink">Trezor dokumentů</h1>
          <p className="mt-1 text-[0.9333rem] text-ink-2 a11y-dim">
            Nahrajte jednou, sdílejte se zařízeními na pár kliknutí.
          </p>
        </div>
        <input ref={fileRef} type="file" className="hidden" onChange={onUpload} />
      </div>

      {/* Jeden další krok */}
      {firstMissing ? (
        <div className="mt-5 flex items-start gap-3 rounded-xl2 border border-amber-bd bg-amber-l px-4 py-3.5">
          <CircleDashed size={22} className="mt-0.5 shrink-0 text-amber" />
          <div className="min-w-0 flex-1">
            <p className="text-[1rem] font-semibold text-amber">
              {missingRequired.length === 1
                ? "Zbývá doložit 1 dokument"
                : `Zbývá doložit ${missingRequired.length} dokumenty`}
            </p>
            <p className="mt-0.5 text-[0.8667rem] text-amber/90">
              {firstMissing.name}
              {firstMissing.hint ? ` — ${firstMissing.hint}` : ""}
            </p>
          </div>
          <PrimaryRowAction doc={firstMissing} onUpload={() => triggerUpload(firstMissing.id)} amber />
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-3 rounded-xl2 border border-sage-bd bg-sage-l px-4 py-3.5">
          <CheckCircle2 size={22} className="shrink-0 text-sage" />
          <p className="text-[0.9333rem] font-medium text-sage-d">
            Všechny povinné dokumenty máte doložené.
          </p>
        </div>
      )}

      {/* Jeden seznam — stav řídí každý řádek */}
      <div className="mt-5 overflow-hidden rounded-xl2 border border-line bg-surface">
        {sorted.map((d, i) => (
          <DocRow
            key={d.id}
            d={d}
            first={i === 0}
            done={isDone(d)}
            dateLabel={dateLabel}
            menuOpen={menuFor === d.id}
            onMenu={() => setMenuFor((m) => (m === d.id ? null : d.id))}
            onShare={() => { setShareFor(d); setMenuFor(null); }}
            onUpload={() => triggerUpload(d.id)}
            onDelete={() => { setDeleteConfirm(d); setMenuFor(null); }}
          />
        ))}
      </div>

      {/* GDPR pruh */}
      <div className="mt-5 flex items-center gap-2.5 rounded-xl2 border border-sage-bd bg-sage-l px-4 py-3 text-[0.8667rem] text-sage-d">
        <Lock size={16} className="shrink-0" />
        Všechny dokumenty jsou šifrované a sdílí se jen s vaším výslovným souhlasem. Splňujeme GDPR.
        <InfoTip label="Sdílení dokumentů" text="Vy rozhodujete, které zařízení uvidí který dokument. Souhlas lze kdykoli odvolat a sdílení zrušit." />
      </div>

      {/* Potvrzení smazání */}
      {deleteConfirm && (
        <Modal onClose={() => setDeleteConfirm(null)} title="Odebrat dokument?">
          <p className="mt-1.5 text-[0.8667rem] text-ink-2 a11y-dim">
            „{deleteConfirm.name}" bude odebráno a přestane se sdílet se zařízeními. Můžete ho kdykoli nahrát znovu.
          </p>
          <div className="mt-5 flex gap-2">
            <button onClick={() => setDeleteConfirm(null)} className="btn btn-ghost flex-1 a11y-tap">Zrušit</button>
            <button onClick={() => deleteDoc(deleteConfirm)} className="btn flex-1 bg-peach text-white hover:opacity-90 a11y-tap">
              <Trash2 size={15} /> Odebrat
            </button>
          </div>
        </Modal>
      )}

      {/* Sdílení */}
      {shareFor && (
        <Modal onClose={() => setShareFor(null)} title="Sdílet dokument">
          <p className="mt-1 text-[0.8667rem] text-ink-2 a11y-dim">
            „{shareFor.name}" — vyberte zařízení, kterému dokument zpřístupníte.
          </p>
          <div className="mt-4 space-y-2">
            {providers.slice(0, 4).map((p) => (
              <label key={p.id} className="flex items-center gap-3 rounded-xl border border-line px-3.5 py-3 text-[0.9333rem] a11y-tap">
                <input type="checkbox" defaultChecked={shareFor.sharedWith.includes(p.id)} className="h-5 w-5 accent-sage" />
                <span className="font-medium text-ink">{p.name}</span>
              </label>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <button onClick={() => setShareFor(null)} className="btn btn-ghost flex-1 a11y-tap">Zrušit</button>
            <button onClick={() => setShareFor(null)} className="btn btn-primary flex-1 a11y-tap">Uložit sdílení</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── Řádek dokumentu ─── */
function DocRow({
  d, first, done, dateLabel, menuOpen, onMenu, onShare, onUpload, onDelete,
}: {
  d: CareDocument; first: boolean; done: boolean;
  dateLabel: (ts: number) => string;
  menuOpen: boolean; onMenu: () => void;
  onShare: () => void; onUpload: () => void; onDelete: () => void;
}) {
  const missingRequired = d.status === "missing" && d.required;

  // Ikona stavu
  const StatusIcon = done ? CheckCircle2 : missingRequired ? CircleDashed : Circle;
  const statusColor = done
    ? "text-sage"
    : missingRequired
    ? "text-amber"
    : "text-line-2";

  // Druhý řádek (meta)
  let meta: string;
  if (done) {
    meta = d.source === "generated"
      ? "Vytvořeno z vašich odpovědí · můžete upravit"
      : `Nahráno ${dateLabel(d.uploadedAt)}${d.status === "verified" ? " · ověřeno" : " · čeká na ověření"}`;
  } else {
    meta = d.hint ?? (d.required ? "Povinné" : "Nepovinné");
  }

  return (
    <div
      className={`relative flex items-center gap-3.5 px-4 py-4 sm:px-5 ${first ? "" : "border-t border-line"} ${missingRequired ? "bg-amber-l/40" : ""}`}
    >
      <StatusIcon size={26} className={`shrink-0 ${statusColor}`} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className={`text-[1rem] font-medium ${done ? "text-ink" : missingRequired ? "text-ink" : "text-ink-2"}`}>
            {d.name}
          </span>
          {missingRequired && (
            <span className="rounded-md border border-amber-bd bg-amber-l px-1.5 py-0.5 text-[0.6667rem] font-semibold text-amber">
              Povinné
            </span>
          )}
          {!d.required && !done && (
            <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[0.6667rem] font-semibold text-ink-3">
              Nepovinné
            </span>
          )}
        </div>
        <p className={`mt-0.5 text-[0.8rem] ${missingRequired ? "text-amber/90" : "text-ink-3 a11y-dim"}`}>{meta}</p>
      </div>

      {/* Akce */}
      {done ? (
        <div className="flex shrink-0 items-center gap-1.5">
          {d.source === "generated" && d.fillHref ? (
            <Link href={d.fillHref} className="btn btn-ghost a11y-tap text-[0.8667rem]">
              <Pencil size={15} /> Upravit
            </Link>
          ) : (
            <button onClick={onShare} className="btn btn-ghost a11y-tap text-[0.8667rem]">
              <Share2 size={15} /> Sdílet
            </button>
          )}
          <button
            onClick={onMenu}
            aria-label="Další možnosti"
            aria-expanded={menuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-line-2 text-ink-2 hover:bg-surface-2"
          >
            <MoreHorizontal size={18} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={onMenu} />
              <div className="absolute right-4 top-[60px] z-40 w-52 overflow-hidden rounded-xl border border-line bg-surface shadow-soft-lg">
                {d.source === "generated" ? (
                  <button onClick={onShare} className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-[0.9333rem] text-ink-2 hover:bg-surface-2">
                    <Share2 size={16} /> Sdílet
                  </button>
                ) : (
                  <button onClick={onUpload} className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-[0.9333rem] text-ink-2 hover:bg-surface-2">
                    <RefreshCw size={16} /> Nahrát novou verzi
                  </button>
                )}
                <button onClick={onDelete} className="flex w-full items-center gap-2.5 border-t border-line px-4 py-3 text-left text-[0.9333rem] text-peach hover:bg-peach-l">
                  <Trash2 size={16} /> Odebrat
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <PrimaryRowAction doc={d} onUpload={onUpload} amber={missingRequired} />
      )}
    </div>
  );
}

/* Primární akce pro nepořízený dokument — Nahrát / Vyplnit u nás. */
function PrimaryRowAction({ doc, onUpload, amber = false }: { doc: CareDocument; onUpload: () => void; amber?: boolean }) {
  const amberCls = amber ? "border-amber-bd text-amber hover:bg-amber-l" : "";

  if ((doc.source === "fill" || doc.source === "generated") && doc.fillHref) {
    return (
      <Link href={doc.fillHref} className={`btn btn-ghost shrink-0 a11y-tap whitespace-nowrap text-[0.8667rem] ${amberCls}`}>
        <Pencil size={15} /> Vyplnit u nás
      </Link>
    );
  }
  return (
    <button onClick={onUpload} className={`btn btn-ghost shrink-0 a11y-tap whitespace-nowrap text-[0.8667rem] ${amberCls}`}>
      <Upload size={15} /> Nahrát
    </button>
  );
}

/* ─── Jednoduchý modal ─── */
function Modal({ children, title, onClose }: { children: React.ReactNode; title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-surface p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-[1.2rem] font-medium text-ink">{title}</h3>
          <button onClick={onClose} aria-label="Zavřít" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-3 hover:bg-surface-2">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
