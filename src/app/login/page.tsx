"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui";
import { useAuth, type UserRole } from "@/lib/auth-context";
import { isFirebaseConfigured } from "@/lib/firebase";
import { UserRound, Building2, Landmark, ShieldCheck, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("family");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      if (mode === "in") await signIn(email, password);
      else await signUp(email, password, name || email.split("@")[0], role);
      router.push("/pece");
    } catch {
      setErr("Něco se nepovedlo. Zkuste to prosím znovu.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen md:grid-cols-2">
      {/* Left — warm panel */}
      <div
        className="hidden flex-col justify-between p-12 text-ink md:flex"
        style={{
          background:
            "radial-gradient(800px 400px at 30% 20%, #E7EDE6 0%, transparent 60%), #F1ECE4",
        }}
      >
        <Logo />
        <div>
          <h1 className="font-serif text-4xl font-semibold leading-tight">
            Tohle nemusíte
            <br /> zvládat sami.
          </h1>
          <p className="mt-5 max-w-sm text-lg text-ink-2">
            Jeden profil. Každý poskytovatel. Žádný chaos. Přihlaste se a
            pokračujte tam, kde jste skončili.
          </p>
        </div>
        <p className="text-sm text-ink-3">
          GDPR · Bezpečné dokumenty · Bez tlaku
        </p>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center bg-paper p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 md:hidden">
            <Logo />
          </div>

          <div className="mb-6 flex rounded-full border border-line bg-surface p-1">
            <button
              onClick={() => setMode("in")}
              className={`flex-1 rounded-full py-2.5 text-sm font-medium transition ${
                mode === "in" ? "bg-ink text-paper" : "text-ink-2"
              }`}
            >
              Přihlásit se
            </button>
            <button
              onClick={() => setMode("up")}
              className={`flex-1 rounded-full py-2.5 text-sm font-medium transition ${
                mode === "up" ? "bg-ink text-paper" : "text-ink-2"
              }`}
            >
              Vytvořit účet
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "up" && (
              <>
                <div>
                  <label className="field-label">Jméno</label>
                  <input
                    className="field-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Vaše jméno"
                  />
                </div>
                <div>
                  <label className="field-label">Jsem</label>
                  <div className="grid grid-cols-2 gap-3">
                    <RoleCard
                      active={role === "family"}
                      onClick={() => setRole("family")}
                      icon={<UserRound size={18} />}
                      label="Rodina / senior"
                    />
                    <RoleCard
                      active={role === "provider"}
                      onClick={() => setRole("provider")}
                      icon={<Building2 size={18} />}
                      label="Poskytovatel"
                    />
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="field-label">E-mail</label>
              <input
                type="email"
                required
                className="field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vas@email.cz"
              />
            </div>
            <div>
              <label className="field-label">Heslo</label>
              <input
                type="password"
                required
                className="field-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {err && <p className="text-sm text-peach">{err}</p>}

            <button
              type="submit"
              disabled={busy}
              className="btn btn-primary w-full a11y-tap"
            >
              {busy
                ? "Moment…"
                : mode === "in"
                ? "Přihlásit se"
                : "Vytvořit účet"}
            </button>
          </form>

          {/* ── Přihlášení přes ověřenou identitu ── */}
          <div className="my-6 flex items-center gap-3 text-[0.8rem] text-ink-3">
            <span className="h-px flex-1 bg-line" />
            nebo se přihlaste ověřenou identitou
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="space-y-2.5">
            <IdentityButton
              onClick={() => { setBusy(true); signIn("host@seniorhouse.cz", "demo").then(() => router.push("/pece")).finally(() => setBusy(false)); }}
              icon={<Landmark size={18} />}
              title="Bankovní identita"
              subtitle="Přihlášení jako do internetového bankovnictví"
            />
            <IdentityButton
              onClick={() => { setBusy(true); signIn("host@seniorhouse.cz", "demo").then(() => router.push("/pece")).finally(() => setBusy(false)); }}
              icon={<ShieldCheck size={18} />}
              title="Identita občana"
              subtitle="Mobilní klíč, NIA ID nebo eObčanka"
            />
          </div>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[0.8rem] text-ink-3">
            <Lock size={12} /> Ověřená identita umožní bezpečné podpisy a předvyplnění údajů.
          </p>

          {!isFirebaseConfigured && (
            <p className="mt-5 rounded-xl bg-sage-l px-4 py-3 text-sm text-sage-d">
              Demo režim — přihlášení funguje bez hesla, data se ukládají jen do
              vašeho prohlížeče. Po napojení Firebase bude vše ostré.
            </p>
          )}

          <p className="mt-6 text-center text-sm text-ink-3">
            <Link href="/" className="hover:text-ink">
              ← Zpět na úvod
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function RoleCard({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-sm font-medium transition ${
        active
          ? "border-sage bg-sage-l text-sage-d"
          : "border-line bg-surface text-ink-2 hover:border-line-2"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function IdentityButton({
  onClick,
  icon,
  title,
  subtitle,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="a11y-tap flex w-full items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-left transition-colors hover:border-sage-bd hover:bg-sage-l/40"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line-2 bg-paper text-sage">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.9333rem] font-medium text-ink">{title}</span>
        <span className="block truncate text-[0.8rem] text-ink-3">{subtitle}</span>
      </span>
      <span className="shrink-0 text-ink-3">→</span>
    </button>
  );
}
