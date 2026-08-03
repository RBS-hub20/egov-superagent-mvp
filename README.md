<div align="center">

<img src="public/icon.png" alt="eGov SuperAgent" width="128" />

# eGov SuperAgent

### Super Agent. All Services.

**The Autonomous eGov OS for 115M Filipinos. Utusan mo lang.**

</div>

---

An MVP of an autonomous agent that handles Philippine e-government errands end to
end: it checks your SSS contributions, reads your PhilHealth membership, tracks a
PSA request to the pickup counter, keeps your IDs in a vault encrypted on your own
device, and hands you a receipt for every step so no fixer is ever needed.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Landing — hero, Why SuperAgent, services bento, Anti-Fixer Receipt (light/dark). **Launch SuperAgent** goes to `/intro` |
| `/intro` | Three auto-advancing slides with dots and Skip → Sign Up Free, Login, or straight to the console. Always white |
| `/app/signup`, `/app/login` | Phone or email, one-time code |
| `/product`, `/onboarding` | Legacy paths — redirect to `/` and `/intro` |
| `/app` | The console — same theme as the landing: sidebar, chat with generative UI, vault + receipt + memory rail |
| `/admin` | Owner console — eTravel queue, Bayad Center, PSA deliveries, logs, settings. Password-gated |
| `/admin/login` | Password entry for the console |
| `/verify/[id]` | Record check for an `EGOV-…` declaration — status for anyone holding the reference, the full record with its access key. noindex |
| `/api/etravel/orders` | `POST` files a declaration into the queue; `GET /[ref]` reads one back (status only without its access key) |
| `/api/admin/etravel` | The queue and the filing endpoint, both behind the admin cookie |
| `/api/webhook/messenger` | `POST` logs the payload and returns `{ ok: true }`; `GET` completes the `hub.challenge` handshake when `MESSENGER_VERIFY_TOKEN` matches |

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # production build
npm run typecheck            # tsc --noEmit
npm run lint                 # next lint
```

`npm install && npm run dev` is the whole setup: with no environment variables
the app runs against mock data and a device-local filing queue. Point it at a
Supabase project (see `.env.example`) and the eTravel queue becomes a real one —
apply `supabase/migrations` first.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Lucide.
Documents are encrypted with the Web Crypto API and stored in IndexedDB; PDFs are
generated client-side with jsPDF; the PSA pickup code uses `qrcode.react`.
Deliberately nothing else.

## Layout of the code

```
supabase/migrations/          the eTravel queue schema: table, RLS, change feed, storage bucket
mocks/                        sss.json, philhealth.json, psa.json, etravel.json — everything except eTravel
public/icon.png               the app icon — the only mark the UI loads (logo.png, logo-icon.png are copies)
public/apple-touch-icon.png   180px, opaque navy behind the rounded corners
public/og.png                 1200x630 social card, generated from the same tile
public/logos/                 favicon sizes + earlier kit exports (source/ holds the originals)
src/app/
  ├─ page.tsx                 landing
  ├─ intro/page.tsx           three-slide intro
  ├─ app/page.tsx             console
  ├─ api/webhook/messenger/   Messenger webhook
  ├─ layout.tsx               metadata, favicons, OG
  └─ robots.ts, sitemap.ts    generated from NEXT_PUBLIC_SITE_URL
src/components/
  ├─ admin/                   owner console: queue, filing modal, order tables, logs, settings
  ├─ cards/                   ETravelCard + the review → registered flow
  ├─ verify/                  record check screen
  ├─ intro/                   the three slides and their illustrations
  ├─ brand/                   AppIcon + BrandLockup — the icon, and the icon with the name beside it
  ├─ landing/                 nav, hero, why, services bento, trust receipt, footer, background FX
  ├─ theme/                   ThemeProvider + pill toggle (localStorage 'egov-theme')
  ├─ generative-ui/           SSSContributionsCard, PhilHealthCard, PSATrackerCard, card chrome, sketch map
  ├─ vault/                   VaultPreview — encrypt / list / decrypt / delete
  ├─ receipts/                AntiFixerReceipt
  └─ egov/                    app shell, sidebar, chat panel, composer, memory graph
