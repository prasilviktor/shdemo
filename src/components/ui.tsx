"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Info, ArrowLeft, Star } from "lucide-react";

/** Konzistentní odkaz „zpět" pro vnitřní stránky (průvodci, formuláře). */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="a11y-tap mb-5 inline-flex items-center gap-1.5 text-[0.8667rem] font-medium text-ink-2 hover:text-ink"
    >
      <ArrowLeft size={15} /> {label}
    </Link>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 ${className}`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage text-[0.7333rem] font-bold tracking-wide text-white">
        SH
      </span>
      <span className="font-serif text-[1rem] font-semibold tracking-tight text-ink">
        SENIOR<span className="text-sage"> HOUSE</span>
      </span>
    </Link>
  );
}

/**
 * Info ikonka s vysvětlením. Hover (desktop) i klik (mobil/dotyk) otevře bublinu.
 * Používá se u odborných pojmů (příspěvek na péči, stupeň závislosti, doplatek…).
 */
export function InfoTip({ text, label }: { text: string; label?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <span ref={ref} className="relative inline-flex align-middle">
      <button
        type="button"
        aria-label={label ? `Vysvětlení: ${label}` : "Vysvětlení"}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="ml-1 inline-flex h-[18px] w-[18px] items-center justify-center rounded-full border border-line-2 text-ink-3 transition-colors hover:border-sage hover:text-sage"
      >
        <Info size={11} strokeWidth={2.4} />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 z-50 mb-2 w-60 -translate-x-1/2 rounded-xl border border-line bg-white px-3.5 py-2.5 text-[0.8667rem] font-normal leading-relaxed text-ink-2 shadow-soft-lg"
        >
          {label && (
            <span className="mb-1 block font-semibold text-ink">{label}</span>
          )}
          {text}
          <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-line bg-white" />
        </span>
      )}
    </span>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[0.8667rem] text-ink-2">
      <Star size={14} className="fill-amber text-amber" />
      <span className="font-semibold text-ink">{rating.toFixed(1)}</span>
    </span>
  );
}

/**
 * Klidná SVG ilustrace domu (místo stock fotek) — odstín řízený `hue`.
 * Vychází z mood souborů: nebe, dům, střecha, okna, slunce.
 */
export function ProviderVisual({
  hue,
  className = "",
  variant = "main",
}: {
  hue: number;
  className?: string;
  variant?: "main" | "thumb";
}) {
  const sky = `hsl(${hue}, 30%, 90%)`;
  const ground = `hsl(${hue}, 26%, 78%)`;
  const roof = `hsl(${hue}, 32%, 42%)`;
  const accent = `hsl(${(hue + 20) % 360}, 38%, 60%)`;
  const win = `hsl(${hue}, 30%, 70%)`;

  if (variant === "thumb") {
    return (
      <div className={`overflow-hidden ${className}`} aria-hidden>
        <svg viewBox="0 0 80 60" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
          <rect width="80" height="60" fill={sky} />
          <ellipse cx="40" cy="40" rx="30" ry="10" fill="white" opacity="0.7" />
          <rect x="26" y="22" width="28" height="22" rx="3" fill="white" opacity="0.9" />
          <polygon points="22,24 40,10 58,24" fill={roof} opacity="0.55" />
          <rect x="32" y="28" width="7" height="7" rx="1" fill={win} opacity="0.5" />
          <rect x="42" y="28" width="7" height="7" rx="1" fill={win} opacity="0.5" />
          <circle cx="66" cy="14" r="7" fill={accent} opacity="0.25" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden>
      <svg viewBox="0 0 480 200" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <rect width="480" height="200" fill={sky} />
        <rect y="148" width="480" height="52" fill={ground} opacity="0.4" />
        <ellipse cx="72" cy="46" rx="34" ry="13" fill="white" opacity="0.55" />
        <ellipse cx="92" cy="40" rx="24" ry="12" fill="white" opacity="0.48" />
        <ellipse cx="380" cy="34" rx="28" ry="10" fill="white" opacity="0.42" />
        <circle cx="430" cy="38" r="26" fill={accent} opacity="0.18" />
        <circle cx="430" cy="38" r="16" fill={accent} opacity="0.24" />
        <rect x="100" y="78" width="280" height="90" rx="5" fill="white" opacity="0.92" />
        <polygon points="85,80 240,32 395,80" fill={roof} opacity="0.55" />
        <rect x="290" y="42" width="12" height="26" rx="2" fill={roof} opacity="0.4" />
        {[138, 196, 256, 316].map((x) => (
          <g key={x}>
            <rect x={x} y="94" width="30" height="24" rx="3" fill={win} opacity="0.35" />
            <line x1={x + 15} y1="94" x2={x + 15} y2="118" stroke="white" strokeWidth="1.2" opacity="0.6" />
            <line x1={x} y1="106" x2={x + 30} y2="106" stroke="white" strokeWidth="1.2" opacity="0.6" />
          </g>
        ))}
        <rect x="225" y="130" width="30" height="38" rx="3" fill={roof} opacity="0.4" />
        <circle cx="248" cy="150" r="2" fill="white" opacity="0.8" />
      </svg>
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${shown ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
