"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { Logo } from "./ui";
import { useAuth } from "@/lib/auth-context";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/contact";

const NAV_LINKS = [
  { href: "#pribeh", label: "Jak vám pomůžeme" },
  { href: "#jak-to-funguje", label: "Jak to funguje" },
  { href: "#podpora", label: "Koordinátor a poradna" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Zavři menu při resize na desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Zamkni scroll při otevřeném menu
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function closeAndScroll(href: string) {
    setMobileOpen(false);
    // Krátká prodleva, aby se menu stihlo zavřít před scrollem
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 150);
  }

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || mobileOpen
            ? "border-b border-line/60 bg-paper/95 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <div className="sh-container flex h-[72px] items-center justify-between">
          <Logo />

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-ink-2 hover:text-ink">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={PHONE_TEL}
              className="hidden items-center gap-1.5 text-[0.9333rem] font-semibold text-sage-d hover:text-sage lg:flex"
            >
              <Phone size={15} /> {PHONE_DISPLAY}
            </a>
            <Link
              href={user ? "/dashboard" : "/login"}
              className="hidden text-sm font-medium text-ink hover:text-sage sm:block"
            >
              {user ? "Můj přehled" : "Přihlásit se"}
            </Link>
            <Link href="/zacit" className="btn btn-primary px-5 py-2.5 text-sm">
              Začít →
            </Link>

            {/* Hamburger — jen na mobilu */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-ink-2 transition-colors hover:bg-surface-2 md:hidden"
              aria-label={mobileOpen ? "Zavřít menu" : "Otevřít menu"}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="absolute inset-x-0 top-[72px] bg-paper/98 backdrop-blur-xl border-b border-line shadow-soft-lg">
            <div className="sh-container py-4">
              <nav className="flex flex-col">
                {NAV_LINKS.map((l, i) => (
                  <button
                    key={l.href}
                    onClick={() => closeAndScroll(l.href)}
                    className={`flex w-full items-center py-3.5 text-left text-[1rem] font-medium text-ink-2 hover:text-ink transition-colors ${
                      i < NAV_LINKS.length - 1 ? "border-b border-line/60" : ""
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-2 pb-2">
                <a
                  href={PHONE_TEL}
                  className="btn w-full justify-center gap-2 border border-sage-bd bg-sage-l text-[1rem] font-semibold text-sage-d"
                >
                  <Phone size={17} /> Zavolejte nám: {PHONE_DISPLAY}
                </a>
                <Link
                  href={user ? "/dashboard" : "/login"}
                  onClick={() => setMobileOpen(false)}
                  className="btn btn-ghost w-full justify-center text-[1rem]"
                >
                  {user ? "Můj přehled" : "Přihlásit se"}
                </Link>
                <Link
                  href="/zacit"
                  onClick={() => setMobileOpen(false)}
                  className="btn btn-primary w-full justify-center text-[1rem]"
                >
                  Začít →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
