import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Team, TeamService } from '../../../../core/services/team';
import { UserService } from '../../../../core/services/user';
import { User } from '../../../../core/services/auth';

@Component({
  selector: 'app-team-members',
  standalone: false,
  templateUrl: './team-members.html',
  styleUrls: ['./team-members.css'],
})
export class TeamMembersComponent implements OnInit {
  @Input() team!: Team;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();
  potentialMembers$!: Observable<User[]>;
  selectedUserIdToAdd: number | null = null;

  constructor(
    private teamService: TeamService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadPotentialMembers();
  }

  loadPotentialMembers(): void {
    const memberIds = new Set(this.team.members.map((m) => m.id));
    this.potentialMembers$ = this.userService
      .getUsers()
      .pipe(
        map((allUsers) => allUsers.filter((user) => !memberIds.has(user.id)))
      );
  }

  addMember(): void {
    if (!this.selectedUserIdToAdd) {
      return;
    }

    this.teamService
      .addMemberToTeam(this.team.id, this.selectedUserIdToAdd)
      .subscribe((updatedTeam) => {
        this.team = updatedTeam;
        this.loadPotentialMembers();
        this.selectedUserIdToAdd = null;
      });
  }

  removeMember(userId: number): void {
    if (userId === this.team.lead.id) {
      alert('The team lead cannot be removed from the team.');
      return;
    }

    this.teamService
      .removeMemberFromTeam(this.team.id, userId)
      .subscribe((updatedTeam) => {
        this.team = updatedTeam;
        this.loadPotentialMembers();
      });
  }

  closeAndSignalSuccess(): void {
    this.success.emit();
    this.close.emit();
  }
}
