import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../models/team-model';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private baseUrl = 'http://localhost:8080/api/teams';

  constructor(private http: HttpClient) {}

  getAllTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.baseUrl);
  }

  createTeam(teamData: { name: string; teamLeadId: number }): Observable<Team> {
    return this.http.post<Team>(this.baseUrl, teamData);
  }

  updateTeam(
    id: number,
    teamData: { name: string; teamLeadId: number }
  ): Observable<Team> {
    return this.http.put<Team>(`${this.baseUrl}/${id}`, teamData);
  }

  deleteTeam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getMyTeam(): Observable<Team> {
    return this.http.get<Team>(`${this.baseUrl}/my-team`);
  }

  addMemberToTeam(teamId: number, userId: number): Observable<Team> {
    return this.http.post<Team>(`${this.baseUrl}/${teamId}/members`, {
      userId,
    });
  }

  removeMemberFromTeam(teamId: number, userId: number): Observable<Team> {
    return this.http.delete<Team>(
      `${this.baseUrl}/${teamId}/members/${userId}`
    );
  }
}
