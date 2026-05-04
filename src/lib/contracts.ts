/**
 * THE SPINNER · Contract addresses & minimal ABIs
 * Base Mainnet (chainId 8453)
 *
 * The Loom that weaves:
 *   - SPINNER receives sips (haiku + 0.08 USDC tip)
 *   - LOOM is the page being woven
 *   - NFT is the thread
 *   - OWNER Coin is the reward (1.10 per cycle, 33 steps total)
 */

import type { Address } from 'viem'

// ─── BASE MAINNET ─────────────────────────────────────────────
export const BASE_CHAIN_ID = 8453

// ─── CONTRACTS ────────────────────────────────────────────────
export const SPINNER: Address = '0x9Bb345B4d3aF142a0ce361D9B974E4319737bc17'
export const LOOM: Address = '0x16a91ED794728A6f81843E703ac1036385C5b003'
export const NFT_CONTRACT: Address = '0x318c81010D5fC11363f3A3C79Ee26B6EFe8D145B'
export const OWNER_COIN: Address = '0xa331F6e88c9B0Aa77e01bc3738b5ad31E1a930Dc'

// Native USDC on Base
export const USDC: Address = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
export const USDC_DECIMALS = 6

// ─── ADMINS (the 4 hands at the loom) ─────────────────────────
export const ADMINS = {
  madeinathens: '0xe6967ba1973bdeAAAF2601F67E0929deB9Edca8a',
  nftable: '0xb9f96ED0Ed33C7e773332e8B854b3f7bA4f58117',
  beecoin: '0x80C4bEf6e8B631541df4d0Cd5c75492654ef38fb',
  syntropy: '0xA618C5875e537fF47e307c70b7ce457eaa9e4177',
} as const satisfies Record<string, Address>

export const ADMIN_ADDRESSES = Object.values(ADMINS).map(
  (a) => a.toLowerCase() as Address
)

export const ADMIN_LABELS: Record<string, string> = {
  [ADMINS.madeinathens.toLowerCase()]: 'madeinathens.eth',
  [ADMINS.nftable.toLowerCase()]: 'nftable.eth',
  [ADMINS.beecoin.toLowerCase()]: 'beecoin.eth',
  [ADMINS.syntropy.toLowerCase()]: 'syntropy.eth',
}

export const ADMIN_SITES: Record<string, string> = {
  [ADMINS.madeinathens.toLowerCase()]: 'https://madeinathens.eth.limo',
  [ADMINS.nftable.toLowerCase()]: 'https://nftable.eth.limo',
  [ADMINS.beecoin.toLowerCase()]: 'https://beecoin.eth.limo',
  [ADMINS.syntropy.toLowerCase()]: 'https://syntropy.eth.limo',
}

// ─── CONSTANTS (mirror the contract) ──────────────────────────
// IMPORTANT: SPINNER's SIP_TIP is `0.08 ether` and the tip is paid in
// OWNER Coin (ERC20_OWNER, Zora ContentCoin, 18 decimals).
// The user must hold + approve OWNER Coin — NOT USDC — to send a tip.
// USDC (6 dec) is used elsewhere in the protocol (UNIT_WORTH=3.30 in payWithNFT).
export const SIP_TIP_OWNER = '0.08' // human-readable
export const SIP_TIP_WEI = 80_000_000_000_000_000n // 0.08 × 10^18

export const UNIT_WORTH_USDC = '3.30'
export const EARN_AMOUNT = '1.10'
export const TOTAL_LADDER = '56.10'
export const MAX_STEPS = 33
export const SACRED_NFT = 16
export const SELLBACK_WINDOW_SECONDS = 86_400 // 24h

export const HAIKU_MAX_CHARS = 140

// ─── EIP-712 DOMAIN (matches THE_SPINNER constructor) ─────────
export const EIP712_DOMAIN = {
  name: 'THE_SPINNER_API',
  version: '0.0',
  chainId: BASE_CHAIN_ID,
  verifyingContract: SPINNER,
} as const

// EIP-712 types: PCEBite(address consumer,uint256 nftId,string productHash,uint256 timestamp,uint256 tip)
export const PCEBITE_TYPES = {
  PCEBite: [
    { name: 'consumer', type: 'address' },
    { name: 'nftId', type: 'uint256' },
    { name: 'productHash', type: 'string' },
    { name: 'timestamp', type: 'uint256' },
    { name: 'tip', type: 'uint256' },
  ],
} as const

// ─── ABIs ─────────────────────────────────────────────────────
export const SPINNER_ABI = [
  // sipPCEBite — the only write fn we call from frontend
  {
    type: 'function',
    name: 'sipPCEBite',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'consumer', type: 'address' },
      { name: 'nftId', type: 'uint256' },
      { name: 'productHash', type: 'string' },
      { name: 'timestamp', type: 'uint256' },
      { name: 'tip', type: 'uint256' },
      { name: 'signature', type: 'bytes' },
    ],
    outputs: [],
  },
  // Reads
  { type: 'function', name: 'isFrozen', stateMutability: 'view', inputs: [], outputs: [{ type: 'bool' }] },
  { type: 'function', name: 'balanceERC20', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'balanceETH', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'TOTAL_LADDER', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'MAX_STEPS', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'GENESIS_TS', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'SACRED_NFT', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'SIP_TIP', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'EARN_AMOUNT', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  {
    type: 'function',
    name: 'getStepValue',
    stateMutability: 'pure',
    inputs: [{ name: 'step', type: 'uint256' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'nonce',
    stateMutability: 'view',
    inputs: [{ type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  // Events (for the Book — read past sips)
  {
    type: 'event',
    name: 'PCEBite',
    inputs: [
      { name: 'consumer', type: 'address', indexed: true },
      { name: 'nftId', type: 'uint256', indexed: true },
      { name: 'productHash', type: 'string', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
      { name: 'tip', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'GeneratorExecuted',
    inputs: [
      { name: 'generator', type: 'address', indexed: true },
      { name: 'consumer', type: 'address', indexed: true },
      { name: 'nftId', type: 'uint256', indexed: false },
    ],
  },
] as const

export const ERC20_ABI = [
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  { type: 'function', name: 'decimals', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
] as const

// ─── EXPLORER LINKS ───────────────────────────────────────────
export function basescanAddr(addr: string): string {
  return `https://basescan.org/address/${addr}`
}
export function basescanTx(hash: string): string {
  return `https://basescan.org/tx/${hash}`
}
