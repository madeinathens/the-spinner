/**
 * Wagmi v2 configuration · Base Mainnet only
 *
 * Connectors enabled:
 *   - injected (MetaMask, Rabby, etc.)
 *   - coinbaseWallet (Base native)
 *   - walletConnect (mobile QR fallback)
 *   - Farcaster Frame is auto-detected via injected when running inside a Frame
 */

import { http, createConfig, fallback } from 'wagmi'
import { base } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

// WalletConnect Project ID — replace with your own from https://cloud.walletconnect.com
// Falls back to a public placeholder for static IPFS export; users can still connect via injected/Coinbase.
const WC_PROJECT_ID =
  (import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string | undefined) ||
  '00000000000000000000000000000000'

// Public RPCs for Base — viem will fall over to the next on failure
const BASE_RPCS = [
  'https://mainnet.base.org',
  'https://base.llamarpc.com',
  'https://base-rpc.publicnode.com',
  'https://base.drpc.org',
]

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: 'THE SPINNER · 330',
      appLogoUrl: 'https://330.madeinathens.eth.limo/images/icon.png',
      preference: 'all', // smart-wallet aware
    }),
    walletConnect({
      projectId: WC_PROJECT_ID,
      metadata: {
        name: 'THE SPINNER · 330',
        description: "Penelope's Loom × Agentic Computation · x⁰ = 1",
        url: 'https://330.madeinathens.eth.limo',
        icons: ['https://330.madeinathens.eth.limo/images/icon.png'],
      },
      showQrModal: true,
    }),
  ],
  transports: {
    [base.id]: fallback(BASE_RPCS.map((url) => http(url, { batch: true }))),
  },
  ssr: false,
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
