import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user-model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(
    this.getUserFromLocalStorage()
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(userInfo: {
    name: string;
    email: string;
    role: string;
  }): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, userInfo);
  }

  setupAccount(token: string, password: string): Observable<any> {
    const payload = { token, password };
    return this.http.post(`${this.baseUrl}/setup-account`, payload, {
      responseType: 'text',
    });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/forgot-password`,
      { email },
      { responseType: 'text' }
    );
  }

  resetPassword(payload: {
    email: string;
    otp: string;
    newPassword: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, payload, {
      responseType: 'text',
    });
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private getUserFromLocalStorage(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  updateCurrentUser(updatedProfile: Partial<User>): void {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      const newUser = { ...currentUser, ...updatedProfile };
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      this.currentUserSubject.next(newUser);
    }
  }
}
