import type { Stage } from '../types';

interface StatusBadgeProps {
  stage?: Stage;
  label?: string;
  variant?: 'success' | 'warning' | 'alert' | 'blue' | 'grey';
}

const stageConfig: Record<Stage, { label: string; variant: 'success' | 'warning' | 'alert' | 'blue' | 'grey' }> = {
  intake: { label: 'Intake', variant: 'grey' },
  'content-dev': { label: 'Content Dev', variant: 'blue' },
  design: { label: 'Design', variant: 'blue' },
  presentation: { label: 'Presentation', variant: 'warning' },
  review: { label: 'Review', variant: 'warning' },
  revisions: { label: 'Revisions', variant: 'alert' },
  approved: { label: 'Approved', variant: 'success' },
  published: { label: 'Published', variant: 'success' },
};

export default function StatusBadge({ stage, label, variant }: StatusBadgeProps) {
  let resolvedLabel = label;
  let resolvedVariant = variant;

  if (stage) {
    resolvedLabel = stageConfig[stage].label;
    resolvedVariant = stageConfig[stage].variant;
  }

  return (
    <span className={`status-badge badge-${resolvedVariant}`}>
      {resolvedLabel}
    </span>
  );
}
