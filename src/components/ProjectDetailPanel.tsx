import type { Project, Stage } from '../types';
import StatusBadge from './StatusBadge';
import Button from './common/Button';

interface ProjectDetailPanelProps {
  project: Project | null;
  onClose: () => void;
  onStageChange: (projectId: string, newStage: Stage) => void;
}

const STAGES: Stage[] = [
  'intake',
  'content-dev',
  'design',
  'presentation',
  'review',
  'revisions',
  'approved',
  'published',
];

const STAGE_LABELS: Record<Stage, string> = {
  intake: 'Intake',
  'content-dev': 'Content Dev',
  design: 'Design',
  presentation: 'Presentation',
  review: 'Review',
  revisions: 'Revisions',
  approved: 'Approved',
  published: 'Published',
};

function getNextStage(current: Stage): Stage | null {
  const idx = STAGES.indexOf(current);
  if (idx < STAGES.length - 1) return STAGES[idx + 1];
  return null;
}

export default function ProjectDetailPanel({
  project,
  onClose,
  onStageChange,
}: ProjectDetailPanelProps) {
  const isOpen = project !== null;

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          style={{ opacity: 1 }}
        />
      )}

      <aside className={`detail-sidebar${isOpen ? ' open' : ''}`}>
        {project && (
          <>
            <div className="sidebar-header">
              <h2>{project.title}</h2>
              <button className="close-btn" onClick={onClose}>✕</button>
            </div>

            <div className="sidebar-body">
              {/* Status */}
              <div className="sidebar-section">
                <h3>Status</h3>
                <StatusBadge stage={project.stage} />
              </div>

              {/* Mini Timeline */}
              <div className="sidebar-section">
                <h3>Pipeline Stage</h3>
                <div className="mini-timeline">
                  {STAGES.map((stage, idx) => {
                    const currentIdx = STAGES.indexOf(project.stage);
                    const isDone = idx < currentIdx;
                    const isActive = idx === currentIdx;
                    return (
                      <span key={stage} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span className={`timeline-step${isActive ? ' active' : isDone ? ' done' : ''}`}>
                          {isDone ? '✓ ' : ''}{STAGE_LABELS[stage]}
                        </span>
                        {idx < STAGES.length - 1 && (
                          <span className="timeline-arrow">›</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Project Metadata */}
              <div className="sidebar-section">
                <h3>Project Details</h3>
                <div className="meta-grid">
                  <div className="meta-item">
                    <span className="meta-label">Client</span>
                    <span className="meta-value">{project.clientName}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Project Manager</span>
                    <span className="meta-value">{project.projectManager}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Assigned To</span>
                    <span className="meta-value">{project.assignedTo}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Deadline</span>
                    <span className="meta-value">{project.deadline}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Created</span>
                    <span className="meta-value">{project.createdDate}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Progress</span>
                    <span className="meta-value">{project.progress}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ marginTop: 12 }}>
                  <div className="progress-bar-wrap">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Tags */}
                {project.tags.length > 0 && (
                  <div className="card-tags" style={{ marginTop: 12 }}>
                    {project.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Client Feedback */}
              {project.feedback.length > 0 && (
                <div className="sidebar-section">
                  <h3>Client Feedback ({project.feedback.length})</h3>
                  {project.feedback.map(f => (
                    <div key={f.id} className="feedback-item">
                      <div className={`feedback-priority priority-${f.priority}`} />
                      <div>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            color:
                              f.priority === 'high'
                                ? 'var(--alert)'
                                : f.priority === 'medium'
                                ? 'var(--warning)'
                                : 'var(--success)',
                          }}
                        >
                          {f.priority}
                        </span>
                        <div className="feedback-text">{f.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Stage History */}
              {project.stageHistory.length > 0 && (
                <div className="sidebar-section">
                  <h3>Stage History</h3>
                  {project.stageHistory.map((sh, idx) => (
                    <div key={idx} className="stage-history-item">
                      <div className="stage-history-name">
                        {STAGE_LABELS[sh.stage] || sh.stage}
                      </div>
                      <div className="stage-history-meta">
                        <span>📅 {sh.completedDate}</span>
                        <span>👤 {sh.assignedTo}</span>
                        <span>⏱ {sh.duration}d</span>
                      </div>
                      <div className="stage-history-notes">{sh.notes}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Activity Feed */}
              {project.activity.length > 0 && (
                <div className="sidebar-section">
                  <h3>Recent Activity</h3>
                  <div className="activity-feed">
                    {project.activity.map(a => (
                      <div key={a.id} className="activity-item">
                        <div className="activity-dot" />
                        <div className="activity-content">
                          <div className="activity-action">{a.action}</div>
                          <div className="activity-meta">
                            {a.date} at {a.time} · by {a.by}
                          </div>
                          {a.note && (
                            <div className="activity-note">{a.note}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="sidebar-section">
                <h3>Actions</h3>
                <div className="sidebar-actions">
                  {getNextStage(project.stage) && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        const next = getNextStage(project.stage);
                        if (next) onStageChange(project.id, next);
                        onClose();
                      }}
                    >
                      Move to {STAGE_LABELS[getNextStage(project.stage)!]}
                    </Button>
                  )}
                  <Button variant="secondary" size="sm">Add Comment</Button>
                  <Button variant="tertiary" size="sm">Share</Button>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
