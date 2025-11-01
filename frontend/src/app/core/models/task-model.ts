import { User } from './user-model';
import { Team } from './team-model';

export type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';
export type Importance = 'LOW' | 'MEDIUM' | 'HIGH';

export interface UserAssignmentStatus {
  userId: number;
  userName: string;
  status: TaskStatus;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  importance: Importance;
  dueDate: string;
  assignments: UserAssignmentStatus[]; 
  creator: User;
  team: Team;
  dependsOn?: Task;
}