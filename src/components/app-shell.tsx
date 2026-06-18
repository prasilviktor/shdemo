"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Search,
  FolderLock, MessagesSquare, Phone, LogOut, Bell,
  ChevronDown, Plus, Check, ClipboardList, UserCog, LifeBuoy,
  Menu, X, ClipboardCheck, ArrowRight,
} from "lucide-react";
import { Logo } from "./ui";
import { SeniorModeToggle } from "./senior-mode-toggle";
import { useAuth } from "@/lib/auth-context";
import { useSelection } from "@/lib/selection-context";
import { providers } from "@/data/providers";
import { useSenior } from "@/lib/senior-context";
import { PHONE_DISPLAY, PHONE_TEL, PHONE_HOURS } from "@/lib/contact";

/* Zeštíhlená navigace: 5 hlavních cílů + 2 sekundární.
   „Doporučená" žije jako výchozí pohled v Hledat, koordinátor v Zprávách a na Přehledu. */
const navPrimary = [
  { href: "/pece",     label: "Přehled",  icon: LayoutDashboard },
  { href: "/search",   label: "Najít péči", icon: Search },
  { href: "/zadosti",  label: "Žádosti",  icon: ClipboardList, badge: 2 },
  { href: "/messages", label: "Zprávy",   icon: MessagesSquare, badge: 2 },
  { href: "/pomoc",    label: "Pomoc",    icon: LifeBuoy },
];

const navSecondary = [
  { href: "/profil",    label: "Profil",    icon: UserCog },
  { href: "/documents", label: "Dokumenty", icon: FolderLock, badge: 2 },
];

const nav = [...navPrimary, ...navSecondary];

