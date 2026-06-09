import { useState, useMemo } from 'react';
import type { Project, Stage } from '../types';
import { mockProjects } from '../data/mockData';

export function useProjects(externalSearchQuery?: string) {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [stageFilter, setStageFilter] = useState<Stage | 'all'>('all');
  const [internalSearch, setInternalSearch] = useState('');
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearch;

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesStage = stageFilter === 'all' || p.stage === stageFilter;
      const matchesSearch =
        searchQuery === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStage && matchesSearch;
    });
  }, [projects, stageFilter, searchQuery]);

  const projectsByStage = useMemo(() => {
    const stages: Stage[] = [
      'intake',
      'content-dev',
      'design',
      'presentation',
      'review',
      'revisions',
      'approved',
      'published',
    ];
    const result: Record<Stage, Project[]> = {} as Record<Stage, Project[]>;
    stages.forEach(stage => {
      result[stage] = filteredProjects.filter(p => p.stage === stage);
    });
    return result;
  }, [filteredProjects]);

  const updateProjectStage = (projectId: string, newStage: Stage) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === projectId
          ? {
              ...p,
              stage: newStage,
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : p
      )
    );
  };

  const getProjectById = (id: string) => projects.find(p => p.id === id);

  const stats = useMemo(() => {
    return {
      active: projects.filter(p => !['approved', 'published'].includes(p.stage)).length,
      awaitingReview: projects.filter(p => p.stage === 'review').length,
      revisionsRequired: projects.filter(p => p.stage === 'revisions').length,
      readyToPost: projects.filter(p => p.stage === 'approved').length,
    };
  }, [projects]);

  return {
    projects,
    filteredProjects,
    projectsByStage,
    stageFilter,
    setStageFilter,
    searchQuery,
    setSearchQuery: setInternalSearch,
    updateProjectStage,
    getProjectById,
    stats,
  };
}
