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
  // Workload per team member — full names on Y axis
  const workloadData = teamMembers.map(m => ({
    name: m.name,
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
        <h1 className="page-title">Team</h1>
        <p className="page-subtitle">Workload overview</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
        }}
        className="charts-grid"
      >
        {/* Workload bar chart */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius)',
            padding: 24,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
            Workload by Team Member
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workloadData} layout="vertical" margin={{ left: 0, right: 20, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis type="number" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} allowDecimals={false} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                width={110}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 8,
                  color: 'var(--text-primary)',
                }}
                formatter={(value) => [`${value} project${value !== 1 ? 's' : ''}`, 'Projects']}
              />
              <Bar dataKey="projects" radius={[0, 4, 4, 0]}>
                {workloadData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Projects by Stage donut */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius)',
            padding: 24,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
            Projects by Stage
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
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
