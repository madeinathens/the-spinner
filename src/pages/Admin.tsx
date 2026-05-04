import { useEffect, useMemo, useState } from 'react'
import { useAccount, useSignTypedData } from 'wagmi'
import { useI18n } from '../i18n/I18nContext'
import { useSips } from '../hooks/useSips'
import { ADMIN_ADDRESSES, ADMIN_LABELS, basescanTx, HAIKU_MAX_CHARS } from '../lib/contracts'
import { buildReplyTypedData } from '../lib/eip712'
import { getRepliesForSip, replyId, saveReply, type StoredReply } from '../lib/replyStore'
import './Admin.css'

export function AdminPage() {
  const { t } = useI18n()
  const { address, isConnected } = useAccount()

  const isAdmin = useMemo(() => {
    if (!address) return false
    return ADMIN_ADDRESSES.includes(address.toLowerCase() as `0x${string}`)
  }, [address])

  if (!isConnected) {
    return (
      <div className="page admin-page">
        <div className="frame">
          <div className="page-head">
            <h1 className="page-title">{t.admin.title}</h1>
            <p className="page-sub">{t.admin.sub}</p>
          </div>
          <div className="alert">{t.sip.err_wallet}</div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="page admin-page">
        <div className="frame">
          <div className="page-head">
            <h1 className="page-title">{t.admin.title}</h1>
          </div>
          <div className="alert error">{t.admin.not_admin}</div>
          <p className="dim" style={{ marginTop: 'var(--s4)', fontSize: 14 }}>
            Authorized addresses:
          </p>
          <ul className="admin-list">
            {Object.entries(ADMIN_LABELS).map(([addr, label]) => (
              <li key={addr}>
                <span className="mono">{addr}</span> · {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return <AdminInner />
}

function AdminInner() {
  const { t } = useI18n()
  const { address } = useAccount()
  const { sips, isLoading } = useSips()
  const { signTypedDataAsync } = useSignTypedData()

  const [selectedSipIdx, setSelectedSipIdx] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [existingReplies, setExistingReplies] = useState<Record<string, StoredReply[]>>({})

  // Pre-load existing replies for all sips
  useEffect(() => {
    if (sips.length === 0) return
    Promise.all(
      sips.map(async (s) => [s.txHash, await getRepliesForSip(s.txHash)] as const)
    ).then((entries) => {
      const map: Record<string, StoredReply[]> = {}
      for (const [hash, replies] of entries) {
        map[hash] = replies
      }
      setExistingReplies(map)
    })
  }, [sips])

  const selectedSip = selectedSipIdx != null ? sips[selectedSipIdx] : null

  async function submitReply() {
    if (!selectedSip || !address) return
    if (!replyText.trim() || replyText.length > HAIKU_MAX_CHARS) {
      setMsg({ type: 'err', text: 'Invalid reply length' })
      return
    }
    setBusy(true)
    setMsg(null)
    try {
      const ts = BigInt(Math.floor(Date.now() / 1000))
      const td = buildReplyTypedData({
        sipTxHash: selectedSip.txHash,
        sipConsumer: selectedSip.consumer,
        reply: replyText.trim(),
        timestamp: ts,
        admin: address,
      })
      const sig = await signTypedDataAsync({
        domain: td.domain,
        types: td.types,
        primaryType: td.primaryType,
        message: td.message,
      })
      const stored: StoredReply = {
        id: replyId(selectedSip.txHash, address),
        sipTxHash: selectedSip.txHash,
        sipConsumer: selectedSip.consumer,
        reply: replyText.trim(),
        timestamp: Date.now(),
        admin: address,
        signature: sig,
      }
      await saveReply(stored)
      setExistingReplies((m) => ({
        ...m,
        [selectedSip.txHash]: [...(m[selectedSip.txHash] || []), stored],
      }))
      setReplyText('')
      setMsg({ type: 'ok', text: t.admin.saved })
    } catch (e: any) {
      setMsg({ type: 'err', text: e?.shortMessage || e?.message || 'Failed' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page admin-page">
      <div className="frame">
        <div className="page-head">
          <h1 className="page-title">{t.admin.title}</h1>
          <p className="page-sub">{t.admin.sub}</p>
          <div className="admin-id mono">
            <span className="pulse" />
            {ADMIN_LABELS[address!.toLowerCase()] || address}
          </div>
        </div>

        {isLoading && <div className="status mono">{t.book.loading}</div>}

        <div className="admin-grid">
          <div className="admin-list-panel">
            <div className="panel-title mono">{t.admin.select_sip}</div>
            {sips.length === 0 && !isLoading ? (
              <div className="empty-small">{t.book.no_sips}</div>
            ) : (
              <ul className="sip-picker">
                {sips.map((sip, i) => {
                  const myReplies = (existingReplies[sip.txHash] || []).filter(
                    (r) => r.admin.toLowerCase() === address!.toLowerCase()
                  )
                  const replied = myReplies.length > 0
                  return (
                    <li
                      key={`${sip.txHash}-${sip.logIndex}`}
                      className={`pick-item ${selectedSipIdx === i ? 'active' : ''} ${replied ? 'replied' : ''}`}
                      onClick={() => setSelectedSipIdx(i)}
                    >
                      <div className="pick-haiku">{sip.productHash}</div>
                      <div className="pick-meta mono">
                        {sip.consumer.slice(0, 6)}…{sip.consumer.slice(-4)} ·{' '}
                        {new Date(Number(sip.timestamp) * 1000).toLocaleDateString()}
                        {replied && <span className="replied-tag"> ✓ replied</span>}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="admin-compose-panel">
            {selectedSip ? (
              <>
                <div className="panel-title mono">SELECTED · {selectedSip.txHash.slice(0, 14)}…</div>
                <blockquote className="haiku selected-haiku">{selectedSip.productHash}</blockquote>
                <div className="selected-meta mono">
                  by {selectedSip.consumer} ·{' '}
                  <a href={basescanTx(selectedSip.txHash)} target="_blank" rel="noopener">
                    view tx ↗
                  </a>
                </div>

                <textarea
                  className="haiku-input reply-input"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={t.admin.placeholder}
                  rows={4}
                  disabled={busy}
                />
                <div className="char-count mono">
                  {replyText.length} / {HAIKU_MAX_CHARS}
                </div>

                {msg && <div className={`alert ${msg.type === 'err' ? 'error' : 'success'}`}>{msg.text}</div>}

                <button className="btn-primary" onClick={submitReply} disabled={busy || !replyText.trim()}>
                  {busy ? '...' : t.admin.sign_btn}
                </button>
              </>
            ) : (
              <div className="empty-small">{t.admin.no_pending}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
