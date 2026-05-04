import { useEffect, useState } from 'react'
import {
  isAddress,
  keccak256,
  toBytes,
  type Address,
  type Hex,
  verifyTypedData,
} from 'viem'
import { useAccount, useSignTypedData } from 'wagmi'
import { useI18n } from '../i18n/I18nContext'
import { buildReceiptClearTypedData } from '../lib/eip712'
import { Loom } from '../components/Loom'
import './Spin.css'

interface SignedReceipt {
  id: string
  issuer: Address
  recipient: Address
  receiptLabel: string // kept locally for human readability
  receiptHash: Hex
  note: string
  timestamp: number
  signature: Hex
}

const STORAGE_KEY = 'spinner_receipts_v1'

function loadLocalReceipts(): SignedReceipt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveLocalReceipts(rs: SignedReceipt[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rs))
  } catch {
    /* noop */
  }
}

export function SpinPage() {
  const { t } = useI18n()
  const { address, isConnected } = useAccount()
  const { signTypedDataAsync } = useSignTypedData()

  const [recipient, setRecipient] = useState('')
  const [receipt, setReceipt] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [saved, setSaved] = useState<SignedReceipt[]>([])

  useEffect(() => {
    setSaved(loadLocalReceipts())
  }, [])

  const receiptHash: Hex | null = receipt
    ? keccak256(toBytes(receipt))
    : null

  async function submit() {
    if (!address) {
      setMsg({ type: 'err', text: t.sip.err_wallet })
      return
    }
    const trimmedRecipient = recipient.trim()
    if (!isAddress(trimmedRecipient)) {
      setMsg({ type: 'err', text: t.spin.err_invalid_addr })
      return
    }
    if (!receipt.trim()) {
      setMsg({ type: 'err', text: t.spin.err_empty_receipt })
      return
    }
    if (note.length > 140) {
      setMsg({ type: 'err', text: 'Note too long' })
      return
    }
    setBusy(true)
    setMsg(null)
    try {
      const ts = BigInt(Math.floor(Date.now() / 1000))
      const hash = keccak256(toBytes(receipt))
      const td = buildReceiptClearTypedData({
        issuer: address,
        recipient: trimmedRecipient as Address,
        receiptHash: hash,
        note: note.trim(),
        timestamp: ts,
      })
      const signature = await signTypedDataAsync({
        domain: td.domain,
        types: td.types,
        primaryType: td.primaryType,
        message: td.message,
      })
      // Verify before saving
      const valid = await verifyTypedData({
        address,
        domain: td.domain,
        types: td.types,
        primaryType: td.primaryType,
        message: td.message,
        signature,
      })
      if (!valid) throw new Error('Signature verification failed')

      const stored: SignedReceipt = {
        id: `${address.toLowerCase()}::${hash}::${ts.toString()}`,
        issuer: address,
        recipient: trimmedRecipient as Address,
        receiptLabel: receipt,
        receiptHash: hash,
        note: note.trim(),
        timestamp: Number(ts) * 1000,
        signature,
      }
      const next = [stored, ...saved]
      setSaved(next)
      saveLocalReceipts(next)
      setMsg({ type: 'ok', text: t.spin.success })
      setReceipt('')
      setNote('')
    } catch (e: any) {
      setMsg({ type: 'err', text: e?.shortMessage || e?.message || 'Sign failed' })
    } finally {
      setBusy(false)
    }
  }

  function downloadOne(r: SignedReceipt) {
    const bundle = {
      version: 'spinner_receipt_clear_v1',
      domain: 'THE_SPINNER_RECEIPT v0.1',
      chainId: 8453,
      verifyingContract: '0x9Bb345B4d3aF142a0ce361D9B974E4319737bc17',
      issuer: r.issuer,
      recipient: r.recipient,
      receiptHash: r.receiptHash,
      receiptLabelPlaintext: r.receiptLabel,
      note: r.note,
      timestamp: Math.floor(r.timestamp / 1000),
      signature: r.signature,
    }
    const blob = new Blob([JSON.stringify(bundle, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receiptClear-${r.receiptHash.slice(2, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page spin-page">
      <div className="frame">
        <div className="page-head">
          <h1 className="page-title">{t.spin.title}</h1>
          <p className="page-sub">{t.spin.sub}</p>
        </div>

        <div className="spin-grid">
          <div className="spin-form">
            <div className="form-intro">
              <h2 className="intro-title">{t.spin.intro_title}</h2>
              <p>{t.spin.intro_p1}</p>
              <p>{t.spin.intro_p2}</p>
              <p>{t.spin.intro_p3}</p>
            </div>

            <div className="field">
              <label className="field-label">{t.spin.wallet_label}</label>
              <input
                className="field-input"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x... or alice.eth"
                disabled={busy}
              />
              <span className="field-help">{t.spin.wallet_help}</span>
            </div>

            <div className="field">
              <label className="field-label">{t.spin.receipt_label}</label>
              <input
                className="field-input"
                value={receipt}
                onChange={(e) => setReceipt(e.target.value)}
                placeholder="receipt #1234 · ipfs://Qm... · morning coffee 04/05"
                disabled={busy}
              />
              <span className="field-help">{t.spin.receipt_help}</span>
              {receiptHash && (
                <div className="hash-preview mono">
                  <span className="hash-label">{t.spin.hash_label}</span>
                  <code>{receiptHash}</code>
                </div>
              )}
            </div>

            <div className="field">
              <label className="field-label">{t.spin.note_label}</label>
              <textarea
                className="field-input"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="..."
                rows={2}
                maxLength={140}
                disabled={busy}
              />
              <span className="field-help">
                {t.spin.note_help} · {note.length}/140
              </span>
            </div>

            {msg && (
              <div className={`alert ${msg.type === 'err' ? 'error' : 'success'}`}>
                {msg.text}
              </div>
            )}

            <button
              className="btn-primary"
              disabled={busy || !isConnected}
              onClick={submit}
            >
              {busy ? t.spin.pending : t.spin.sign_btn}
            </button>
            {!isConnected && (
              <p className="dim" style={{ fontSize: 13, marginTop: 8 }}>
                {t.sip.err_wallet}
              </p>
            )}
          </div>

          <div className="spin-side">
            <Loom size={260} spinning />
            <div className="examples">
              <div className="examples-title mono">{t.spin.examples_title}</div>
              <div className="example">
                <div className="ex-num">i</div>
                <div>
                  <div className="ex-title">{t.spin.ex1_title}</div>
                  <div className="ex-text">{t.spin.ex1_text}</div>
                </div>
              </div>
              <div className="example">
                <div className="ex-num">ii</div>
                <div>
                  <div className="ex-title">{t.spin.ex2_title}</div>
                  <div className="ex-text">{t.spin.ex2_text}</div>
                </div>
              </div>
              <div className="example">
                <div className="ex-num">iii</div>
                <div>
                  <div className="ex-title">{t.spin.ex3_title}</div>
                  <div className="ex-text">{t.spin.ex3_text}</div>
                </div>
              </div>
              <div className="example">
                <div className="ex-num">iv</div>
                <div>
                  <div className="ex-title">{t.spin.ex4_title}</div>
                  <div className="ex-text">{t.spin.ex4_text}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="hr" />

        <section className="saved-section">
          <h3 className="saved-title mono">{t.spin.saved_title}</h3>
          {saved.length === 0 ? (
            <p className="dim" style={{ fontStyle: 'italic' }}>
              {t.spin.no_saved}
            </p>
          ) : (
            <ul className="saved-list">
              {saved.map((r) => (
                <li key={r.id} className="saved-card">
                  <div className="saved-row">
                    <span className="saved-key mono">FROM</span>
                    <code className="saved-val">
                      {r.issuer.slice(0, 8)}…{r.issuer.slice(-6)}
                    </code>
                  </div>
                  <div className="saved-row">
                    <span className="saved-key mono">TO</span>
                    <code className="saved-val">
                      {r.recipient.slice(0, 8)}…{r.recipient.slice(-6)}
                    </code>
                  </div>
                  <div className="saved-row">
                    <span className="saved-key mono">RECEIPT</span>
                    <span className="saved-val saved-receipt">
                      "{r.receiptLabel}"
                    </span>
                  </div>
                  <div className="saved-row">
                    <span className="saved-key mono">HASH</span>
                    <code className="saved-val saved-hash">
                      {r.receiptHash.slice(0, 18)}…
                    </code>
                  </div>
                  {r.note && (
                    <div className="saved-row">
                      <span className="saved-key mono">NOTE</span>
                      <span className="saved-val saved-note">{r.note}</span>
                    </div>
                  )}
                  <div className="saved-row saved-foot">
                    <span className="dim mono saved-time">
                      {new Date(r.timestamp).toLocaleString()}
                    </span>
                    <button
                      className="btn-ghost-sm"
                      onClick={() => downloadOne(r)}
                    >
                      {t.spin.download_btn} ↓
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
