import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

function getInitial(name: string) {
  return name.charAt(0).toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = [
    '#0066CC', '#6B3FA0', '#1E8A5E', '#C0392B', '#D35400',
    '#2471A3', '#117A65', '#7D6608',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getDeadlineStyle(dateStr: string): { text: string; color: string } {
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const text = diff < 0
    ? `Overdue ${Math.abs(diff)}d`
    : diff === 0
    ? 'Due today'
    : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const color =
    diff <= 3 ? 'var(--alert)' : diff <= 7 ? 'var(--warning)' : 'var(--text-secondary)';
  return { text, color };
}

export default function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const deadline = getDeadlineStyle(project.deadline);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`project-card${isDragging ? ' dragging' : ''}`}
      onClick={() => onSelect(project)}
      {...attributes}
      {...listeners}
    >
      {/* Client name with small circle initial */}
      <div className="client-info">
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: getAvatarColor(project.clientName),
            color: 'white',
            fontSize: 10,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {getInitial(project.clientName)}
        </div>
        <span className="client-name-text">{project.clientName}</span>
      </div>

      {/* Project title */}
      <div
        className="project-title"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: 8,
        }}
      >
        {project.title}
      </div>

      {/* Deadline */}
      <div style={{ fontSize: 12, color: deadline.color, fontWeight: deadline.color !== 'var(--text-secondary)' ? 600 : undefined, marginBottom: 8 }}>
        📅 {deadline.text}
      </div>

      {/* Progress bar + percentage */}
      <div className="progress-bar-wrap">
        <div
          className="progress-bar-fill"
          style={{ width: `${project.progress}%` }}
        />
      </div>
      <div className="progress-text">{project.progress}%</div>
    </div>
  );
}