src/lib/                      brand tokens, typed mock access, agent intents, vault crypto, PDF export
src/lib/user.ts               guest-by-default identity store (localStorage 'egov-user')
src/lib/intents.ts            eTravel intent + Taglish date/flight parsing
src/lib/etravel.ts            the six-agency checklist fixture + Manila date formatting
src/lib/etravel-orders.ts     the order store — Supabase through the routes, or this browser
src/lib/etravel-service.ts    server side: service-role client, redaction, signed URLs
src/lib/passport.ts           passport number kept in the encrypted vault, not localStorage
src/lib/etravel-pdf.ts        the declaration PDF, built client-side
src/lib/orders.ts             Bayad/PSA orders for the console
src/lib/admin-auth.ts         console password check + cookie token
src/middleware.ts             public-path allowlist + baseline security headers
```

## How the chat works

`src/lib/agent.ts` does Taglish-tolerant keyword routing — no model is involved.
Input matching `sss` renders `<SSSContributionsCard>`, `philhealth` renders
`<PhilHealthCard>`, and `psa`/`birth` renders `<PSATrackerCard>`, each with a
Taglish reply and follow-up chips. Unmatched input gets an honest "hindi ko pa
kaya 'yan" listing the four connected agencies.

Landing service tiles deep-link a first utos into the console:
`/app?q=check%20my%20sss%20contributions`.

## The mark

There is one brand asset: `public/icon.png`, the navy "SA" tile with its corners
cut to real transparency, so the same file sits on the white landing and on the
near-black console without a light or dark variant. `<AppIcon>` renders it;
`<BrandLockup>` renders it with "eGov SuperAgent" beside it as live text, which
means the name inherits the theme, stays selectable, and is never baked into
artwork. No surface prints the product name underneath the icon.

## Theming

The landing is **light by default** — the brand lockup was drawn for a light
surface — with a pill toggle in the header. The choice persists in
`localStorage` under `egov-theme` and is applied by a pre-paint inline script, so
a returning dark-mode visitor never sees a white flash.

The console at `/app` follows the same toggle, so walking from the landing into
the app never changes the furniture. Both surfaces read the same `lp-*` Tailwind
palette and CSS variables; `eg-*` classes carry only the console's structural
bits (solid panels, scrollbars, receipt glow) and inherit those same variables.

One deliberate exception: the generative-UI cards stay white in both themes.
Anything on a white document surface is an agency record you can download or
show at a counter — that meaning would be lost if it followed the theme.

## eTravel

Say it the way you would to a person — "im flying to singapore tomorrow at 3pm on
PR510, balik ako aug 5 6pm" — and `src/lib/intents.ts` pulls out the destination,
the flight, and both dates. Times are built at an explicit **+08:00**, so 3pm
means 3pm in Manila whatever timezone the browser is in. Anything it cannot read
comes back as null and the card says "not specified" instead of inventing a
flight.

The step summary reads **6 steps across 6 agencies** and each one names a body
that genuinely sits in a Philippine departure: PhilSys (identity), DFA (passport
validity), Bureau of Quarantine (health declaration), eTravel (the declaration),
Bureau of Immigration (departure record) and TIEZA (travel tax). The AXLA
receipt is issued too — it is listed under the steps rather than counted, since
AXLA is the builder, not an agency.

### The filing queue

The parsed trip opens a form — chat can also be skipped entirely by tapping
**Immigration** in the sidebar. Submitting it writes an order with a reference
of its own (`EGOV-YYYY-NNNN`) at status **PENDING**, and the chat says pending
filing by a VA rather than pretending anything reached an agency. The card in
chat, sidebar → **Logs**, and `/verify/<ref>` are three views of that one row.

From there:

| Status | What it means |
| --- | --- |
| `PENDING` | In the queue. Submitted to nobody. |
| `FILING` | An operator has it open on etravel.gov.ph right now. |
| `FILED` | The agency returned a reference and the operator recorded it. |

The status moves in the traveller's console without a refresh, and the agent
announces the filing in chat when it lands.

**With Supabase configured** the order is a row in Postgres, the owner console
picks it up over Realtime, and the agency's QR and PDF are uploaded to a private
bucket and handed back as short-lived signed URLs. **Without it** the same flow
runs against a device-local store — useful for a demo, but the queue is then
only what that one browser filed, and the console header says exactly that.

Filing still needs a person: an operator completes the form on etravel.gov.ph
and records what came back. Nothing in this app submits to the agency by itself.

## Owner console

`/admin` is where an operator turns a pending declaration into a filed one. The
eTravel queue lists the whole backlog and subscribes to changes; **File now**
opens the agency site, offers each traveller field with a copy button — the
passport number in full, since that is what has to be typed in — and takes back
the official reference, the QR screenshot, the agency PDF and any notes. Marking
it filed moves the row through **FILING** to **FILED**, tells the traveller in
chat, and updates `/verify`. The log records the attestation as one line:
*Operator attests filed on etravel.gov.ph at HH:MM*.

Access is gated server-side: the password is checked in an API route against
`ADMIN_PASSWORD` and the resulting cookie is httpOnly and carries a hash of that
password, so the console cannot be unlocked by editing localStorage. Middleware
redirects every `/admin` route to the login screen without a valid cookie.

**Set `ADMIN_PASSWORD` in the deployment.** The fallback in `src/lib/admin-auth.ts`
is a development default and is visible in this repository.

What the console records is an **operator attestation** — "I filed this on
etravel.gov.ph and the agency returned this reference." It is not a lookup
against the Bureau of Immigration, and `/verify` says so next to the filed
badge. No payment processor is connected; the Bayad Center's payment column is
demo data.

## First run and accounts

`/` is the landing and stays the landing — no visit is ever redirected away from
it. **Launch SuperAgent** opens `/intro`: three slides that advance on their own
every six seconds and stop the moment you swipe, tap a dot or use the arrow
keys. It is always white — it sits beside government apps on a first-time
visitor's phone. From there, Sign Up Free, Login, or **Skip** straight into the
console.

`/app` is reachable directly and always renders the console. Nothing gates it,
so nobody can be trapped behind an intro they have already seen.

Sign-up takes a phone number or email and a one-time code:

- **With Supabase configured** (`NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`), the code is sent and verified by Supabase.
  This path is wiring, not tested behaviour — no project is attached yet.
- **Without it (this build)**, a local mock accepts `123456`, says so on screen,
  and creates a profile in this browser. No account exists anywhere.

Either way the profile lands in the same `egov-user` store, so the console
greets a verified member instead of a guest.

## Identity

There is no account system, so identity lives in the browser and starts empty:
a fresh visitor is **Guest User — Connect PhilSys ID**. Nothing is claimed about
them, the memory graph is empty, and agency cards are labelled "Demo record"
rather than printing the sample citizen's name at somebody else's demo.

"Connect ID" asks for a name and optionally an ID document, which goes straight
into the encrypted vault. From then on the sidebar, the chat header, the memory
graph, the receipt audit trail, the agency cards and the generated PDFs all use
that name. Disconnecting returns everything to guest.

The name is typed, not read off the ID — there is no OCR in this build, and a
wrong guess from an image would be worse than asking.

## Vault

`src/lib/vault.ts` is real client-side encryption, not a stub:

- AES-GCM 256 via Web Crypto, fresh 12-byte IV per document.
- The master key is a **non-extractable** `CryptoKey` structured-cloned into
  IndexedDB — usable for decrypt, impossible to export.
- Ciphertext and IV live in IndexedDB; nothing is uploaded.
- Where IndexedDB is unavailable it falls back to localStorage, which requires an
  extractable key. That is weaker, so the UI says so instead of pretending
  otherwise.

Three demo documents are seeded on first load; "Add Doc" encrypts real files, and
clicking a row decrypts it back into a download.

## Deploying to Vercel

1. Import the repository at [vercel.com/new](https://vercel.com/new). Framework
   preset **Next.js** is detected; no build overrides are needed.
2. Environment variables — both optional:

   | Name | When you need it |
   | --- | --- |
   | `ADMIN_PASSWORD` | Always. Without it the owner console falls back to a default that is public in this repository. |
   | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | To make the eTravel queue and accounts real rather than device-local. Apply `supabase/migrations` to the project first. |
   | `NEXT_PUBLIC_SITE_URL` | Preview deployments, so canonical/OG/sitemap URLs point at the preview instead of the live domain. Production can leave it unset. |
   | `MESSENGER_VERIFY_TOKEN` | Only to complete the Messenger webhook handshake. |

3. Deploy. `vercel.json` pins functions to `sin1` (Singapore), the closest region
   to the Philippines.

### Domain: egovsuperagent.online

In **Project → Settings → Domains**, add `egovsuperagent.online` and
`www.egovsuperagent.online`, then set these records at your
domain registrar's DNS and let Vercel issue the certificate:

| Type | Name | Value |
| --- | --- | --- |
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

Vercel shows the exact target values on the Domains screen — use those if they
differ from the defaults above. Pick one host as primary (apex is the
conventional choice here) and let Vercel redirect the other. Once the domain
resolves, `robots.txt`, `sitemap.xml` and every OG URL follow it automatically
through `SITE_URL`.

## Licensing

Built by **AXLA SOFTWARE DEVELOPMENT SERVICES**. The attribution appears in the
landing footer, the console sidebar, the Anti-Fixer Receipt, and as
`<meta name="author">`.

## Scope

SSS, PhilHealth, Pag-IBIG and PSA are mock data from `/mocks` — there is no
integration with any of them, no Viber channel, and no blockchain. Messenger is
plumbed but not handled.

eTravel is the exception and the only real pipeline here: a declaration is a
durable record that an operator works and attests to. Even so, no software in
this repository submits anything to the Bureau of Immigration — a person does
that on etravel.gov.ph, and every surface distinguishes their attestation from
an agency lookup. This build is not affiliated with any Philippine government
agency.
