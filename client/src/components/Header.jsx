export default function Header({ onInstall, canInstall }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="header">
      <div className="header__brand">
        <h1 className="header__title">
          Rem<span>do</span>
        </h1>
        <p className="header__date">{dateStr}</p>
      </div>
      <div className="header__actions">
        {canInstall && (
          <button className="install-btn" onClick={onInstall} id="install-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Install
          </button>
        )}
      </div>
    </header>
  );
}
