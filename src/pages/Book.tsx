import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { useSips, type SipEvent } from '../hooks/useSips'
import { exportReplies, getRepliesForSip, importReplies, type StoredReply } from '../lib/replyStore'
import {
  ADMIN_LABELS,
  ADMIN_SITES,
  basescanAddr,
  basescanTx,
  SACRED_NFT,
} from '../lib/contracts'
import './Book.css'

export function BookPage() {
  const { t, lang } = useI18n()
  const { sips, isLoading, error } = useSips()

  return (
    <div className="page book-page">
      <div className="frame">
        <div className="page-head">
          <h1 className="page-title">{t.book.title}</h1>
          <p className="page-sub">{t.book.sub}</p>
        </div>

        <BookToolbar />

        {isLoading && <div className="status mono">{t.book.loading}</div>}
        {error && <div className="alert error">{error}</div>}
        {!isLoading && sips.length === 0 && (
          <div className="empty">
            <div className="empty-mark">∅</div>
            <p>{t.book.no_sips}</p>
          </div>
        )}

        <div className="sips-list">
          {sips.map((sip, i) => (
            <SipCard key={`${sip.txHash}-${sip.logIndex}`} sip={sip} index={sips.length - i} />
          ))}
        </div>
      </div>
    </div>
  )
}

function BookToolbar() {
  const { t } = useI18n()
  const [importMsg, setImportMsg] = useState<string | null>(null)

  async function handleExport() {
    const json = await exportReplies()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `spinner-replies-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      const replies: StoredReply[] = data.replies || []
      // Restore bigint-looking strings
      const normalized = replies.map((r) => ({
        ...r,
        timestamp: typeof r.timestamp === 'string' ? Number(r.timestamp) : r.timestamp,
      }))
      const count = await importReplies(normalized)
      setImportMsg(`Imported ${count}/${replies.length}`)
    } catch (err: any) {
      setImportMsg(`Error: ${err.message}`)
    }
    e.target.value = ''
  }

  return (
    <div className="book-toolbar">
      <label className="btn-ghost-sm">
        {t.book.import_btn}
        <input type="file" accept="application/json" onChange={handleImport} hidden />
      </label>
      <button className="btn-ghost-sm" onClick={handleExport}>
        {t.book.export_btn}
      </button>
      {importMsg && <span className="toolbar-msg">{importMsg}</span>}
    </div>
  )
}

interface SipCardProps {
  sip: SipEvent
  index: number
}

function SipCard({ sip, index }: SipCardProps) {
  const { t } = useI18n()
  const [replies, setReplies] = useState<StoredReply[]>([])
  const [showReplies, setShowReplies] = useState(true)

  useEffect(() => {
    getRepliesForSip(sip.txHash).then(setReplies)
  }, [sip.txHash])

  const date = useMemo(() => {
    const d = new Date(Number(sip.timestamp) * 1000)
    return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  }, [sip.timestamp])

  const isSacred = Number(sip.nftId) === SACRED_NFT

  return (
    <article className="sip-card">
      <div className="sip-card-head">
        <div className="sip-num mono">{t.book.sip_label} #{String(index).padStart(3, '0')}</div>
        <div className="sip-meta mono">
          <span>{date}</span>
          {sip.nftId > 0n && (
            <span className={isSacred ? 'sacred' : ''}>NFT #{sip.nftId.toString()}</span>
          )}
          <a href={basescanTx(sip.txHash)} target="_blank" rel="noopener" className="link-u">
            {sip.txHash.slice(0, 10)}…
          </a>
        </div>
      </div>

      <blockquote className="haiku">{sip.productHash}</blockquote>

      <div className="sip-card-foot">
        <div className="author">
          <span className="mono author-label">{t.book.by}</span>
          <a
            href={basescanAddr(sip.consumer)}
            target="_blank"
            rel="noopener"
            className="author-addr"
          >
            {sip.consumer.slice(0, 8)}…{sip.consumer.slice(-4)}
          </a>
        </div>
        {replies.length > 0 ? (
          <button className="reply-toggle mono" onClick={() => setShowReplies((s) => !s)}>
            {replies.length} {showReplies ? '▼' : '▶'}
          </button>
        ) : (
          <span className="no-reply mono">{t.book.no_reply}</span>
        )}
      </div>

      {showReplies && replies.length > 0 && (
        <div className="replies">
          {replies.map((r) => (
            <ReplyView key={r.id} reply={r} />
          ))}
        </div>
      )}
    </article>
  )
}

function ReplyView({ reply }: { reply: StoredReply }) {
  const { t } = useI18n()
  const adminLabel = ADMIN_LABELS[reply.admin.toLowerCase()] || reply.admin
  const adminSite = ADMIN_SITES[reply.admin.toLowerCase()]
  const date = new Date(reply.timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div className="reply">
      <div className="reply-head mono">
        <span className="reply-label">{t.book.reply_label}</span>
        {adminSite ? (
          <a href={adminSite} target="_blank" rel="noopener" className="link-u">
            {adminLabel}
          </a>
        ) : (
          <span>{adminLabel}</span>
        )}
        <span className="reply-time">{date}</span>
      </div>
      <blockquote className="haiku reply-text">{reply.reply}</blockquote>
    </div>
  )
}
