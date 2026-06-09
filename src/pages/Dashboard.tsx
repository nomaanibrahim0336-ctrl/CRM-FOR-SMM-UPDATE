import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import OverviewCards from '../components/OverviewCards';
import StageFilters from '../components/StageFilters';
import KanbanBoard from '../components/KanbanBoard';
import ProjectDetailPanel from '../components/ProjectDetailPanel';
import type { Project, Stage } from '../types';

interface DashboardProps {
  searchQuery: string;
  setSearchQuery?: (q: string) => void;
}

export default function Dashboard({ searchQuery }: DashboardProps) {
  const {
    projectsByStage,
    stageFilter,
    setStageFilter,
    updateProjectStage,
    stats,
  } = useProjects(searchQuery);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleStageChange = (projectId: string, newStage: Stage) => {
    updateProjectStage(projectId, newStage);
    if (selectedProject?.id === projectId) {
      setSelectedProject(prev =>
        prev ? { ...prev, stage: newStage } : null
      );
    }
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">CRM Dashboard</h1>
        <p className="page-subtitle">Manage and track all client social media projects</p>
      </div>

      <OverviewCards stats={stats} />

      <StageFilters activeFilter={stageFilter} setFilter={setStageFilter} />

      <KanbanBoard
        projectsByStage={projectsByStage}
        onProjectSelect={setSelectedProject}
        onStageChange={handleStageChange}
      />

      <ProjectDetailPanel
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onStageChange={handleStageChange}
      />
    </div>
  );
}
