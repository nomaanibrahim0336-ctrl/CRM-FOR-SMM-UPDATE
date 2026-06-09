import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import type { Project, Stage } from '../types';
import ProjectCard from './ProjectCard';

interface KanbanBoardProps {
  projectsByStage: Record<Stage, Project[]>;
  onProjectSelect: (project: Project) => void;
  onStageChange: (projectId: string, newStage: Stage) => void;
}

const STAGE_CONFIG: { key: Stage; label: string; emoji: string }[] = [
  { key: 'intake', label: 'Intake', emoji: '📥' },
  { key: 'content-dev', label: 'Content Dev', emoji: '✍️' },
  { key: 'design', label: 'Design', emoji: '🎨' },
  { key: 'presentation', label: 'Presentation', emoji: '🎯' },
  { key: 'review', label: 'Review', emoji: '👁️' },
  { key: 'revisions', label: 'Revisions', emoji: '🔄' },
  { key: 'approved', label: 'Approved', emoji: '✅' },
  { key: 'published', label: 'Published', emoji: '🚀' },
];

function findStageByProjectId(
  id: string,
  projectsByStage: Record<Stage, Project[]>
): Stage | null {
  for (const stage of Object.keys(projectsByStage) as Stage[]) {
    if (projectsByStage[stage].find(p => p.id === id)) return stage;
  }
  return null;
}

export default function KanbanBoard({
  projectsByStage,
  onProjectSelect,
  onStageChange,
}: KanbanBoardProps) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    for (const stage of Object.keys(projectsByStage) as Stage[]) {
      const found = projectsByStage[stage].find(p => p.id === active.id);
      if (found) {
        setActiveProject(found);
        return;
      }
    }
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // Real-time preview could go here; we handle on dragEnd for simplicity
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveProject(null);

    if (!over) return;
    if (active.id === over.id) return;

    const activeStage = findStageByProjectId(String(active.id), projectsByStage);
    if (!activeStage) return;

    // Check if dropped on a column header (over.id is a stage key)
    const isStageTarget = STAGE_CONFIG.some(s => s.key === over.id);
    if (isStageTarget) {
      const targetStage = over.id as Stage;
      if (targetStage !== activeStage) {
        onStageChange(String(active.id), targetStage);
      }
      return;
    }

    // Dropped on another card — find which stage that card belongs to
    const targetStage = findStageByProjectId(String(over.id), projectsByStage);
    if (targetStage && targetStage !== activeStage) {
      onStageChange(String(active.id), targetStage);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-container">
        <div className="kanban-board">
          {STAGE_CONFIG.map(({ key, label, emoji }) => {
            const cards = projectsByStage[key] || [];
            return (
              <SortableContext
                key={key}
                items={cards.map(p => p.id)}
                strategy={verticalListSortingStrategy}
                id={key}
              >
                <div className="kanban-column" data-stage={key}>
                  <div className="kanban-column-header">
                    <div className="kanban-column-title">
                      <span>{emoji}</span>
                      <span>{label}</span>
                    </div>
                    <span className="kanban-column-count">{cards.length}</span>
                  </div>
                  <div className="kanban-cards">
                    {cards.map(project => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onSelect={onProjectSelect}
                      />
                    ))}
                    {cards.length === 0 && (
                      <div className="empty-state">No projects</div>
                    )}
                  </div>
                </div>
              </SortableContext>
            );
          })}
        </div>
      </div>

      <DragOverlay>
        {activeProject ? (
          <div className="drag-overlay">
            <div className="project-card" style={{ cursor: 'grabbing', opacity: 0.9 }}>
              <div className="project-title">{activeProject.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {activeProject.clientName}
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
