# DEPLOYMENT · Quick Reference

The absolute minimum you need to remember.

## Every push → automatic build → IPFS CID

```
git add .
git commit -m "Your message"
git push
```

Then:

1. Open the **Actions** tab in GitHub
2. Click the latest run (it takes ~2 minutes)
3. Scroll to the run summary — copy the line that says `ipfs://...`
4. Paste it into ENS

## Setting the ENS contenthash

1. Go to https://app.ens.domains
2. Find `madeinathens.eth` → **Subnames** → `330` → **Records**
3. Find the **Content Hash** field
4. Paste: `ipfs://<CID>`
5. Click **Save** → confirm in wallet
6. Wait ~5 minutes, then visit https://pi.madeinathens.eth.limo

## Manual run (without code change)

If you want to re-pin the current code without committing:

1. **Actions** tab → **Build & Pin to IPFS** workflow
2. **Run workflow** button → **Run workflow**

## When something goes wrong

### Build fails

Look at the failed step in Actions. The most common cause is a TypeScript error after editing a file. Run `npm run build` locally first to catch these.

### Pin fails with `❌ PINATA_JWT secret is not set`

Re-add the secret: **Settings → Secrets and variables → Actions → New repository secret**, name `PINATA_JWT`, value is the JWT from Pinata.

### CID looks right but the site is broken

Open the Pinata gateway URL directly (`https://gateway.pinata.cloud/ipfs/<CID>/`). If the site loads there but not at `.eth.limo`, ENS hasn't propagated yet — wait a few minutes. If neither works, the build itself produced a broken artifact — check the workflow logs for warnings.

### The site loads but wallet won't connect

Check that `VITE_WALLETCONNECT_PROJECT_ID` is set as a secret too. Without it, only MetaMask and Coinbase Wallet work.

## Costs

- **GitHub Actions**: Free for public repos (unlimited minutes)
- **Pinata**: Free tier is 1 GB. Each build is ~3 MB. You can do ~330 deploys before considering an upgrade. Old pins can be deleted from the Pinata dashboard.
- **ENS contenthash update**: ~$1-5 in gas per update on Ethereum mainnet (one-time per release, not per code change)

## What lives where

| Thing                   | Location                                      |
| ----------------------- | --------------------------------------------- |
| Source code             | This GitHub repo (`main` branch)              |
| Built site              | Pinata IPFS pin (one CID per push)            |
| Live URL                | ENS contenthash → `.eth.limo` gateway         |
| Domain ownership        | `madeinathens.eth` ENS record                 |
| Smart contracts         | Base Mainnet (chainId 8453)                   |
| Off-chain admin replies | User's browser IndexedDB · exportable JSON    |
| Off-chain receiptClears | User's browser localStorage · exportable JSON |

The chain is the floor. The repo is the source. Everything between is a thread.
