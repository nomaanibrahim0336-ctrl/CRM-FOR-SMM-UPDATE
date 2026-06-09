import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { teamMembers, mockProjects } from '../data/mockData';

const COLORS = ['#0066CC', '#E67E22', '#E74C3C', '#27AE60', '#6B3FA0', '#2ECC71', '#F39C12', '#3498DB'];

export default function TeamPerformance() {
  // Workload per team member
  const workloadData = teamMembers.map(m => ({
    name: m.name.split(' ')[0],
    fullName: m.name,
    projects: mockProjects.filter(p => p.assignedTo === m.name).length,
  }));

  // Project status distribution
  const stageCounts: Record<string, number> = {};
  mockProjects.forEach(p => {
    const label = p.stage.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
    stageCounts[label] = (stageCounts[label] || 0) + 1;
  });
  const pieData = Object.entries(stageCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Team Performance</h1>
        <p className="page-subtitle">Monitor workload and project distribution across the team</p>
      </div>

      {/* Team Cards */}
      <div className="grid-4 section-gap">
        {teamMembers.map((member, idx) => {
          const projectsForMember = mockProjects.filter(p => p.assignedTo === member.name);
          const avgProgress = projectsForMember.length
            ? Math.round(projectsForMember.reduce((s, p) => s + p.progress, 0) / projectsForMember.length)
            : 0;
          const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase();
          const color = COLORS[idx % COLORS.length];

          return (
            <div key={member.id} className="team-card">
              <div className="team-card-header">
                <div className="team-avatar" style={{ background: color }}>
                  {initials}
                </div>
                <div>
                  <div className="team-name">{member.name}</div>
                  <div className="team-role">{member.role}</div>
                </div>
              </div>
              <div className="team-stats">
                <span>{projectsForMember.length} projects</span>
                <span>Avg {avgProgress}% done</span>
              </div>
              <div style={{ marginTop: 8 }}>
                <div className="progress-bar-wrap">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${avgProgress}%`, background: color }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid-2 section-gap">
        <div className="chart-card">
          <h3>Projects per Team Member</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={workloadData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis type="number" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 8,
                  color: 'var(--text-primary)',
                }}
                formatter={(value, _name, entry) => [
                  `${value} project${value !== 1 ? 's' : ''}`,
                  (entry?.payload as { fullName?: string })?.fullName || '',
                ]}
              />
              <Bar dataKey="projects" radius={[0, 4, 4, 0]}>
                {workloadData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Project Status Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 8,
                  color: 'var(--text-primary)',
                }}
              />
              <Legend
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
