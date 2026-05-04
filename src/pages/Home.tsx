import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nContext'
import { Loom } from '../components/Loom'
import { LLMPrompt } from '../components/LLMPrompt'
import { useSpinnerState } from '../hooks/useSpinner'
import { TOTAL_LADDER, basescanAddr, SPINNER } from '../lib/contracts'
import './Home.css'

export function HomePage() {
  const { t } = useI18n()
  const state = useSpinnerState()

  const isFrozen = state.isFrozen === true
  const stateLabel = state.isFrozen === null
    ? '— —'
    : isFrozen
    ? t.ladder.state_frozen
    : t.ladder.state_active

  return (
    <div className="page home">
      {/* HERO */}
      <section className="hero">
        <div className="frame hero-inner">
          <div className="hero-text">
            <div className="hero-mark mono">{t.home.mark}</div>
            <h1 className="hero-title">
              {t.home.title}
              <em>{t.home.titleEm}</em>
            </h1>
            <p className="hero-sub">{t.home.sub}</p>
            <div className="hero-eq">
              <span className="hero-eq-main">x⁰ = 1</span>
              <span className="hero-eq-row">{t.home.eq1}</span>
              <span className="hero-eq-row">{t.home.eq2}</span>
            </div>
            <div className="hero-cta">
              <Link to="/sip" className="btn-cta primary">
                {t.home.cta_sip}
              </Link>
              <Link to="/book" className="btn-cta">
                {t.home.cta_book}
              </Link>
              <Link to="/ladder" className="btn-cta">
                {t.home.cta_ladder}
              </Link>
              <Link to="/spin" className="btn-cta">
                {t.nav.spin} ↗
              </Link>
            </div>
          </div>
          <div className="hero-loom">
            <Loom size={420} spinning />
          </div>
        </div>
      </section>

      {/* LIVE BAR */}
      <section className="live-bar">
        <div className="frame live-bar-inner">
          <div className="live-stat">
            <div className="live-label mono">{t.ladder.state_active === stateLabel ? 'STATE' : 'STATE'}</div>
            <div className={`live-val ${isFrozen ? 'frozen' : 'active'}`}>
              <span className="pulse" />
              {stateLabel}
            </div>
            <div className="live-unit mono">{t.common.on_chain}</div>
          </div>
          <div className="live-stat">
            <div className="live-label mono">{t.ladder.treasury_owner}</div>
            <div className="live-val dim-large">{state.formatted.balanceERC20}</div>
            <div className="live-unit mono">OWNER</div>
          </div>
          <div className="live-stat">
            <div className="live-label mono">{t.ladder.treasury_eth}</div>
            <div className="live-val dim-large">{state.formatted.balanceETH}</div>
            <div className="live-unit mono">ETH</div>
          </div>
          <div className="live-stat">
            <div className="live-label mono">LADDER · MAX</div>
            <div className="live-val">{state.formatted.totalLadder !== '— —' ? state.formatted.totalLadder : TOTAL_LADDER}</div>
            <div className="live-unit mono">33 × 0.10</div>
          </div>
        </div>
      </section>

      {/* CHAPTER I */}
      <section className="chapter">
        <div className="frame">
          <div className="chapter-num mono">{t.home.sectionA_num}</div>
          <h2 className="chapter-title">{t.home.sectionA_title}</h2>
          <div className="chapter-prose">
            <p>{t.home.sectionA_p1}</p>
            <p>{t.home.sectionA_p2}</p>
            <p>{t.home.sectionA_p3}</p>
          </div>
        </div>
      </section>

      {/* CHAPTER II — live anchor */}
      <section className="chapter live-anchor">
        <div className="frame">
          <div className="chapter-num mono">{t.home.sectionB_num}</div>
          <h2 className="chapter-title">{t.home.sectionB_title}</h2>
          <div className="contract-link">
            <a href={basescanAddr(SPINNER)} target="_blank" rel="noopener" className="link-u">
              {SPINNER}
            </a>
          </div>
        </div>
      </section>

      {/* LLM PROMPT — for any AI to understand the project */}
      <div className="frame">
        <LLMPrompt />
      </div>
    </div>
  )
}
