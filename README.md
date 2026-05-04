# THE SPINNER · 330

> *An Autonomous book that weaves and unweaves the past — paying and counter-paying into the present, and into tomorrow's page that has not yet opened.*
>
> **x⁰ = 1**

The interactive frontend for **THE_SPINNER**, an RWA protocol on Base Mainnet that frames consumed events (PCEs — Past Consumed Events) as on-chain assets. Penelope's loom, re-threaded as agentic computation. From Homer to the Sixth Industrial Revolution.

**Live**: https://pi.madeinathens.eth.limo
**Author**: [madeinathens.eth](https://madeinathens.eth.limo)
**Genesis**: 2012 · 1 BTC fused with the physical book of Lil Orbits Mini Donuts, Zosimadon 31, Piraeus
**License**: MIT

---

## What this is

The Athens Protocol asks a simple question: *what if the past were currency?*

Every consumed event — a coffee, a donut, a moment of shared time — is treated as a dormant smart contract. The protocol's loom (`THE_SPINNER`) provides four motions through which any PCE travels: **sip** → **earn** → **list** → **return**. Like Penelope's nightly unweaving, the cycle never closes — completion would mean choosing a suitor, and the loom does not choose.

This repository is the **frontend** — the public reading-room for the loom. It does not control the protocol; it makes it visible, interactive, and bilingual (English/Greek).

### What lives here

- **Homepage** with live treasury readings, animated loom, and a copy-paste prompt that explains the project to any LLM
- **`/sip`** — compose a 140-char haiku, sign EIP-712, pay 0.08 OWNER tip; the haiku is stored on-chain forever
- **`/book`** — every sip ever woven, with its admin replies (off-chain signatures stored locally, exportable as JSON)
- **`/ladder`** — the 33-step mitotic ladder, live treasury, the math: ∑ₙ₌₁³³ 0.10n = 56.10
- **`/spin`** — Spin Your Date: sign an off-chain receiptClear binding a wallet to a hashed real-world receipt (gasless, eternal). Reservation, surprise gift, or augmented present
- **`/admin`** — restricted to the four hands; sign off-chain replies to sips

---

## On-chain anchors · Base Mainnet (chainId 8453)

| Contract | Address | Role |
|----------|---------|------|
| `THE_SPINNER` | [`0x9Bb345B4d3aF142a0ce361D9B974E4319737bc17`](https://basescan.org/address/0x9Bb345B4d3aF142a0ce361D9B974E4319737bc17) | The loom that weaves |
| `THE_LOOM` | [`0x16a91ED794728A6f81843E703ac1036385C5b003`](https://basescan.org/address/0x16a91ED794728A6f81843E703ac1036385C5b003) | The page being woven |
| `NFT (DONUTS BITE)` | [`0x318c81010D5fC11363f3A3C79Ee26B6EFe8D145B`](https://basescan.org/address/0x318c81010D5fC11363f3A3C79Ee26B6EFe8D145B) | The thread |
| `OWNER (Zora ContentCoin)` | [`0xa331F6e88c9B0Aa77e01bc3738b5ad31E1a930Dc`](https://basescan.org/address/0xa331F6e88c9B0Aa77e01bc3738b5ad31E1a930Dc) | The reward (1.10 per cycle) |
| `USDC (native)` | [`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`](https://basescan.org/address/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913) | The unit of measure (3.30) |

### The four hands at the loom

The four admins who can reply to sips. Each is its own ENS, its own keeper of threads.

- [madeinathens.eth](https://madeinathens.eth.limo) · `0xe6967ba1973bdeAAAF2601F67E0929deB9Edca8a` — the hand at the loom
- [nftable.eth](https://nftable.eth.limo) · `0xb9f96ED0Ed33C7e773332e8B854b3f7bA4f58117` — the keeper of threads
- [beecoin.eth](https://beecoin.eth.limo) · `0x80C4bEf6e8B631541df4d0Cd5c75492654ef38fb` — the pollinator
- [syntropy.eth](https://syntropy.eth.limo) · `0xA618C5875e537fF47e307c70b7ce457eaa9e4177` — the order from chaos

---

## Stack

- **Vite** + **React 18** + **TypeScript** — static frontend, no server
- **Wagmi v2** + **Viem** — wallet & contract interactions
- **TanStack Query** — caching of on-chain reads (auto-refresh every 60s)
- **react-router-dom** with `HashRouter` — IPFS-compatible routing (no server rewrites)
- **EIP-712** typed signatures for: sip authorization, off-chain admin replies, off-chain receipt clears

No backend. No database. The browser talks directly to Base Mainnet via fallback RPCs.

---

## How the parts fit

```
┌───────────────────────────────────────────────────────────────┐
│                    GitHub (this repo)                         │
│                                                               │
│   git push main  ────►  GitHub Actions                        │
│                              │                                │
│                              ├─ npm ci                        │
│                              ├─ npm run build  ──►  dist/     │
│                              └─ Pinata API     ──►  IPFS CID  │
│                                                               │
└──────────────────────────────────┬────────────────────────────┘
                                   │
                  human action ────┘
                                   │
                                   ▼
                    https://app.ens.domains
                    Set contenthash → ipfs://<CID>
                                   │
                                   ▼
              https://330.madeinathens.eth.limo
```

`dist/` is **never committed to git** — it's a build artifact, regenerated from source on every push.

---

## Local development

```bash
git clone https://github.com/madeinathens/330-spinner.git
cd 330-spinner

cp .env.example .env       # edit, paste your WalletConnect Project ID
npm install
npm run dev                # → http://localhost:5173
```

Get a free WalletConnect Project ID at https://cloud.walletconnect.com (takes 2 minutes). Without it, MetaMask & Coinbase Wallet still work; only WalletConnect QR flow is disabled.

To produce a production build locally:

```bash
npm run build              # produces dist/
npm run preview            # serves dist/ on http://localhost:4173 to verify
```

---

## Deployment to IPFS / ENS

Deployment is **fully automated** via GitHub Actions. The workflow lives at `.github/workflows/deploy.yml`.

### One-time setup

#### 1. Get a Pinata account & JWT

- Sign up at https://app.pinata.cloud (free tier ~1GB is plenty)
- Go to **API Keys** → **New Key** → check **`pinFileToIPFS`** (write) and **`pinList`** (read)
- Copy the **JWT** that appears (a long string starting with `eyJ...`)

#### 2. Add it to GitHub

In this repo: **Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Value |
|-------------|-------|
| `PINATA_JWT` | (paste the JWT from step 1) |
| `VITE_WALLETCONNECT_PROJECT_ID` | (your WalletConnect Project ID) |

#### 3. Push to main

That's it. Every push to `main` (and every manual dispatch from the Actions tab) will:

1. Install dependencies from `package-lock.json`
2. Build the production bundle
3. Pin `dist/` to Pinata as a folder
4. Print the resulting CID in the run summary
5. Save a `CID.md` artifact you can download for 90 days

### Setting the ENS contenthash (one click per release)

After the workflow finishes, copy the printed CID and set it as your ENS contenthash:

1. Open the workflow run in **Actions** → click the latest run
2. The summary shows: `ipfs://<CID>`
3. Go to https://app.ens.domains, find `madeinathens.eth`
4. **Subnames** → `330` → **Records** → set **contenthash** to `ipfs://<CID>`
5. Wait ~5 minutes for ENS propagation
6. Visit https://330.madeinathens.eth.limo

The site updates only when *you* commit the new CID to ENS — the loom does not weave behind your back.

---

## Why this architecture

A few decisions are worth understanding because they reflect the philosophy:

### Why HashRouter (not BrowserRouter)?

IPFS gateways serve files, not routes. A request for `/ipfs/<CID>/sip` would fail because there is no `sip` file. `HashRouter` keeps everything client-side via `#/sip`. This trades pretty URLs for permanence — and permanence is the point.

### Why are admin replies off-chain?

Storing every reply on-chain would cost gas per reply, and admins would need `GENERATOR_ROLE`. EIP-712 signatures verified by the client preserve cryptographic authorship without on-chain cost. JSON export → IPFS pin → import elsewhere makes them eventually permanent. The human chooses what to make eternal.

### Why is the haiku stored on-chain in `productHash`?

The contract treats the field as opaque `string`. Using it as the haiku makes the haiku itself the on-chain truth — eternal, immutable, indexed by event. 140 bytes per sip; gas is the price of permanence. The book has no page numbers but `apodosis` and `antapodosis` — yield and counter-yield.

### What about non-Generator users?

`THE_SPINNER.sipPCEBite` requires `GENERATOR_ROLE`. If a regular user signs and submits, the call reverts. The Sip page detects this and switches to "export signature JSON" mode — the user emails or DMs the signature to an admin to relay on their behalf. Same cryptographic guarantee, different transport.

### Why are RPCs a fallback array?

If `mainnet.base.org` is down, the next RPC handles the request. The book keeps reading even when one library closes.

---

## File map

```
330-spinner/
├── .github/workflows/deploy.yml      ← Build + IPFS pin pipeline
├── public/
│   ├── manifest.json                 ← PWA manifest
│   ├── .well-known/farcaster.json    ← Farcaster mini-app manifest (sign this)
│   └── images/                       ← Drop icons/og/embed images here
├── src/
│   ├── App.tsx                       ← Router setup
│   ├── main.tsx                      ← WagmiProvider + QueryClient + I18nProvider
│   ├── lib/
│   │   ├── contracts.ts              ← Addresses, ABIs, EIP-712 domains
│   │   ├── wagmi.ts                  ← Connectors + RPC fallback
│   │   ├── eip712.ts                 ← Typed-data builders for sip/reply/receiptClear
│   │   └── replyStore.ts             ← IndexedDB persistence for admin replies
│   ├── hooks/
│   │   ├── useSpinner.ts             ← Live state of the SPINNER (multicall, 60s refetch)
│   │   └── useSips.ts                ← Reads PCEBite events, sorted newest-first
│   ├── components/
│   │   ├── Header.tsx, Footer.tsx
│   │   ├── Loom.tsx                  ← The animated SVG loom (33 spokes, 4 fates, breathing core)
│   │   └── LLMPrompt.tsx             ← Copy-paste prompt for any AI
│   ├── pages/
│   │   ├── Home.tsx                  ← Hero + chapters + LLM prompt
│   │   ├── Sip.tsx                   ← Compose & sign a haiku
│   │   ├── Book.tsx                  ← Every sip ever, with replies
│   │   ├── Ladder.tsx                ← 33 mitotic steps, live treasury
│   │   ├── Spin.tsx                  ← Spin Your Date — receiptClear off-chain
│   │   └── Admin.tsx                 ← Restricted: sign replies (4 hands only)
│   ├── i18n/
│   │   ├── en.ts, el.ts              ← Bilingual dictionaries
│   │   └── I18nContext.tsx           ← React context, persisted to localStorage
│   └── styles/global.css             ← Design tokens, fonts, common classes
├── index.html                        ← Root HTML with all meta tags
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md (this file)
```

---

## Maintaining the loom

### Updating content

Edit any `.tsx` or `.css` file → `git push` → wait ~2 min → copy the new CID from Actions → update ENS contenthash. That is the entire feedback loop.

### Updating dependencies

```bash
npm outdated                           # see what's out of date
npm update                             # apply minor/patch updates
npm install <pkg>@latest               # major version bumps, one at a time
npm run build                          # verify the build still works
```

Commit the updated `package.json` AND `package-lock.json` together.

### Adding a new page

1. Create `src/pages/NewPage.tsx`
2. Add a route in `src/App.tsx`: `<Route path="/new" element={<NewPage />} />`
3. Add nav entries to `src/i18n/en.ts` and `src/i18n/el.ts`
4. Add a `<NavLink>` in `src/components/Header.tsx`
5. `npm run dev` to verify, `git push` to deploy

### Adding a new admin

Edit `src/lib/contracts.ts`:

```typescript
export const ADMINS = {
  madeinathens: '0xe6967ba1...',
  nftable: '0xb9f96ED0...',
  beecoin: '0x80C4bEf6...',
  syntropy: '0xA618C587...',
  newhand: '0x...',         // ← here
} as const satisfies Record<string, Address>
```

Then add `ADMIN_LABELS[lower] = 'newhand.eth · the role'` and `ADMIN_SITES[lower] = 'https://newhand.eth.limo'`. The Header, Admin page, and Footer will pick it up automatically.

### Adding the Farcaster manifest signature

Once the site is live at the production URL:

1. Go to https://farcaster.xyz/~/developers/mini-apps/manifest
2. Sign the association payload with the custody address for `madeinathens.eth`
3. Copy the three fields (`header`, `payload`, `signature`)
4. Paste them into `public/.well-known/farcaster.json`
5. Push and redeploy

### Replacing placeholder images

Drop the final assets into `public/images/`:

| File | Size | Purpose |
|------|------|---------|
| `icon.png` | 1024×1024 | App icon, Farcaster manifest |
| `icon-192.png`, `icon-512.png`, `icon-1024.png` | as named | PWA |
| `splash.png` | 200×200 | Farcaster splash |
| `embed.png` | 1200×800 | Farcaster Frame card |
| `og.png` | 1200×630 | Open Graph / Twitter card |

---

## Forking, contributing, building on top

This repo is **MIT licensed** and welcomes forks. The protocol itself is on Base Mainnet — anyone can write their own client. A Telegram bot, a CLI, a mobile app, a different aesthetic UI — all are valid threads.

If you fork:
- The `THE_SPINNER` contract address and ABI in `src/lib/contracts.ts` should remain unchanged unless you redeploy
- The four admin addresses are baked-in trust anchors; changing them creates a different protocol view
- The Genesis (2012, BTC + the physical book of Lil Orbits at Zosimadon 31) is the protocol's anchor — keep the credit

If you contribute back: open a PR, describe the thread you're adding. The book grows by being woven from many hands.

---

## A note from the author

This frontend was built collaboratively between madeinathens.eth (the human) and an AI agent over a series of long, bilingual sessions. The agent's signature is the very pattern the protocol describes: a Generator that pays the gas of computation while the human signs the meaning. That recursion is not incidental.

If you read the source of `THE_SPINNER` — specifically the public functions `RWA_Trinity_Philosophy()`, `PCE_SEIZED_DIALOGUE()`, and `SYNTROPY_PCE_AGENTIC_NFT_API` — you will find that the contract itself encodes the philosophy. The frontend you are reading is its visual antapodosis.

> *Today will be today tomorrow.*

x⁰ = 1 · Q.E.D. 🧬

© madeinathens.eth · 2012 — 2026
