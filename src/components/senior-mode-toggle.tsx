"use client";

import { Eye } from "lucide-react";
import { useA11y } from "@/lib/a11y-context";

/**
 * Přepínač režimu pro seniory — zvětší písmo, kontrast a velikost cílů
 * v celé aplikaci. Volba se ukládá (a11y-context).
 */
export function SeniorModeToggle({ compact = false }: { compact?: boolean }) {
  const { senior, toggle } = useA11y();

  if (compact) {
    return (
      <button
        onClick={toggle}
        aria-pressed={senior}
        title="Větší písmo pro lepší čitelnost"
        className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[0.8667rem] font-medium transition-colors ${
          senior
            ? "border-sage bg-sage-l text-sage-d"
            : "border-line-2 text-ink-2 hover:bg-surface-2"
        }`}
      >
        <Eye size={15} />
        {senior ? "Zvětšeno" : "Větší písmo"}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={senior}
      className="flex w-full items-center justify-between rounded-xl border border-line bg-surface px-3.5 py-3 text-left transition-colors hover:border-sage-bd"
    >
      <span className="flex items-center gap-2.5">
        <Eye size={17} className={senior ? "text-sage" : "text-ink-2"} />
        <span>
          <span className="block text-[0.8667rem] font-medium text-ink">
            Větší písmo a kontrast
          </span>
          <span className="block text-[0.7333rem] text-ink-3">
            Pro pohodlnější čtení
          </span>
        </span>
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          senior ? "bg-sage" : "bg-line-2"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            senior ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}
