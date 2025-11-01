import { User } from './user-model';

export interface Team {
  id: number;
  name: string;
  lead: User;
  members: User[];
}