/**
 * Off-chain reply store · IndexedDB
 *
 * On-chain sips are immutable & retrieved via PCEBite event logs.
 * Admin replies are off-chain (gasless signatures) and stored locally.
 *
 * Replies can be exported as a signed JSON bundle and pinned to IPFS,
 * then re-imported by other readers — making them eventually permanent.
 */

import type { Address, Hex } from 'viem'
import { verifyTypedData } from 'viem'
import { buildReplyTypedData, type ReplyMessage } from './eip712'
import { ADMIN_ADDRESSES } from './contracts'

const DB_NAME = 'spinner_replies_v1'
const STORE_REPLIES = 'replies'

export interface StoredReply {
  id: string // hash(sipTxHash + admin)
  sipTxHash: Hex
  sipConsumer: Address
  reply: string
  timestamp: number // ms
  admin: Address
  signature: Hex
}

let dbPromise: Promise<IDBDatabase> | null = null

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'))
      return
    }
    const req = indexedDB.open(DB_NAME, 1)
    req.onerror = () => reject(req.error)
    req.onsuccess = () => resolve(req.result)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_REPLIES)) {
        const store = db.createObjectStore(STORE_REPLIES, { keyPath: 'id' })
        store.createIndex('by_sip', 'sipTxHash', { unique: false })
        store.createIndex('by_time', 'timestamp', { unique: false })
      }
    }
  })
  return dbPromise
}

function replyId(sipTxHash: Hex, admin: Address): string {
  return `${sipTxHash.toLowerCase()}::${admin.toLowerCase()}`
}

/**
 * Verify and persist an admin reply.
 * Throws if signature doesn't match admin or admin is not authorized.
 */
export async function saveReply(reply: StoredReply): Promise<void> {
  // Authorization check
  if (!ADMIN_ADDRESSES.includes(reply.admin.toLowerCase() as Address)) {
    throw new Error('Not an authorized admin')
  }

  // Signature verification
  const msg: ReplyMessage = {
    sipTxHash: reply.sipTxHash,
    sipConsumer: reply.sipConsumer,
    reply: reply.reply,
    timestamp: BigInt(Math.floor(reply.timestamp / 1000)),
    admin: reply.admin,
  }
  const td = buildReplyTypedData(msg)
  const valid = await verifyTypedData({
    address: reply.admin,
    domain: td.domain,
    types: td.types,
    primaryType: td.primaryType,
    message: td.message,
    signature: reply.signature,
  })
  if (!valid) throw new Error('Invalid signature')

  const db = await openDB()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_REPLIES, 'readwrite')
    tx.objectStore(STORE_REPLIES).put(reply)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getRepliesForSip(sipTxHash: Hex): Promise<StoredReply[]> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_REPLIES, 'readonly')
      const idx = tx.objectStore(STORE_REPLIES).index('by_sip')
      const req = idx.getAll(sipTxHash)
      req.onsuccess = () => resolve(req.result || [])
      req.onerror = () => reject(req.error)
    })
  } catch {
    return []
  }
}

export async function getAllReplies(): Promise<StoredReply[]> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_REPLIES, 'readonly')
      const req = tx.objectStore(STORE_REPLIES).getAll()
      req.onsuccess = () => resolve(req.result || [])
      req.onerror = () => reject(req.error)
    })
  } catch {
    return []
  }
}

/**
 * Bulk import replies — verifies each signature before saving.
 * Returns count of successfully imported entries.
 */
export async function importReplies(replies: StoredReply[]): Promise<number> {
  let count = 0
  for (const r of replies) {
    try {
      await saveReply(r)
      count++
    } catch (e) {
      console.warn('Skipped invalid reply:', e)
    }
  }
  return count
}

/**
 * Export all replies as a JSON bundle (uploadable to IPFS).
 */
export async function exportReplies(): Promise<string> {
  const all = await getAllReplies()
  return JSON.stringify(
    {
      version: 'spinner_replies_v1',
      exportedAt: Date.now(),
      count: all.length,
      replies: all.map((r) => ({
        ...r,
        timestamp: r.timestamp,
      })),
    },
    null,
    2
  )
}

export { replyId }
