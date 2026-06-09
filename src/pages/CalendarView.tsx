import { useState } from 'react';
import { mockProjects } from '../data/mockData';
import Button from '../components/common/Button';
import ProjectDetailPanel from '../components/ProjectDetailPanel';
import type { Project, Stage } from '../types';

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function isDeadlineUrgent(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff <= 3;
}

function isDeadlinePast(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

export default function CalendarView() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState(mockProjects);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const goBack = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const goForward = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const handleStageChange = (projectId: string, newStage: Stage) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === projectId
          ? { ...p, stage: newStage, lastUpdated: new Date().toISOString().split('T')[0] }
          : p
      )
    );
    if (selectedProject?.id === projectId) {
      setSelectedProject(prev => prev ? { ...prev, stage: newStage } : null);
    }
  };

  // Build event map: key = "YYYY-MM-DD", value = Project[]
  const eventMap: Record<string, typeof projects> = {};
  projects.forEach(p => {
    if (!eventMap[p.deadline]) eventMap[p.deadline] = [];
    eventMap[p.deadline].push(p);
  });

  // Build cells: null = padding, number = day
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const formatDateKey = (d: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const todayKey = today.toISOString().split('T')[0];

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Project Calendar</h1>
        <p className="page-subtitle">View project deadlines at a glance</p>
      </div>

      <div className="calendar-nav">
        <Button variant="secondary" size="sm" onClick={goBack}>‹ Prev</Button>
        <h2>{MONTH_NAMES[month]} {year}</h2>
        <Button variant="secondary" size="sm" onClick={goForward}>Next ›</Button>
      </div>

      <div className="calendar-grid">
        {DAY_NAMES.map(d => (
          <div key={d} className="calendar-header-cell">{d}</div>
        ))}
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`pad-${idx}`} className="calendar-cell other-month" />;
          }
          const dateKey = formatDateKey(day);
          const isToday = dateKey === todayKey;
          const events = eventMap[dateKey] || [];

          return (
            <div key={dateKey} className={`calendar-cell${isToday ? ' today' : ''}`}>
              <div className={`calendar-date${isToday ? ' today-num' : ''}`}>{day}</div>
              {events.map(p => {
                let cls = 'calendar-event';
                if (p.stage === 'published' || p.stage === 'approved') cls += ' done';
                else if (isDeadlineUrgent(p.deadline) || isDeadlinePast(p.deadline)) cls += ' urgent';
                return (
                  <div
                    key={p.id}
                    className={cls}
                    title={`${p.title} — ${p.clientName}`}
                    onClick={() => setSelectedProject(p)}
                  >
                    {p.title}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(0,102,204,0.12)' }} />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Active deadline</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(231,76,60,0.12)' }} />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Urgent / Overdue</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(39,174,96,0.12)' }} />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Completed</span>
        </div>
      </div>

      <ProjectDetailPanel
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onStageChange={handleStageChange}
      />
    </div>
  );
}
