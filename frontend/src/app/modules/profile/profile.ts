import { Component, OnInit } from '@angular/core';
import { ProfileResponseDto, UserService } from '../../core/services/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {

  profile$!: Observable<ProfileResponseDto>;
  
  isEditing = false; 

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.profile$ = this.userService.getProfileDetails();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }
}
