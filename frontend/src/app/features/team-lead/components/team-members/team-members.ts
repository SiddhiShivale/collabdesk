import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Team } from '../../../../core/models/team-model';
import { User } from '../../../../core/models/user-model';
import { TeamService } from '../../../../core/services/team';
import { UserService } from '../../../../core/services/user';

@Component({
  selector: 'app-team-members',
  standalone: false,
  templateUrl: './team-members.html',
  styleUrl: './team-members.css',
})
export class TeamMembersComponent implements OnInit {
  team$!: Observable<Team>;
  pagedMembers$!: Observable<User[]>;

  isConfirmModalVisible = false;
  memberIdToRemove: number | null = null;

  allUsers$!: Observable<User[]>;
  availableUsers$!: Observable<User[]>;
  userSearchControl = new FormControl(null);

  private currentTeam!: Team;
  private refreshTeam$ = new BehaviorSubject<void>(undefined);

  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  pageSizes = [10, 25, 50];
  nameFilter = new FormControl('');
  emailFilter = new FormControl('');

  constructor(
    private teamService: TeamService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadTeamData();
    this.setupUserSearch();
    this.setupMemberFilteringAndPagination();
  }

  loadTeamData(): void {
    this.team$ = this.refreshTeam$.pipe(
      switchMap(() => this.teamService.getMyTeam()),
      tap((team) => (this.currentTeam = team))
    );
  }

  setupUserSearch(): void {
    this.allUsers$ = this.userService.getAllUsers();
    this.availableUsers$ = combineLatest([this.team$, this.allUsers$]).pipe(
      map(([team, allUsers]) => {
        const memberIds = new Set(team.members.map((m) => m.id));
        return allUsers.filter(
          (user) => !memberIds.has(user.id) && user.role !== 'ADMIN'
        );
      })
    );
  }

  setupMemberFilteringAndPagination(): void {
    this.pagedMembers$ = combineLatest([
      this.team$,
      this.nameFilter.valueChanges.pipe(startWith('')),
      this.emailFilter.valueChanges.pipe(startWith('')),
      this.refreshTeam$,
    ]).pipe(
      map(([team, name, email]) => {
        const filteredMembers = team.members.filter(
          (member) =>
            member.name.toLowerCase().includes(name?.toLowerCase() ?? '') &&
            member.email.toLowerCase().includes(email?.toLowerCase() ?? '')
        );
        this.totalElements = filteredMembers.length;
        const startIndex = this.currentPage * this.pageSize;
        return filteredMembers.slice(startIndex, startIndex + this.pageSize);
      })
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.refreshTeam$.next();
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.currentPage = 0;
    this.refreshTeam$.next();
  }

  addMember(): void {
    const userIdToAdd = Number(this.userSearchControl.value);
    if (!userIdToAdd || !this.currentTeam) return;

    this.teamService
      .addMemberToTeam(this.currentTeam.id, userIdToAdd)
      .subscribe(() => {
        this.refreshTeam$.next();
        this.userSearchControl.reset(null);
      });
  }

  removeMember(memberId: number): void {
    if (memberId === this.currentTeam.lead.id) {
      alert('You cannot remove yourself as the Team Lead.');
      return;
    }
    this.memberIdToRemove = memberId;
    this.isConfirmModalVisible = true;
  }

  handleRemovalConfirmation(isConfirmed: boolean): void {
    if (isConfirmed && this.memberIdToRemove) {
      this.teamService
        .removeMemberFromTeam(this.currentTeam.id, this.memberIdToRemove)
        .subscribe(() => this.refreshTeam$.next());
    }
    this.isConfirmModalVisible = false;
    this.memberIdToRemove = null;
  }
}
