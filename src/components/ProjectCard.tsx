import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
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

function formatDeadline(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { text: `Overdue by ${Math.abs(diff)}d`, urgent: true };
  if (diff === 0) return { text: 'Due today', urgent: true };
  if (diff <= 3) return { text: `Due in ${diff}d`, urgent: true };
  return {
    text: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    urgent: false,
  };
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

  const deadline = formatDeadline(project.deadline);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`project-card${isDragging ? ' dragging' : ''}`}
      onClick={() => onSelect(project)}
      {...attributes}
      {...listeners}
    >
      <div className="client-info">
        <div
          className="client-avatar"
          style={{ background: getAvatarColor(project.clientName) }}
        >
          {getInitials(project.clientName)}
        </div>
        <span className="client-name-text">{project.clientName}</span>
      </div>

      <div className="project-title">{project.title}</div>

      <div className="project-meta">
        <div className="project-meta-row">
          <span>📅</span>
          <span style={{ color: deadline.urgent ? 'var(--alert)' : undefined, fontWeight: deadline.urgent ? 600 : undefined }}>
            {deadline.text}
          </span>
        </div>
        <div className="project-meta-row">
          <span>👤</span>
          <span>{project.assignedTo}</span>
        </div>
      </div>

      <div className="progress-bar-wrap">
        <div
          className="progress-bar-fill"
          style={{ width: `${project.progress}%` }}
        />
      </div>
      <div className="progress-text">{project.progress}%</div>

      {project.tags.length > 0 && (
        <div className="card-tags">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="card-timestamp">Updated {project.lastUpdated}</div>
    </div>
  );
}
