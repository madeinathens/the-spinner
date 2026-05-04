import { useMemo } from 'react'
import { useI18n } from '../i18n/I18nContext'
import './Loom.css'

interface LoomProps {
  size?: number
  showFates?: boolean
  spinning?: boolean
}

export function Loom({ size = 500, showFates = true, spinning = true }: LoomProps) {
  const cx = 250
  const cy = 250

  const fates = useMemo<Array<{
    lang: { en: string; el: string }
    x: number
    y: number
    anchor: 'middle' | 'start' | 'end'
  }>>(
    () => [
      { lang: { en: 'THEMIS', el: 'ΘΕΜΙΣ' }, x: 250, y: 22, anchor: 'middle' },
      { lang: { en: 'CLOTHO', el: 'ΚΛΩΘΩ' }, x: 478, y: 254, anchor: 'middle' },
      { lang: { en: 'LACHESIS', el: 'ΛΑΧΕΣΙΣ' }, x: 250, y: 488, anchor: 'middle' },
      { lang: { en: 'ATROPOS', el: 'ΑΤΡΟΠΟΣ' }, x: 22, y: 254, anchor: 'middle' },
    ],
    []
  )

  const { lang } = useI18n()

  // 33 outer mitotic spokes
  const outerSpokes = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; bright: boolean }[] = []
    for (let i = 0; i < 33; i++) {
      const angle = (i / 33) * Math.PI * 2 - Math.PI / 2
      const r1 = 140
      const r2 = 220
      lines.push({
        x1: cx + Math.cos(angle) * r1,
        y1: cy + Math.sin(angle) * r1,
        x2: cx + Math.cos(angle) * r2,
        y2: cy + Math.sin(angle) * r2,
        bright: i % 11 === 0,
      })
    }
    return lines
  }, [])

  // 16 inner spokes
  const innerSpokes = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = []
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2
      const r1 = 50
      const r2 = 100
      lines.push({
        x1: cx + Math.cos(angle) * r1,
        y1: cy + Math.sin(angle) * r1,
        x2: cx + Math.cos(angle) * r2,
        y2: cy + Math.sin(angle) * r2,
      })
    }
    return lines
  }, [])

  return (
    <svg
      className={`loom ${spinning ? 'spinning' : ''}`}
      viewBox="0 0 500 500"
      style={{ width: size, height: size }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="loomCore" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#c9a35a" stopOpacity="0.15" />
          <stop offset="60%" stopColor="#3d2854" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#0a0808" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r="240" fill="url(#loomCore)" />

      <g className={spinning ? 'rotate' : ''}>
        <circle className="ring bright" cx={cx} cy={cy} r="220" />
        <circle className="ring" cx={cx} cy={cy} r="180" strokeDasharray="2 6" />
        <circle className="ring" cx={cx} cy={cy} r="140" strokeDasharray="3 8" />
        {outerSpokes.map((s, i) => (
          <line
            key={i}
            x1={s.x1}
            y1={s.y1}
            x2={s.x2}
            y2={s.y2}
            className={s.bright ? 'thread bright' : 'thread'}
          />
        ))}
        {showFates &&
          fates.map((f, i) => (
            <text
              key={i}
              x={f.x}
              y={f.y}
              textAnchor={f.anchor}
              className="fate-label"
            >
              {f.lang[lang]}
            </text>
          ))}
      </g>

      <g className={spinning ? 'rotate-reverse' : ''}>
        <circle className="ring" cx={cx} cy={cy} r="100" />
        <circle className="ring bright" cx={cx} cy={cy} r="80" strokeDasharray="1 3" />
        {innerSpokes.map((s, i) => (
          <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} className="thread" />
        ))}
      </g>

      <g className={spinning ? 'shuttle' : ''}>
        <line x1={cx} y1={cy} x2={cx} y2="100" className="thread bright" />
        <circle cx={cx} cy="100" r="3" fill="#e8c87f" />
      </g>

      <g className="loom-center">
        <circle cx={cx} cy={cy} r="50" fill="#0a0808" stroke="#c9a35a" strokeWidth="0.8" />
        <text x={cx} y={cy + 8} textAnchor="middle" className="loom-center-text">
          x⁰ = 1
        </text>
      </g>
    </svg>
  )
}
