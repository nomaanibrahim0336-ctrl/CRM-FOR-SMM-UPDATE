import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import CalendarView from './pages/CalendarView';
import TeamPerformance from './pages/TeamPerformance';
import ClientManagement from './pages/ClientManagement';
import './styles/variables.css';
import './styles/layout.css';
import './styles/components.css';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [activePage, setActivePage] = useState<'dashboard' | 'calendar' | 'team' | 'clients'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="app-layout">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        activePage={activePage}
        setActivePage={setActivePage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div style={{ paddingTop: 'var(--header-height)' }}>
        {activePage === 'dashboard' && (
          <Dashboard searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        )}
        {activePage === 'calendar' && <CalendarView />}
        {activePage === 'team' && <TeamPerformance />}
        {activePage === 'clients' && <ClientManagement />}
      </div>
    </div>
  );
}
