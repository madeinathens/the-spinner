import { useEffect, useMemo, useState } from 'react'
import { useAccount, useChainId, usePublicClient, useSignTypedData, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useI18n } from '../i18n/I18nContext'
import {
  BASE_CHAIN_ID,
  ERC20_ABI,
  HAIKU_MAX_CHARS,
  OWNER_COIN,
  SACRED_NFT,
  SIP_TIP_OWNER,
  SIP_TIP_WEI,
  SPINNER,
  SPINNER_ABI,
  basescanTx,
} from '../lib/contracts'
import { buildSipTypedData, countGraphemes, validateHaiku } from '../lib/eip712'
import { useOwnerBalance } from '../hooks/useSpinner'
import { Loom } from '../components/Loom'
import './Sip.css'

type Stage = 'idle' | 'approving' | 'signing' | 'submitting' | 'success' | 'error'

export function SipPage() {
  const { t, lang } = useI18n()
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const client = usePublicClient()

  const [haiku, setHaiku] = useState('')
  const [nftId, setNftId] = useState<string>('0')
  const [stage, setStage] = useState<Stage>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [signedSig, setSignedSig] = useState<`0x${string}` | null>(null)
  const [signedTimestamp, setSignedTimestamp] = useState<bigint | null>(null)
  const [submittedTx, setSubmittedTx] = useState<`0x${string}` | null>(null)

  const { signTypedDataAsync } = useSignTypedData()
  const { writeContractAsync } = useWriteContract()

  const { data: ownerData, refetch: refetchOwner } = useOwnerBalance(address)
  const ownerBalance = (ownerData?.[0]?.result as bigint | undefined) ?? 0n
  const ownerAllowance = (ownerData?.[1]?.result as bigint | undefined) ?? 0n
  const needsApproval = ownerBalance >= SIP_TIP_WEI && ownerAllowance < SIP_TIP_WEI
  const insufficientBalance = ownerBalance < SIP_TIP_WEI

  const charCount = useMemo(() => countGraphemes(haiku), [haiku])
  const charValid = charCount > 0 && charCount <= HAIKU_MAX_CHARS

  const wrongChain = isConnected && chainId !== BASE_CHAIN_ID

  // Watch for confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: submittedTx ?? undefined,
  })
  useEffect(() => {
    if (isConfirmed) {
      setStage('success')
      refetchOwner()
    }
  }, [isConfirmed, refetchOwner])

  const isBusy = stage === 'approving' || stage === 'signing' || stage === 'submitting' || isConfirming

  // ─── ACTIONS ──────────────────────────────────────────────
  async function approveOwner() {
    if (!address) return
    setErrorMsg(null)
    setStage('approving')
    try {
      const hash = await writeContractAsync({
        address: OWNER_COIN,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [SPINNER, SIP_TIP_WEI],
      })
      // Wait for confirmation before allowing sign
      await client?.waitForTransactionReceipt({ hash })
      await refetchOwner()
      setStage('idle')
    } catch (e: any) {
      setErrorMsg(e?.shortMessage || e?.message || 'Approval failed')
      setStage('error')
    }
  }

  async function submitSip() {
    if (!address) {
      setErrorMsg(t.sip.err_wallet)
      return
    }
    if (wrongChain) {
      setErrorMsg(t.sip.err_chain)
      return
    }
    const v = validateHaiku(haiku)
    if (!v.ok) {
      setErrorMsg(t.sip.err_haiku + ': ' + v.reason)
      return
    }
    const idNum = Number(nftId || '0')
    if (idNum === SACRED_NFT) {
      setErrorMsg(t.sip.err_sacred)
      return
    }
    if (insufficientBalance) {
      setErrorMsg(t.sip.err_balance)
      return
    }

    setErrorMsg(null)
    setStage('signing')

    const ts = BigInt(Math.floor(Date.now() / 1000))
    const tip = SIP_TIP_WEI

    try {
      const td = buildSipTypedData({
        consumer: address,
        nftId: BigInt(idNum),
        productHash: haiku,
        timestamp: ts,
        tip,
      })

      const sig = await signTypedDataAsync({
        domain: td.domain,
        types: td.types,
        primaryType: td.primaryType,
        message: td.message,
      })

      setSignedSig(sig)
      setSignedTimestamp(ts)

      // The contract expects a Generator to relay this. The user's wallet IS a Generator
      // only if it's one of the 6 admin/relay addresses. For all other users, we MUST
      // submit via a Generator. In static IPFS-deployed builds with no backend, the
      // simplest correct path is: ask the user's own wallet to submit (which works
      // only if they are a Generator).
      //
      // For non-Generator users the signature can be exported as JSON and relayed
      // off-band. We surface this in the UI as a fallback.
      setStage('submitting')
      const hash = await writeContractAsync({
        address: SPINNER,
        abi: SPINNER_ABI,
        functionName: 'sipPCEBite',
        args: [address, BigInt(idNum), haiku, ts, tip, sig],
      })
      setSubmittedTx(hash)
    } catch (e: any) {
      const msg = e?.shortMessage || e?.message || 'Transaction failed'
      // If the user is not a Generator, the call reverts with "Only Generators can relay"
      // → switch to off-line export mode.
      if (msg.includes('Generator') || msg.includes('AccessControl')) {
        setStage('idle')
        setErrorMsg(
          lang === 'el'
            ? 'Δεν είσαι Generator. Η υπογραφή σου σώθηκε — εξάγαγέ τη και στείλ’ τη σε έναν admin για relay.'
            : 'You are not a Generator. Your signature is saved — export and forward it to an admin for relay.'
        )
      } else {
        setErrorMsg(msg)
        setStage('error')
      }
    }
  }

  function exportSignature() {
    if (!address || !signedSig || !signedTimestamp) return
    const bundle = {
      version: 'spinner_sip_v1',
      consumer: address,
      nftId: Number(nftId),
      productHash: haiku,
      timestamp: signedTimestamp.toString(),
      tip: SIP_TIP_WEI.toString(),
      signature: signedSig,
      domain: {
        name: 'THE_SPINNER_API',
        version: '0.0',
        chainId: BASE_CHAIN_ID,
        verifyingContract: SPINNER,
      },
    }
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sip-${address.slice(0, 6)}-${signedTimestamp}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page sip-page">
      <div className="frame">
        <div className="page-head">
          <h1 className="page-title">{t.sip.title}</h1>
          <p className="page-sub">{t.sip.sub}</p>
        </div>

        <div className="sip-grid">
          {/* LEFT: Composer */}
          <div className="sip-composer">
            <div className="composer-frame">
              <textarea
                className="haiku-input"
                value={haiku}
                onChange={(e) => setHaiku(e.target.value)}
                placeholder={t.sip.placeholder}
                rows={5}
                maxLength={HAIKU_MAX_CHARS * 2 /* allow some slack for input control */}
                disabled={isBusy}
              />
              <div className="composer-foot">
                <span className={`char-count ${!charValid ? 'over' : ''}`}>
                  {charCount} / {HAIKU_MAX_CHARS} {t.sip.char_count}
                </span>
              </div>
            </div>

            <div className="sip-fields">
              <label className="field">
                <span className="field-label">{t.sip.nft_label}</span>
                <input
                  type="number"
                  min="0"
                  className="field-input"
                  value={nftId}
                  onChange={(e) => setNftId(e.target.value)}
                  disabled={isBusy}
                />
                <span className="field-help">{t.sip.nft_help}</span>
              </label>

              <div className="field">
                <span className="field-label">{t.sip.tip_label}</span>
                <div className="tip-display">
                  <span className="tip-amount">{SIP_TIP_OWNER}</span>
                  <span className="tip-unit">{t.sip.cost_owner}</span>
                </div>
              </div>
            </div>

            {errorMsg && <div className="alert error">{errorMsg}</div>}
            {stage === 'success' && submittedTx && (
              <div className="alert success">
                ✓ {t.sip.success}{' '}
                <a href={basescanTx(submittedTx)} target="_blank" rel="noopener">
                  {t.common.view_tx} ↗
                </a>
              </div>
            )}

            <div className="actions">
              {!isConnected ? (
                <button className="btn-primary" disabled>
                  {t.sip.err_wallet}
                </button>
              ) : wrongChain ? (
                <button className="btn-primary" disabled>
                  {t.sip.err_chain}
                </button>
              ) : needsApproval ? (
                <button className="btn-primary" onClick={approveOwner} disabled={isBusy}>
                  {stage === 'approving' ? t.sip.approve_pending : t.sip.approve_btn}
                </button>
              ) : insufficientBalance ? (
                <button className="btn-primary" disabled>
                  {t.sip.err_balance}
                </button>
              ) : (
                <button
                  className="btn-primary"
                  onClick={submitSip}
                  disabled={isBusy || !charValid}
                >
                  {isBusy ? t.sip.sending : t.sip.sign_btn}
                </button>
              )}

              {signedSig && stage !== 'success' && (
                <button className="btn-ghost" onClick={exportSignature}>
                  Export signature ↓
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: Loom + explainer */}
          <div className="sip-side">
            <div className="loom-mini">
              <Loom size={280} spinning />
            </div>
            <div className="explainer">
              <div className="explainer-title">{t.sip.explainer_title}</div>
              <ol className="explainer-steps">
                <li>{t.sip.step1}</li>
                <li>{t.sip.step2}</li>
                <li>{t.sip.step3}</li>
                <li>{t.sip.step4}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
