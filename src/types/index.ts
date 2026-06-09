export type Stage =
  | 'intake'
  | 'content-dev'
  | 'design'
  | 'presentation'
  | 'review'
  | 'revisions'
  | 'approved'
  | 'published';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  projectCount: number;
}

export interface Client {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  activeProjects: number;
  lastFollowUp: string;
  nextFollowUp: string;
  notes: string;
}

export interface ActivityItem {
  id: string;
  date: string;
  time: string;
  action: string;
  by: string;
  note: string;
}

export interface FeedbackItem {
  id: string;
  priority: 'high' | 'medium' | 'low';
  text: string;
}

export interface Project {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  stage: Stage;
  progress: number;
  deadline: string;
  assignedTo: string;
  tags: string[];
  lastUpdated: string;
  createdDate: string;
  projectManager: string;
  activity: ActivityItem[];
  feedback: FeedbackItem[];
  stageHistory: {
    stage: Stage;
    completedDate: string;
    assignedTo: string;
    duration: number;
    notes: string;
  }[];
}
