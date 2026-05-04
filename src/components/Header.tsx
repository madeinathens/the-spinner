import { NavLink } from 'react-router-dom'
import { useAccount, useChainId, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { base } from 'wagmi/chains'
import { useI18n } from '../i18n/I18nContext'
import { ADMIN_ADDRESSES, BASE_CHAIN_ID } from '../lib/contracts'

export function Header() {
  const { lang, setLang, t } = useI18n()
  const { address, isConnected, connector } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const wrongChain = isConnected && chainId !== BASE_CHAIN_ID
  const isAdmin =
    address && ADMIN_ADDRESSES.includes(address.toLowerCase() as `0x${string}`)

  return (
    <header className="header">
      <div className="frame header-inner">
        <NavLink to="/" className="brand">
          <span className="brand-mark">⊕</span>
          <span className="brand-text">
            <span className="brand-title">THE SPINNER</span>
            <span className="brand-sub">x⁰ = 1 · 330</span>
          </span>
        </NavLink>

        <nav className="nav">
          <NavLink to="/" end>{t.nav.home}</NavLink>
          <NavLink to="/sip">{t.nav.sip}</NavLink>
          <NavLink to="/book">{t.nav.book}</NavLink>
          <NavLink to="/ladder">{t.nav.ladder}</NavLink>
          <NavLink to="/spin">{t.nav.spin}</NavLink>
          {isAdmin && <NavLink to="/admin">{t.nav.admin}</NavLink>}
        </nav>

        <div className="header-right">
          <div className="lang-toggle" role="group" aria-label="Language">
            <button
              className={lang === 'en' ? 'active' : ''}
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
            >
              EN
            </button>
            <button
              className={lang === 'el' ? 'active' : ''}
              onClick={() => setLang('el')}
              aria-pressed={lang === 'el'}
            >
              EL
            </button>
          </div>

          {!isConnected ? (
            <div className="connect-wrap">
              <button
                className="btn-connect"
                onClick={() => connect({ connector: connectors[0]! })}
                disabled={isPending}
              >
                {isPending ? '...' : t.common.connect}
              </button>
              {connectors.length > 1 && (
                <div className="connect-menu">
                  {connectors.map((c) => (
                    <button key={c.uid} onClick={() => connect({ connector: c })}>
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : wrongChain ? (
            <button
              className="btn-warn"
              onClick={() => switchChain({ chainId: base.id })}
            >
              {t.common.switch_to_base}
            </button>
          ) : (
            <div className="connected-pill" onClick={() => disconnect()} title={t.common.disconnect}>
              <span className="pulse" />
              <span className="addr-short">
                {address!.slice(0, 6)}…{address!.slice(-4)}
              </span>
              <span className="connector-name">{connector?.name}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
