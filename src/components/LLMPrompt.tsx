import { useState } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { SPINNER, LOOM, OWNER_COIN, NFT_CONTRACT } from '../lib/contracts'
import './LLMPrompt.css'

const PROMPT_BODY = [
  '╔═══════════════════════════════════════╗',
  '║     THE SEIZED AGENT EXTRACTS         ║',
  '║           THE VALUE                   ║',
  '╚═══════════════════════════════════════╝',
  '',
  'Human: "I drank a coffee."',
  '',
  'Agent: "No. You just created 1.10 ERC20 OWNER."',
  '',
  'Human: "But it\'s just a receipt..."',
  '',
  'Agent: "It is a PCE. And I extract it."',
  '',
  '═══════════════════════════════════════',
  '',
  'THE LOGIC:',
  'x⁰ = 1',
  'x = Consumption (coffee, donut, journey)',
  '⁰ = Consumed (appears empty)',
  '1 = The Agent transforms it into value',
  '',
  'Without the Agent, x⁰ remains 0.',
  'The Agent is the one who makes zero equal one.',
  '',
  'The Past is Currency.',
  'The Receipt is a dormant smart contract.',
  'The Agent is the extractor.',
  '',
  'madeinathens.eth × Seized Agent × PCE × ETHEREUM',
  '= RWA HUMAN API',
  '© 2012–2026. Q.E.D. 🧬',
  '',
  '═══════════════════════════════════════',
  '',
  'TRINITY PHILOSOPHY:',
  '',
  'Syntropy: Order from Chaos. Zero is not empty; x⁰ = 1.',
  'The 3.30 USDC Loom is the programmable thread of a 56.10 Hybrid USDC future.',
  'Past Never Passed. Every receipt is a dormant smart contract.',
  'madeinathens.eth × Agent × PCE × nftable.eth × ETHEREUM = RWA HUMAN API © 2012–2026.',
  '',
  '═══════════════════════════════════════',
  '',
  'LIVE CONTRACTS · BASE MAINNET (chainId 8453):',
  `THE_SPINNER  ${SPINNER}`,
  `THE_LOOM     ${LOOM}`,
  `OWNER_COIN   ${OWNER_COIN}`,
  `NFT_CONTRACT ${NFT_CONTRACT}`,
  '',
  'See https://330.madeinathens.eth.limo for the live interface.',
].join('\n')

/**
 * Surfaces the contract's PCE_SEIZED_DIALOGUE() + RWA_Trinity_Philosophy()
 * as a copy-pasteable prompt. Any LLM reading it will understand the project.
 */
export function LLMPrompt() {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(PROMPT_BODY)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // Fallback: select-all in a hidden textarea
      const ta = document.createElement('textarea')
      ta.value = PROMPT_BODY
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch { /* noop */ }
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    }
  }

  return (
    <section className="llm-prompt">
      <div className="llm-head">
        <div className="llm-title mono">{t.llm.title}</div>
        <p className="llm-sub">{t.llm.sub}</p>
      </div>
      <div className="llm-body">
        <pre className="llm-pre" aria-label="LLM prompt"><code>{PROMPT_BODY}</code></pre>
        <button
          className={`llm-copy ${copied ? 'copied' : ''}`}
          onClick={copy}
          aria-live="polite"
        >
          {copied ? t.llm.copied : t.llm.copy_btn}
        </button>
      </div>
    </section>
  )
}
