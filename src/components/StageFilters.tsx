import type { Stage } from '../types';

interface StageFiltersProps {
  activeFilter: Stage | 'all';
  setFilter: (filter: Stage | 'all') => void;
}

const filters: { key: Stage | 'all'; label: string; emoji: string }[] = [
  { key: 'all', label: 'All Projects', emoji: '📋' },
  { key: 'intake', label: 'Intake', emoji: '📥' },
  { key: 'content-dev', label: 'Content Dev', emoji: '✍️' },
  { key: 'design', label: 'Design', emoji: '🎨' },
  { key: 'presentation', label: 'Presentation', emoji: '🎯' },
  { key: 'review', label: 'Review', emoji: '👁️' },
  { key: 'revisions', label: 'Revisions', emoji: '🔄' },
  { key: 'approved', label: 'Approved', emoji: '✅' },
  { key: 'published', label: 'Published', emoji: '🚀' },
];

export default function StageFilters({ activeFilter, setFilter }: StageFiltersProps) {
  return (
    <div className="stage-filters">
      {filters.map(f => (
        <button
          key={f.key}
          className={`filter-btn${activeFilter === f.key ? ' active' : ''}`}
          onClick={() => setFilter(f.key)}
        >
          <span>{f.emoji}</span> {f.label}
        </button>
      ))}
    </div>
  );
}
