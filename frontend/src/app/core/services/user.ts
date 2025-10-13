import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './auth';

export interface UserCreateDto {
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'TEAM_LEAD' | 'MEMBER';
}

export interface UserUpdateDto {
  name: string;
  email: string;
  role: 'ADMIN' | 'TEAM_LEAD' | 'MEMBER';
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';
  private authUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: UserCreateDto): Observable<User> {
    return this.http.post<User>(`${this.authUrl}/register`, user);
  }

  updateUser(id: number, user: UserUpdateDto): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
