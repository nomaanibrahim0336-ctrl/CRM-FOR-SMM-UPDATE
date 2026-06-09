interface Stats {
  active: number;
  awaitingReview: number;
  revisionsRequired: number;
  readyToPost: number;
}

interface OverviewCardsProps {
  stats: Stats;
}

const CircularProgress = ({ value, max, color }: { value: number; max: number; color: string }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(value / max, 1);
  const dashoffset = circumference * (1 - percent);

  return (
    <svg width="52" height="52" viewBox="0 0 52 52">
      <circle
        cx="26"
        cy="26"
        r={radius}
        fill="none"
        stroke="var(--bg-secondary)"
        strokeWidth="5"
      />
      <circle
        cx="26"
        cy="26"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={circumference}
        strokeDashoffset={dashoffset}
        strokeLinecap="round"
        transform="rotate(-90 26 26)"
        style={{ transition: 'stroke-dashoffset 600ms ease-out' }}
      />
      <text
        x="26"
        y="30"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="currentColor"
      >
        {value}
      </text>
    </svg>
  );
};

const FolderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const EyeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function OverviewCards({ stats }: OverviewCardsProps) {
  const cards = [
    {
      icon: <FolderIcon />,
      iconBg: 'rgba(0, 102, 204, 0.12)',
      iconColor: 'var(--color-primary)',
      number: stats.active,
      label: 'Active Projects',
      subtitle: 'Currently in progress',
      showRing: true,
      max: 20,
      ringColor: 'var(--color-primary)',
    },
    {
      icon: <EyeIcon />,
      iconBg: 'rgba(230, 126, 34, 0.12)',
      iconColor: 'var(--warning)',
      number: stats.awaitingReview,
      label: 'Awaiting Review',
      subtitle: 'Waiting for client feedback',
      showRing: false,
    },
    {
      icon: <EditIcon />,
      iconBg: 'rgba(231, 76, 60, 0.12)',
      iconColor: 'var(--alert)',
      number: stats.revisionsRequired,
      label: 'Revisions Required',
      subtitle: 'Need updates',
      showRing: false,
    },
    {
      icon: <CheckIcon />,
      iconBg: 'rgba(39, 174, 96, 0.12)',
      iconColor: 'var(--success)',
      number: stats.readyToPost,
      label: 'Ready to Post',
      subtitle: 'Approved by client',
      showRing: false,
    },
  ];

  return (
    <div className="grid-4 section-gap">
      {cards.map((card, idx) => (
        <div className="overview-card" key={idx}>
          <div
            className="card-icon"
            style={{ background: card.iconBg, color: card.iconColor }}
          >
            {card.icon}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="card-number">{card.number}</div>
              <div className="card-label">{card.label}</div>
              <div className="card-subtitle">{card.subtitle}</div>
            </div>
            {card.showRing && (
              <CircularProgress
                value={card.number}
                max={card.max!}
                color={card.ringColor!}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
