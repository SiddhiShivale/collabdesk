export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'TEAM_LEAD' | 'MEMBER';
  enabled: boolean;
  deleted: boolean;
}