import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';
import { Team } from '../../../../core/models/team-model';
import { User } from '../../../../core/models/user-model';
import { TeamService } from '../../../../core/services/team';
import { UserService } from '../../../../core/services/user';

@Component({
  selector: 'app-team-management',
  standalone: false,
  templateUrl: './team-management.html',
  styleUrl: './team-management.css',
})
export class TeamManagementComponent implements OnInit {
  pagedTeams$!: Observable<Team[]>;
  teamLeads$!: Observable<User[]>;

  isConfirmModalVisible = false;
  teamIdToDelete: number | null = null;
  teamForm!: FormGroup;
  isModalVisible = false;
  isEditMode = false;
  currentTeamId: number | null = null;
  isViewModalVisible = false;
  viewingTeam: Team | null = null;
  
  private refresh$ = new BehaviorSubject<void>(undefined);

  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  pageSizes = [10, 25, 50];
  nameFilter = new FormControl('');
  leadFilter = new FormControl('');

  constructor(
    private teamService: TeamService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadTeamLeads();
    this.initializeForm();

    const filters$ = combineLatest([
      this.nameFilter.valueChanges.pipe(startWith(''), debounceTime(300)),
      this.leadFilter.valueChanges.pipe(startWith(''), debounceTime(300)),
    ]).pipe(
      tap(() => this.currentPage = 0)
    );

    this.pagedTeams$ = combineLatest([this.refresh$, filters$]).pipe(
      switchMap(() => this.teamService.getAllTeams()),
      map(teams => {
        const name = this.nameFilter.value || '';
        const lead = this.leadFilter.value || '';

        const filteredTeams = teams.filter(team =>
          team.name.toLowerCase().includes(name.toLowerCase()) &&
          team.lead.name.toLowerCase().includes(lead.toLowerCase())
        );
        this.totalElements = filteredTeams.length;

        const startIndex = this.currentPage * this.pageSize;
        return filteredTeams.slice(startIndex, startIndex + this.pageSize);
      })
    );
  }

  loadTeams(): void {
    this.refresh$.next();
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTeams();
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.currentPage = 0;
    this.loadTeams();
  }

  loadTeamLeads(): void {
    this.teamLeads$ = this.userService.getAllUsers().pipe(
      map(users => users.filter(user => (user.role === 'ADMIN' || user.role === 'TEAM_LEAD') && !user.deleted))
    );
  }

  initializeForm(): void {
    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      teamLeadId: [null, Validators.required]
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.isModalVisible = true;
    this.teamForm.reset();
  }

  openEditModal(team: Team): void {
    this.isEditMode = true;
    this.isModalVisible = true;
    this.currentTeamId = team.id;
    this.teamForm.setValue({
      name: team.name,
      teamLeadId: team.lead.id
    });
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.currentTeamId = null;
  }
  
  openViewModal(team: Team): void {
    this.viewingTeam = team;
    this.isViewModalVisible = true;
  }

  closeViewModal(): void {
    this.isViewModalVisible = false;
    this.viewingTeam = null;
  }

  onSubmit(): void {
    if (this.teamForm.invalid) {
      this.teamForm.markAllAsTouched();
      return;
    }

    const teamData = this.teamForm.value;
    const apiCall$ = this.isEditMode && this.currentTeamId
      ? this.teamService.updateTeam(this.currentTeamId, teamData)
      : this.teamService.createTeam(teamData);

    apiCall$.subscribe(() => {
      this.loadTeams(); 
      this.closeModal();
    });
  }

  deleteTeam(teamId: number): void {
    this.teamIdToDelete = teamId;
    this.isConfirmModalVisible = true;
  }

  handleDeleteConfirmation(isConfirmed: boolean): void {
    if (isConfirmed && this.teamIdToDelete) {
      this.teamService.deleteTeam(this.teamIdToDelete).subscribe({
        next: () => this.loadTeams(),
        error: (err) => alert(err.error?.message || 'Failed to delete team.')
      });
    }
    this.isConfirmModalVisible = false;
    this.teamIdToDelete = null;
  }
}