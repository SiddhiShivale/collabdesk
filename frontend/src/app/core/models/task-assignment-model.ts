import { Task } from './task-model';
import { User } from './user-model';
import { TaskStatus } from './task-model';

export interface TaskAssignment {
  id: number;
  task: Task;
  user: User;
  status: TaskStatus;
}