import { useI18n } from '../i18n/I18nContext'
import {
  ADMINS,
  ADMIN_LABELS,
  ADMIN_SITES,
  basescanAddr,
  LOOM,
  NFT_CONTRACT,
  OWNER_COIN,
  SPINNER,
} from '../lib/contracts'
import './Footer.css'

export function Footer() {
  const { t } = useI18n()
  const adminEntries = Object.values(ADMINS)

  return (
    <footer className="footer">
      <div className="frame">
        <div className="footer-grid">
          <div className="footer-block">
            <div className="footer-title mono">CONTRACTS · BASE 8453</div>
            <ul className="footer-list">
              <li>
                <span className="footer-key">SPINNER</span>
                <a href={basescanAddr(SPINNER)} target="_blank" rel="noopener" className="footer-val">
                  {SPINNER.slice(0, 10)}…{SPINNER.slice(-6)}
                </a>
              </li>
              <li>
                <span className="footer-key">LOOM</span>
                <a href={basescanAddr(LOOM)} target="_blank" rel="noopener" className="footer-val">
                  {LOOM.slice(0, 10)}…{LOOM.slice(-6)}
                </a>
              </li>
              <li>
                <span className="footer-key">NFT</span>
                <a href={basescanAddr(NFT_CONTRACT)} target="_blank" rel="noopener" className="footer-val">
                  {NFT_CONTRACT.slice(0, 10)}…{NFT_CONTRACT.slice(-6)}
                </a>
              </li>
              <li>
                <span className="footer-key">OWNER</span>
                <a href={basescanAddr(OWNER_COIN)} target="_blank" rel="noopener" className="footer-val">
                  {OWNER_COIN.slice(0, 10)}…{OWNER_COIN.slice(-6)}
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-block">
            <div className="footer-title mono">THE FOUR HANDS</div>
            <ul className="footer-list">
              {adminEntries.map((addr) => {
                const lower = addr.toLowerCase()
                return (
                  <li key={addr}>
                    <a
                      href={ADMIN_SITES[lower]}
                      target="_blank"
                      rel="noopener"
                      className="footer-val"
                    >
                      {ADMIN_LABELS[lower]}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="footer-block">
            <div className="footer-title mono">PHYSICAL ANCHOR</div>
            <p className="footer-prose">
              Lil Orbits Mini Donuts<br />
              Zosimadon 31, Piraeus<br />
              <em>Where the Genesis was sealed in 2012.</em>
            </p>
          </div>
        </div>

        <div className="footer-bottom mono">
          <span>{t.common.powered}</span>
          <span className="footer-qed">x⁰ = 1 · {t.common.qed} 🧬</span>
        </div>
      </div>
    </footer>
  )
}