export function AppShell({
  children,
  title,
  greeting = true,
  contentClassName = "",
  wide = false,
}: {
  children: ReactNode;
  title: string;
  greeting?: boolean;
  contentClassName?: string;
  wide?: boolean;
}) {
  const { user, loading, signOut } = useAuth();
  const { seniors, active, activeId, setActiveId } = useSenior();
  const router = useRouter();
  const pathname = usePathname();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper text-ink-3">
        Načítám…
      </div>
    );
  }

  return (
    <>
      {/* ───────── Sidebar (desktop, fixed left) ───────── */}
      <aside className="fixed inset-y-0 left-0 hidden w-[240px] flex-col border-r border-line bg-surface md:flex">
        <div className="border-b border-line px-4 py-4">
          <Logo />
        </div>

        {/* O koho pečujete */}
        <div className="px-3 pt-3">
          <div className="text-[0.6667rem] font-semibold uppercase tracking-wider text-ink-3">
            O koho pečujete
          </div>
          <div className="relative mt-1.5">
            <button
              onClick={() => setPickerOpen((o) => !o)}
              className="flex w-full items-center gap-2.5 rounded-xl border border-line bg-paper px-3 py-2.5 text-left transition-colors hover:border-sage-bd"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-sage-bd bg-gradient-to-br from-[#c8e0d4] to-[#a0c8b8] text-[0.7333rem] font-semibold text-sage-d">
                {active.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.8667rem] font-medium text-ink">{active.name}</span>
                <span className="block truncate text-[0.7333rem] text-ink-3">{active.age} let · {active.location}</span>
              </span>
              <ChevronDown size={15} className={`shrink-0 text-ink-3 transition-transform ${pickerOpen ? "rotate-180" : ""}`} />
            </button>

            {pickerOpen && (
              <div className="absolute left-0 right-0 top-full z-40 mt-1.5 overflow-hidden rounded-xl border border-line bg-surface shadow-soft-lg">
                {seniors.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setActiveId(s.id); setPickerOpen(false); }}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-surface-2"
                  >
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.6667rem] font-semibold ${activeId === s.id ? "bg-sage text-white" : "bg-surface-2 text-ink-2"}`}>
                      {s.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.8667rem] font-medium text-ink">{s.name}</span>
                      <span className="block truncate text-[0.7333rem] text-ink-3">{s.careLabel}</span>
                    </span>
                    {activeId === s.id && <Check size={15} className="shrink-0 text-sage" />}
                  </button>
                ))}
                <button className="flex w-full items-center gap-2 border-t border-line px-3 py-2.5 text-left text-[0.8667rem] font-medium text-sage-d hover:bg-sage-l">
                  <Plus size={15} /> Přidat seniora
                </button>
              </div>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-1">
            {active.tags.slice(0, 3).map((t) => (
              <span key={t} className="rounded-full bg-surface-2 px-2 py-0.5 text-[0.6667rem] text-ink-2">{t}</span>
            ))}
          </div>
        </div>

        <nav className="mt-3 flex-1 overflow-y-auto px-2.5">
          {nav.map((n) => {
            const isActive = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`relative mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2 text-[0.8667rem] transition-colors a11y-tap ${
                  isActive ? "bg-sage-l font-medium text-sage-d" : "text-ink-2 hover:bg-surface-2"
                }`}
              >
                {isActive && <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-sage" />}
                <n.icon size={17} className={isActive ? "text-sage" : ""} />
                {n.label}
                {"badge" in n && n.badge && (
                  <span className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-peach px-1.5 text-[0.6667rem] font-semibold text-white">
                    {n.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2.5 border-t border-line p-3">
          <SeniorModeToggle />
          <div className="rounded-xl2 border border-peach-bd bg-peach-l p-3">
            <div className="text-[0.8rem] font-medium text-peach">Potřebujete poradit?</div>
            <a
              href={PHONE_TEL}
              className="mt-1.5 flex items-center gap-2 rounded-lg bg-peach px-3 py-2 text-[0.9333rem] font-semibold text-white a11y-tap"
            >
              <Phone size={15} /> {PHONE_DISPLAY}
            </a>
            <p className="mt-1.5 text-[0.7333rem] leading-snug text-peach/80">
              {PHONE_HOURS} · hovor je zdarma, koordinátorka pomůže s celým procesem.
            </p>
          </div>
          <div className="rounded-lg bg-surface-2 p-2.5">
            <div className="truncate text-[0.8rem] font-medium text-ink">{user.displayName}</div>
            <div className="truncate text-[0.7333rem] text-ink-3">{user.email}</div>
            <button
              onClick={() => { signOut(); router.push("/"); }}
              className="mt-2 flex items-center gap-1.5 text-[0.8rem] text-ink-2 hover:text-ink"
            >
              <LogOut size={13} /> Odhlásit se
            </button>
          </div>
        </div>
      </aside>

      {/* ───────── Header (fixed top) ───────── */}
      <header
        className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-4 border-b border-line bg-surface px-4 sm:px-7 md:left-[240px]"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="md:hidden"><Logo /></div>
        <div className="hidden text-[1rem] md:block">
          {greeting && <span className="text-ink-2">Dobrý den, {firstName(user.displayName)} — </span>}
          <span className="font-medium text-ink">{title}</span>
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          <a
            href={PHONE_TEL}
            aria-label={`Zavolat na ${PHONE_DISPLAY}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-sage-bd bg-sage-l text-sage-d md:hidden"
          >
            <Phone size={16} />
          </a>
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface-2 text-ink-2">
            <Bell size={16} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-peach" />
          </button>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-sage-bd bg-sage-l text-[0.8rem] font-semibold text-sage-d">
            {seniorInitials(user.displayName)}
          </span>
        </div>
      </header>

      {/* ───────── Main content ───────── */}
      {/*
        Padding top = header (56px) + safe-area-inset-top
        Padding bottom (mobile) = bottom nav (56px) + safe-area-inset-bottom
        Margin left (desktop) = sidebar (240px)
      */}
      <main
        className={`min-h-screen bg-paper md:ml-[240px] ${contentClassName}`}
        style={{
          paddingTop: "calc(56px + env(safe-area-inset-top, 0px))",
          paddingBottom: "calc(56px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {children}
      </main>

      {/* ───────── Lišta výběru k poptávce ───────── */}
      <SelectionBar />

      {/* ───────── Mobile bottom nav (fixed bottom) ───────── */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-surface md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {navPrimary.map((n) => {
          const isActive = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex flex-1 flex-col items-center gap-0.5 pt-2 pb-1.5 text-[0.6333rem] ${isActive ? "text-sage" : "text-ink-3"}`}
            >
              <div className="relative">
                <n.icon size={20} />
                {"badge" in n && n.badge && (
                  <span className="absolute -right-1.5 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-peach px-1 text-[0.5333rem] font-bold text-white">
                    {n.badge}
                  </span>
                )}
              </div>
              {n.label}
            </Link>
          );
        })}

        <button
          onClick={() => setHamburgerOpen((v) => !v)}
          className={`flex flex-1 flex-col items-center gap-0.5 pt-2 pb-1.5 text-[0.6333rem] ${hamburgerOpen ? "text-sage" : "text-ink-3"}`}
        >
          {hamburgerOpen ? <X size={20} /> : <Menu size={20} />}
          Více
        </button>
      </nav>

      {/* ───────── Hamburger drawer ───────── */}
      {hamburgerOpen && (
        <div
          className="fixed inset-x-0 z-20 md:hidden"
          style={{ bottom: "calc(56px + env(safe-area-inset-bottom, 0px))" }}
        >
          <div
            className="fixed inset-0"
            style={{ bottom: "calc(56px + env(safe-area-inset-bottom, 0px))" }}
            onClick={() => setHamburgerOpen(false)}
          />
          <div className="relative border-t border-line bg-surface shadow-soft-lg">
            <div className="px-3 py-2">
              {navSecondary.map((n) => {
                const isActive = pathname === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setHamburgerOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[0.9333rem] transition-colors ${
                      isActive ? "bg-sage-l font-medium text-sage-d" : "text-ink-2 hover:bg-surface-2"
                    }`}
                  >
                    <n.icon size={18} className={isActive ? "text-sage" : "text-ink-3"} />
                    {n.label}
                    {"badge" in n && n.badge && (
                      <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-peach px-1.5 text-[0.6667rem] font-semibold text-white">
                        {n.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function firstName(name: string) {
  return name?.split(" ")[0] || name || "";
}
function seniorInitials(name: string) {
  const parts = (name || "").trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (name || "?").slice(0, 2).toUpperCase();
}

/* ─── Výrazná lišta výběru zařízení k poptávce ─── */
function SelectionBar() {
  const { selected, count, clear } = useSelection();
  const router = useRouter();
  const pathname = usePathname();

  // Na samotné stránce poptávky lištu neukazujeme
  if (count === 0 || pathname === "/poptavka") return null;

  const chosen = providers.filter((p) => selected.includes(p.id));
  const names = chosen.map((p) => p.name).join(" · ");

  return (
    <div
      className="fixed inset-x-0 z-40 px-4 md:left-[240px] md:px-7"
      style={{ bottom: "calc(56px + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="mx-auto mb-3 flex max-w-3xl items-center gap-3 rounded-2xl bg-sage-d px-4 py-3 text-white shadow-soft-lg sm:px-5 sm:py-3.5 md:mb-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <ClipboardCheck size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[0.9667rem] font-semibold leading-tight">
            {count} {count === 1 ? "zařízení vybráno" : count < 5 ? "zařízení vybrána" : "zařízení vybráno"} k poptávce
          </div>
          <div className="truncate text-[0.7667rem] text-white/75">{names}</div>
        </div>
        <button
          onClick={clear}
          aria-label="Zrušit výběr"
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white/80 hover:bg-white/10 sm:flex"
        >
          <X size={18} />
        </button>
        <button
          onClick={() => router.push("/poptavka")}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-[0.9rem] font-semibold text-sage-d hover:bg-white/90 a11y-tap"
        >
          Poptat <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
