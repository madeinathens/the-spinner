/**
 * EIP-712 signature builders
 *
 * 1. sipPCEBite — user signs off-chain, generator submits
 *    Domain matches THE_SPINNER_API · v0.0 · chainId 8453 · contract SPINNER
 *
 * 2. AdminReply — admin signs reply off-chain (no gas)
 *    Custom domain "THE_SPINNER_REPLY" · v0.1
 *    Reply is verified client-side and stored in IndexedDB + optional IPFS pin
 */

import type { Address, Hex } from 'viem'
import {
  EIP712_DOMAIN,
  PCEBITE_TYPES,
  HAIKU_MAX_CHARS,
  BASE_CHAIN_ID,
  SPINNER,
} from './contracts'

// ─── 1. SIP MESSAGE ──────────────────────────────────────────
export interface SipMessage {
  consumer: Address
  nftId: bigint
  productHash: string // the haiku itself, ≤140 chars
  timestamp: bigint
  tip: bigint
}

export function validateHaiku(text: string): { ok: true } | { ok: false; reason: string } {
  if (!text || text.trim().length === 0) {
    return { ok: false, reason: 'Empty haiku' }
  }
  // Use grapheme-aware count for Greek + emoji safety
  const segmenter = typeof Intl !== 'undefined' && (Intl as any).Segmenter
    ? new (Intl as any).Segmenter(undefined, { granularity: 'grapheme' })
    : null
  const len = segmenter
    ? Array.from(segmenter.segment(text)).length
    : [...text].length
  if (len > HAIKU_MAX_CHARS) {
    return { ok: false, reason: `Too long (${len}/${HAIKU_MAX_CHARS})` }
  }
  return { ok: true }
}

export function countGraphemes(text: string): number {
  const segmenter = typeof Intl !== 'undefined' && (Intl as any).Segmenter
    ? new (Intl as any).Segmenter(undefined, { granularity: 'grapheme' })
    : null
  return segmenter ? Array.from(segmenter.segment(text)).length : [...text].length
}

export function buildSipTypedData(msg: SipMessage) {
  return {
    domain: EIP712_DOMAIN,
    types: PCEBITE_TYPES,
    primaryType: 'PCEBite' as const,
    message: {
      consumer: msg.consumer,
      nftId: msg.nftId,
      productHash: msg.productHash,
      timestamp: msg.timestamp,
      tip: msg.tip,
    },
  }
}

// ─── 2. ADMIN REPLY MESSAGE (off-chain, signature only) ──────
export interface ReplyMessage {
  sipTxHash: Hex // the on-chain sip this is replying to
  sipConsumer: Address
  reply: string // ≤140 chars, the admin's haiku response
  timestamp: bigint
  admin: Address
}

export const REPLY_DOMAIN = {
  name: 'THE_SPINNER_REPLY',
  version: '0.1',
  chainId: BASE_CHAIN_ID,
  verifyingContract: SPINNER, // anchor to spinner even though reply is off-chain
} as const

export const REPLY_TYPES = {
  AdminReply: [
    { name: 'sipTxHash', type: 'bytes32' },
    { name: 'sipConsumer', type: 'address' },
    { name: 'reply', type: 'string' },
    { name: 'timestamp', type: 'uint256' },
    { name: 'admin', type: 'address' },
  ],
} as const

export function buildReplyTypedData(msg: ReplyMessage) {
  return {
    domain: REPLY_DOMAIN,
    types: REPLY_TYPES,
    primaryType: 'AdminReply' as const,
    message: msg,
  }
}

// ─── 3. RECEIPT CLEAR (Spin Your Date) ────────────────────────
// A signed promise from a wallet to a wallet, anchored to a hashed
// real-world receipt. Off-chain, gasless, eternal.
export interface ReceiptClearMessage {
  issuer: Address // who signs the promise
  recipient: Address // who holds it
  receiptHash: Hex // keccak256 of the human-readable receipt label
  note: string // ≤140 char message
  timestamp: bigint
}

export const RECEIPT_DOMAIN = {
  name: 'THE_SPINNER_RECEIPT',
  version: '0.1',
  chainId: BASE_CHAIN_ID,
  verifyingContract: SPINNER,
} as const

export const RECEIPT_TYPES = {
  ReceiptClear: [
    { name: 'issuer', type: 'address' },
    { name: 'recipient', type: 'address' },
    { name: 'receiptHash', type: 'bytes32' },
    { name: 'note', type: 'string' },
    { name: 'timestamp', type: 'uint256' },
  ],
} as const

export function buildReceiptClearTypedData(msg: ReceiptClearMessage) {
  return {
    domain: RECEIPT_DOMAIN,
    types: RECEIPT_TYPES,
    primaryType: 'ReceiptClear' as const,
    message: msg,
  }
}
