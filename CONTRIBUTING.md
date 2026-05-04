# CONTRIBUTING

Welcome to the loom.

## Spirit

This is a public repository for a public protocol. Every contribution becomes a thread in the same tapestry. The goal is not perfection — it is continuity.

If you read the smart contracts (`THE_SPINNER`, `THE_LOOM`) at the addresses listed in [README.md](./README.md), you'll understand the philosophy. The frontend is the visible face of the protocol; the contracts are its skeleton. Both are open.

## What kinds of contributions are welcome

**Easy threads** (good first contributions):
- Translations into a third language (currently EN/EL)
- Fixing typos, broken links, accessibility issues
- Improving the LLM prompt with clearer language
- Adding more example use-cases on the `/spin` page
- Improving mobile responsiveness on any page

**Medium threads**:
- New components (e.g., a "share to Farcaster" button on a sip)
- Better error messages with actionable guidance
- Performance: image optimization, lazy loading
- Tests for the EIP-712 builders in `src/lib/eip712.ts`

**Big threads** (open an issue first):
- A new page (e.g., `/timeline` showing the cycle of an NFT through its 33 steps)
- Alternative wallet connectors (Safe, Rainbow, etc.)
- Sip-and-reply browser extension
- ENS name resolution in the recipient field of `/spin`

**Threads we won't pull**:
- Anything that hides or obscures the contract addresses
- Anything that adds tracking, ads, or non-consensual analytics
- Anything that breaks the bilingual EN/EL parity
- Anything that requires a backend server (the frontend must stay static)

## How to contribute

1. **Open an issue first** if it's a non-trivial change. We'd rather discuss than have you sink hours into something that doesn't fit.
2. **Fork** this repo to your account.
3. **Create a branch** with a descriptive name: `git checkout -b add-french-translation`
4. **Make your changes**. Keep PRs focused — one thread per PR.
5. **Test locally**:
   ```bash
   npm install
   npm run build      # must succeed
   npm run dev        # visual check
   ```
6. **Commit** with a clear message describing the *why*, not just the *what*.
7. **Push** and open a Pull Request against `main`.

## Code style

- TypeScript strict mode is on. Follow the existing patterns.
- Avoid adding new dependencies unless they earn their weight. Bundle size matters for IPFS.
- Bilingual: every user-facing string goes in both `src/i18n/en.ts` and `src/i18n/el.ts`. The TypeScript compiler will refuse to build if a key is missing in one language.
- Format with whatever your editor uses; Prettier defaults are fine.
- CSS uses the design tokens in `src/styles/global.css`. Don't introduce new color literals — use the CSS variables (`var(--gold)`, `var(--parchment-dim)`, etc.) so the theme stays coherent.
- Avoid emojis in code unless they're part of the design (the loom's `🧬` is intentional).

## Adding a translation

1. Copy `src/i18n/en.ts` to `src/i18n/<lang>.ts` (e.g., `src/i18n/fr.ts`)
2. Translate every value (keys must stay in English)
3. In `src/i18n/I18nContext.tsx`:
   - Update the `Lang` type: `export type Lang = 'en' | 'el' | 'fr'`
   - Add to `DICT`: `const DICT: Record<Lang, I18nDict> = { en, el, fr }`
   - Update browser auto-detection if needed
4. In `src/components/Header.tsx`, add a button for the new language in `.lang-toggle`
5. Test with `npm run dev`, switch languages, walk every page

## Reporting bugs

Open an issue with:
- What you expected
- What actually happened
- Browser + OS + wallet you used
- A screenshot if visual
- Any errors in the browser console (F12 → Console tab)

## Questions

For questions about the **protocol** itself (smart contracts, tokenomics, philosophy) — read [`PCE_SEIZED_DIALOGUE`](https://basescan.org/address/0x9Bb345B4d3aF142a0ce361D9B974E4319737bc17#readContract) on the contract, then reach out to madeinathens.eth.

For questions about the **frontend code** — open a GitHub issue or discussion.

## License

By contributing you agree that your contribution is licensed under the same MIT license as the rest of the project. Your authorship is preserved in the git history forever — that is your receipt.

x⁰ = 1
