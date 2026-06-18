# SENIOR HOUSE

Care coordination platform — Next.js (App Router) + React + TypeScript + Tailwind + Framer Motion + lucide-react.

Web běží hned, **bez Firebase**, v demo režimu (mock auth + localStorage). Po doplnění Firebase configu se ostrá vrstva aktivuje sama.

## Spuštění

```bash
npm install
npm run dev
# http://localhost:3000
```

`npm run build` ověří produkční build.

## Stránky

| Cesta | Co dělá |
|---|---|
| `/` | Investor landing page (problém, platforma, trh, model, proč teď, vize) |
| `/login` | Přihlášení / registrace, volba role (rodina / poskytovatel) |
| `/dashboard` | Přehled rodiny — postup profilu, rychlé akce, doporučení |
| `/profile` | Univerzální profil péče — 5krokový průvodce, ukládá průběžně |
| `/search` | Vyhledávání — sidebar filtry, karty výsledků, detail modal |
| `/documents` | Trezor dokumentů — nahrání, kategorie, sdílení s poskytovateli |
| `/messages` | Rodinný hub — vlákna a konverzace |
| `/finance` | Finanční koordinace — etická rozvaha zdrojů + kalkulačka doplatku |

Stránky `/dashboard`, `/profile`, `/documents`, `/messages`, `/finance` jsou za přihlášením (guard v `AppShell`).

## Napojení Firebase

1. Vytvoř projekt na <https://console.firebase.google.com>.
2. Zapni **Authentication → Email/Password**.
3. Vytvoř **Firestore** databázi a **Storage** bucket.
4. Zkopíruj `.env.local.example` → `.env.local` a vyplň hodnoty z Project settings.
5. V kódu najdi bloky `// === FIREBASE ===` a odkomentuj je (smaž odpovídající `--- MOCK ---` blok):
   - `src/lib/auth-context.tsx` — přihlášení, registrace, odhlášení, sledování stavu
   - `src/lib/firestore.ts` — načtení/uložení profilu, nahrávání dokumentů
6. Hotovo. `isFirebaseConfigured` v `src/lib/firebase.ts` přepne appku z mocku na ostrou vrstvu automaticky podle vyplněného `.env.local`.

### Doporučená Firestore struktura

```
users/{uid}                      → { email, displayName, role }
users/{uid}/careProfile/main     → CareProfile
users/{uid}/documents/{docId}    → metadata dokumentu + downloadURL
users/{uid}/threads/{threadId}   → vlákno + zprávy
providers/{providerId}           → Provider
```

Soubory trezoru patří do Storage: `vault/{uid}/{docId}/{filename}` (do Firestore jen metadata).

Mock data poskytovatelů: `src/data/providers.ts` — po napojení nahraď dotazem na kolekci `providers`.

## Design

Tokeny v `tailwind.config.ts`: warm whites, charcoal text, stone/warm-grey, accent sage green + soft terracotta (žádná nemocniční modrá). Písma Fraunces (nadpisy) + Plus Jakarta Sans (text). Base 17px, velké cíle, WCAG-friendly kontrast, navigace max 2 úrovně — dle accessibility požadavků pro seniory.
