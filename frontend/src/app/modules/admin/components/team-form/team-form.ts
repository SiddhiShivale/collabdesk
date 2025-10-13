import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';
import {
  Team,
  TeamCreateDto,
  TeamService,
  TeamUpdateDto,
} from '../../../../core/services/team';
import { User } from '../../../../core/services/auth';
import { UserService } from '../../../../core/services/user';

const TEAM_LEAD_ROLE = 'TEAM_LEAD';

@Component({
  selector: 'app-team-form',
  standalone: false,
  templateUrl: './team-form.html',
  styleUrls: ['../user-form/user-form.css'],
})
export class TeamFormComponent implements OnInit {
  @Input() team: Team | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  teamForm!: FormGroup;
  isEditMode = false;
  users$!: Observable<User[]>;
  teamLeads$!: Observable<User[]>;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.team;
    this.users$ = this.userService.getUsers();
    this.teamLeads$ = this.users$.pipe(
      map((users) => users.filter((user) => user.role === TEAM_LEAD_ROLE))
    );

    this.teamForm = this.fb.group({
      name: [this.team?.name || '', Validators.required],
      teamLeadId: [this.team?.lead.id || null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.teamForm.invalid) {
      return;
    }

    if (this.isEditMode && this.team) {
      const updateDto: TeamUpdateDto = this.teamForm.value;
      this.teamService
        .updateTeam(this.team.id, updateDto)
        .subscribe(() => this.success.emit());
    } else {
      const createDto: TeamCreateDto = this.teamForm.value;
      this.teamService
        .createTeam(createDto)
        .subscribe(() => this.success.emit());
    }
  }
}
