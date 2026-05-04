import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { useI18n } from '../i18n/I18nContext'
import { useSpinnerState } from '../hooks/useSpinner'
import { MAX_STEPS, SACRED_NFT, basescanAddr, SPINNER } from '../lib/contracts'
import './Ladder.css'

export function LadderPage() {
  const { t } = useI18n()
  const state = useSpinnerState()

  const steps = useMemo(() => {
    return Array.from({ length: MAX_STEPS }, (_, i) => {
      const step = i + 1
      const value = step * 0.10
      const cumulative = (step * (step + 1)) / 2 * 0.10
      return { step, value, cumulative }
    })
  }, [])

  const isFrozen = state.isFrozen === true

  return (
    <div className="page ladder-page">
      <div className="frame">
        <div className="page-head">
          <h1 className="page-title">{t.ladder.title}</h1>
          <p className="page-sub">{t.ladder.sub}</p>
        </div>

        {/* Live state cards */}
        <div className="state-cards">
          <div className={`state-card ${isFrozen ? 'frozen' : 'active'}`}>
            <div className="state-card-label mono">SPINNER</div>
            <div className="state-card-val">
              <span className="pulse" />
              {state.isFrozen === null ? '— —' : isFrozen ? t.ladder.state_frozen : t.ladder.state_active}
            </div>
            <a
              href={basescanAddr(SPINNER)}
              target="_blank"
              rel="noopener"
              className="state-card-link mono"
            >
              {SPINNER.slice(0, 10)}…{SPINNER.slice(-6)} ↗
            </a>
          </div>
          <div className="state-card">
            <div className="state-card-label mono">{t.ladder.treasury_owner}</div>
            <div className="state-card-val gold-bright">{state.formatted.balanceERC20}</div>
            <div className="state-card-foot mono">OWNER · 18 dec</div>
          </div>
          <div className="state-card">
            <div className="state-card-label mono">{t.ladder.treasury_eth}</div>
            <div className="state-card-val gold-bright">{state.formatted.balanceETH}</div>
            <div className="state-card-foot mono">ETH · native</div>
          </div>
        </div>

        {/* Mitotic ladder visualisation */}
        <div className="ladder-grid">
          {steps.map((s) => {
            const accent = s.step % 11 === 0
            return (
              <div key={s.step} className={`ladder-cell ${accent ? 'accent' : ''}`}>
                <div className="cell-step mono">{String(s.step).padStart(2, '0')}</div>
                <div className="cell-val">{s.value.toFixed(2)}</div>
                <div className="cell-cum mono">{s.cumulative.toFixed(2)}</div>
              </div>
            )
          })}
        </div>

        {/* Sacred NFT note */}
        <div className="sacred-note">
          <span className="sacred-mark">⊕</span>
          <span>{t.ladder.sacred} (id = {SACRED_NFT})</span>
        </div>

        {/* Math anchor */}
        <div className="math-anchor">
          <div className="math-eq">x⁰ = 1</div>
          <div className="math-text">
            ∑<sub>n=1</sub><sup>33</sup> 0.10n = (33 × 34 / 2) × 0.10 = 56.10
          </div>
          {state.totalLadder != null && (
            <div className="math-onchain mono">
              On-chain: {formatUnits(state.totalLadder, 18)} OWNER ✓
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
