import { clients, mockProjects } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import type { Stage } from '../types';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

const AVATAR_COLORS = [
  '#0066CC', '#6B3FA0', '#1E8A5E', '#C0392B', '#D35400', '#2471A3',
];

export default function ClientManagement() {
  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Client Management</h1>
        <p className="page-subtitle">Overview of all clients and their active projects</p>
      </div>

      <div className="grid-2 section-gap">
        {clients.map((client, idx) => {
          const clientProjects = mockProjects.filter(p => p.clientId === client.id);
          const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];

          return (
            <div key={client.id} className="client-card">
              <div className="client-card-header">
                <div className="client-card-avatar" style={{ background: color }}>
                  {getInitials(client.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="client-card-name">{client.name}</div>
                  <div className="client-card-email">{client.email}</div>
                </div>
              </div>

              <div className="client-card-stats">
                <span>
                  <strong>{clientProjects.filter(p => !['published'].includes(p.stage)).length}</strong> active projects
                </span>
                <span>·</span>
                <span>
                  <strong>{clientProjects.filter(p => p.stage === 'published').length}</strong> published
                </span>
              </div>

              {clientProjects.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--text-secondary)',
                      marginBottom: 8,
                    }}
                  >
                    Projects
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {clientProjects.map(p => (
                      <div
                        key={p.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          background: 'var(--bg-secondary)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 500,
                              color: 'var(--text-primary)',
                              marginBottom: 2,
                            }}
                          >
                            {p.title}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                            Due {p.deadline} · {p.assignedTo}
                          </div>
                        </div>
                        <StatusBadge stage={p.stage as Stage} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
