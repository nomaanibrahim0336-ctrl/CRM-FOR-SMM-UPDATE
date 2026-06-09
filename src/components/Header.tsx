interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activePage: 'dashboard' | 'calendar' | 'team' | 'clients';
  setActivePage: (page: 'dashboard' | 'calendar' | 'team' | 'clients') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function Header({
  theme,
  toggleTheme,
  activePage,
  setActivePage,
  searchQuery,
  setSearchQuery,
}: HeaderProps) {
  const navItems: { key: 'dashboard' | 'calendar' | 'team' | 'clients'; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'calendar', label: 'Calendar' },
    { key: 'team', label: 'Team' },
    { key: 'clients', label: 'Clients' },
  ];

  return (
    <header className="header">
      <div className="header-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="#" className="logo" onClick={e => { e.preventDefault(); setActivePage('dashboard'); }}>
            Office CRM
          </a>
          <nav style={{ display: 'flex', gap: '0' }}>
            {navItems.map(item => (
              <button
                key={item.key}
                className={`nav-tab${activePage === item.key ? ' active' : ''}`}
                onClick={() => setActivePage(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="header-right">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search projects, clients..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          <div className="user-avatar" title="User account">OC</div>
        </div>
      </div>
    </header>
  );
}
