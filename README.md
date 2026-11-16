# FixProof

FixProof is a demonstration of a Sri Lankan B2B2C trust platform for pre-owned smartphones. Participating repair centres and dealers publish a masked repair and inspection passport. Buyers scan a QR code and read that record for free.

FixProof does not sell phones. A published passport is a **FixProof Verified Record** of information submitted by a partner. It is not a government, TRCSL or manufacturer certification, it is not proof of ownership, and it does not guarantee safety or future performance.

All seeded devices, partners and evidence are fictional.

## Stack

- Next.js App Router and TypeScript
- Tailwind CSS
- React Hook Form and Zod
- Recharts
- qrcode.react and html5-qrcode
- A local data service with deterministic seed data and `localStorage` persistence

The data functions in `lib/domain` return new state objects. A later API or database can replace `lib/data/store.tsx` without rewriting the screens.

## Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional environment values are listed in `.env.example`. None are required. Do not put secrets in source code. The prototype has no payment, email, SMS or cloud-storage integration.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local site |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm test` | Unit tests |

## Demo login

There is no password. On **Sign In**, choose a role. The banner says demo mode because this is not real authentication.

| Role | Workspace | Sample organisation |
| --- | --- | --- |
| Repair-centre demo | `/repair` | ABC Mobile Care |
| Dealer demo | `/dealer` | LankaPhone Exchange |
| Admin demo | `/admin` | Platform |

## Useful routes

- `/` public marketing site
- `/how-it-works`
- `/pricing`
- `/scan`
- `/passport/FP-DEMO-2026-0001` fictional public passport
- `/repair/passports/new` create and publish a passport
- `/dealer` inventory, passport links and sample scans
- `/admin/corrections` approve or reject a concern
- `/admin/audit` hash-chain log
- `/about`, `/privacy`, `/terms`, `/limitations`, `/contact`, `/partner-application`

Partner demo requests and buyer concerns are stored in this browser only.

## Data model

Typed records live in `types/index.ts`: users, organisations, partner applications, passports, inspections, repair events, evidence, QR labels, correction requests, audit events, dealer inventory, subscription plans and public scans.

Important passport and audit fields include `id`, `createdAt`, `updatedAt`, `status`, `organisationId`, `passportId`, `visibility`, `evidenceCount`, `recordHash`, `previousHash` and `createdBy`.

Seed data is built once in `lib/data/seed.ts`. It does not change on refresh. Actions you take are layered on top in `localStorage` under `fixproof.demo-state.v1`. **Reset demo data** on the admin partners screen clears that overlay.

## Record protection in this prototype

Each important passport action is appended. The event hash is SHA-256 of a canonical JSON body that includes the previous event hash. Public pages show a short hash prefix.

This is not a blockchain and it is not a legal tamper-proof guarantee. Production use would need independent security testing, secure key management and a formal compliance review.

## Privacy limitations

- Public pages show the last four digits only.
- Owner identity is not collected.
- Do not enter a real full IMEI, real customer identity or payment details.
- Uploaded evidence stays in the browser as a local preview.
- Demo accounts do not have passwords.

## Production-readiness limitations

This is a pilot prototype:

- Authentication is a role picker.
- Data lives in the browser, not a server database.
- Hashes are computed on the client and can be cleared with site data.
- There is no payment gateway, email delivery, SMS or object storage.
- Prices are planning assumptions in Sri Lankan Rupees.
- Pilot figures on the marketing site are targets, not measured results.

## Suggested next integrations

- Partner authentication with organisation membership
- A server database and private object storage for evidence
- Independent review of the audit design and key management
- TRCSL, consumer-protection and privacy-counsel review before any public claim about compliance
- The planned enterprise reporting API, currently marked as a future package

## Pilot context

The story is a six-week Western Province pilot: 3 repair centres, 2 dealers, 100 passports, an 80% buyer scan target, a correction target below 5%, and at least 3 paying continuations. Those are planning targets.

Proposed operating base: 10/16, 3rd Lane, Eksath Mawatha, Mahara, Kadawatha, Western 11850, Sri Lanka.
