import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './auth';

export interface Team {
  id: number;
  name: string;
  lead: User;
  members: User[];
}

export interface TeamCreateDto {
  name: string;
  teamLeadId: number;
}

export interface TeamUpdateDto {
  name: string;
  teamLeadId: number;
}

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private apiUrl = 'http://localhost:8080/api/teams';

  constructor(private http: HttpClient) {}

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl);
  }

  getMyTeam(): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/my-team`);
  }

  createTeam(team: TeamCreateDto): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, team);
  }

  updateTeam(id: number, team: TeamUpdateDto): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/${id}`, team);
  }

  deleteTeam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addMemberToTeam(teamId: number, userId: number): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/${teamId}/members`, { userId });
  }

  removeMemberFromTeam(teamId: number, userId: number): Observable<Team> {
    return this.http.delete<Team>(`${this.apiUrl}/${teamId}/members/${userId}`);
  }
}
