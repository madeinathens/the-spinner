import { useReadContract, useReadContracts } from 'wagmi'
import { formatUnits } from 'viem'
import { SPINNER, SPINNER_ABI, OWNER_COIN, ERC20_ABI } from '../lib/contracts'

/**
 * Live SPINNER state — auto-refresh every 60s.
 */
export function useSpinnerState() {
  const result = useReadContracts({
    contracts: [
      { address: SPINNER, abi: SPINNER_ABI, functionName: 'isFrozen' },
      { address: SPINNER, abi: SPINNER_ABI, functionName: 'balanceERC20' },
      { address: SPINNER, abi: SPINNER_ABI, functionName: 'balanceETH' },
      { address: SPINNER, abi: SPINNER_ABI, functionName: 'TOTAL_LADDER' },
      { address: SPINNER, abi: SPINNER_ABI, functionName: 'MAX_STEPS' },
      { address: SPINNER, abi: SPINNER_ABI, functionName: 'GENESIS_TS' },
      { address: SPINNER, abi: SPINNER_ABI, functionName: 'SACRED_NFT' },
      { address: SPINNER, abi: SPINNER_ABI, functionName: 'SIP_TIP' },
      { address: SPINNER, abi: SPINNER_ABI, functionName: 'EARN_AMOUNT' },
    ],
    query: {
      refetchInterval: 60_000,
      staleTime: 30_000,
    },
  })

  const [
    isFrozen,
    balanceERC20,
    balanceETH,
    totalLadder,
    maxSteps,
    genesisTs,
    sacredNft,
    sipTip,
    earnAmount,
  ] = result.data ?? []

  return {
    isLoading: result.isLoading,
    isError: result.isError,
    isFrozen: (isFrozen?.result as boolean | undefined) ?? null,
    balanceERC20: (balanceERC20?.result as bigint | undefined) ?? null,
    balanceETH: (balanceETH?.result as bigint | undefined) ?? null,
    totalLadder: (totalLadder?.result as bigint | undefined) ?? null,
    maxSteps: (maxSteps?.result as bigint | undefined) ?? null,
    genesisTs: (genesisTs?.result as bigint | undefined) ?? null,
    sacredNft: (sacredNft?.result as bigint | undefined) ?? null,
    sipTip: (sipTip?.result as bigint | undefined) ?? null,
    earnAmount: (earnAmount?.result as bigint | undefined) ?? null,
    formatted: {
      balanceERC20: balanceERC20?.result != null
        ? Number(formatUnits(balanceERC20.result as bigint, 18)).toFixed(2)
        : '— —',
      balanceETH: balanceETH?.result != null
        ? Number(formatUnits(balanceETH.result as bigint, 18)).toFixed(4)
        : '— —',
      totalLadder: totalLadder?.result != null
        ? Number(formatUnits(totalLadder.result as bigint, 18)).toFixed(2)
        : '— —',
    },
    refetch: result.refetch,
  }
}

/**
 * User's OWNER Coin balance & allowance to SPINNER.
 */
export function useOwnerBalance(address: `0x${string}` | undefined) {
  return useReadContracts({
    contracts: [
      {
        address: OWNER_COIN,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
      },
      {
        address: OWNER_COIN,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: address ? [address, SPINNER] : undefined,
      },
    ],
    query: {
      enabled: !!address,
      refetchInterval: 30_000,
    },
  })
}

/**
 * Get the value of a specific mitotic step (1-33).
 */
export function useStepValue(step: number) {
  return useReadContract({
    address: SPINNER,
    abi: SPINNER_ABI,
    functionName: 'getStepValue',
    args: [BigInt(step)],
    query: {
      enabled: step > 0 && step <= 33,
      staleTime: Infinity,
    },
  })
}

/**
 * User's nonce (incremented after each accepted sip).
 */
export function useNonce(address: `0x${string}` | undefined) {
  return useReadContract({
    address: SPINNER,
    abi: SPINNER_ABI,
    functionName: 'nonce',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })
}
