import { useEffect, useState } from 'react'
import { usePublicClient } from 'wagmi'
import type { Address, Hex } from 'viem'
import { SPINNER, SPINNER_ABI } from '../lib/contracts'

export interface SipEvent {
  txHash: Hex
  blockNumber: bigint
  consumer: Address
  nftId: bigint
  productHash: string // the haiku
  timestamp: bigint
  tip: bigint
  logIndex: number
}

/**
 * Reads PCEBite events from the chain.
 *
 * SPINNER was deployed recently — we fetch from a recent block to keep RPC cheap.
 * For comprehensive history, replace `fromBlock` with deployment block once known.
 */
export function useSips(fromBlock?: bigint) {
  const client = usePublicClient()
  const [sips, setSips] = useState<SipEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!client) return
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        // Fetch in chunks to be RPC-friendly (max 10k blocks per call on most providers)
        const latest = await client!.getBlockNumber()
        // SPINNER deployment was Q1 2026, ~6 months ago at most. Window of ~3M blocks.
        const start = fromBlock ?? (latest > 3_000_000n ? latest - 3_000_000n : 0n)
        const CHUNK = 9_500n

        const sipEvent = SPINNER_ABI.find(
          (i) => i.type === 'event' && i.name === 'PCEBite'
        )!

        const all: SipEvent[] = []
        let cursor = start
        while (cursor <= latest && !cancelled) {
          const to = cursor + CHUNK > latest ? latest : cursor + CHUNK
          try {
            const logs = await client!.getLogs({
              address: SPINNER,
              event: sipEvent as any,
              fromBlock: cursor,
              toBlock: to,
            })
            for (const log of logs) {
              const args = (log as any).args as {
                consumer: Address
                nftId: bigint
                productHash: string
                timestamp: bigint
                tip: bigint
              }
              all.push({
                txHash: log.transactionHash,
                blockNumber: log.blockNumber!,
                consumer: args.consumer,
                nftId: args.nftId,
                productHash: args.productHash,
                timestamp: args.timestamp,
                tip: args.tip,
                logIndex: log.logIndex!,
              })
            }
          } catch (e) {
            // chunk failed, narrow window
            console.warn('Log chunk failed', cursor, to, e)
          }
          cursor = to + 1n
        }

        if (!cancelled) {
          // newest first
          all.sort((a, b) =>
            b.blockNumber === a.blockNumber
              ? b.logIndex - a.logIndex
              : Number(b.blockNumber - a.blockNumber)
          )
          setSips(all)
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load sips')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [client, fromBlock])

  return { sips, isLoading, error }
}
