import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Team, TeamService } from '../../../../core/services/team';

@Component({
  selector: 'app-team-list',
  standalone: false,
  templateUrl: './team-list.html',
  styleUrls: ['./team-list.css'],
})
export class TeamListComponent implements OnInit {
  teams$!: Observable<Team[]>;
  isFormModalOpen = false;
  isMembersModalOpen = false;
  selectedTeam: Team | null = null;

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.teams$ = this.teamService.getTeams();
  }
 
  openCreateModal(): void {
    this.selectedTeam = null;
    this.isFormModalOpen = true;
  }

  openEditModal(team: Team): void {
    this.selectedTeam = team;
    this.isFormModalOpen = true;
  }

  openMembersModal(team: Team): void {
    this.selectedTeam = team;
    this.isMembersModalOpen = true;
  }

  closeModals(): void {
    this.isFormModalOpen = false;
    this.isMembersModalOpen = false;
    this.selectedTeam = null;
  }

  handleSuccess(): void {
    this.loadTeams();
    this.closeModals();
  }

  deleteTeam(teamId: number): void {
    if (
      confirm(
        'Are you sure you want to delete this team? This will also unassign its tasks.'
      )
    ) {
      this.teamService.deleteTeam(teamId).subscribe(() => this.loadTeams());
    }
  }
}
