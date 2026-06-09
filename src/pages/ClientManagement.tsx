import { clients } from '../data/mockData';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

const AVATAR_COLORS = [
  '#0066CC', '#6B3FA0', '#1E8A5E', '#C0392B', '#D35400', '#2471A3',
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function daysUntil(dateStr: string) {
  const today = new Date();
  const target = new Date(dateStr);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, color: 'var(--alert)' };
  if (diff === 0) return { label: 'Today', color: 'var(--warning)' };
  if (diff <= 3) return { label: `In ${diff}d`, color: 'var(--warning)' };
  return { label: `In ${diff}d`, color: 'var(--success)' };
}

export default function ClientManagement() {
  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Clients</h1>
        <p className="page-subtitle">Contact directory and follow-up tracker</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 20,
        }}
      >
        {clients.map((client, idx) => {
          const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
          const followUp = daysUntil(client.nextFollowUp);

          return (
            <div key={client.id} className="client-card">

              {/* Client Name + Avatar */}
              <div className="client-card-header">
                <div className="client-card-avatar" style={{ background: color }}>
                  {getInitials(client.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="client-card-name">{client.name}</div>
                  <div className="client-card-email">{client.contactPerson}</div>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: 12,
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-color)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {client.activeProjects} project{client.activeProjects !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'var(--border-color)', margin: '12px 0' }} />

              {/* Contact Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', minWidth: 16 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.37 2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{client.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', minWidth: 16 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{client.email}</span>
                </div>
              </div>

              {/* Follow-up Dates */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  marginBottom: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 2 }}>
                    Last Follow-up
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                    {formatDate(client.lastFollowUp)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 2 }}>
                    Next Follow-up
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                      {formatDate(client.nextFollowUp)}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '1px 7px',
                        borderRadius: 10,
                        background: followUp.color + '22',
                        color: followUp.color,
                      }}
                    >
                      {followUp.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {client.notes && (
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    borderLeft: '3px solid var(--color-primary)',
                    paddingLeft: 10,
                  }}
                >
                  {client.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
