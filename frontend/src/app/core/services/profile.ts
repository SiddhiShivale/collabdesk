import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user-model';

export type Profile = Partial<User>;

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private baseUrl = 'http://localhost:8080/api/profile';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(this.baseUrl);
  }

  updateProfile(name: string): Observable<Profile> {
    return this.http.put<Profile>(this.baseUrl, { name });
  }

  changePassword(payload: {
    currentPassword: string;
    newPassword: string;
  }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/password`, payload);
  }
}
