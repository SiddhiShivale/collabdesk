import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'TEAM_LEAD' | 'MEMBER';
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private accessToken: string | null = null;

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) =>
          this.setAuthState(response.accessToken, response.user)
        )
      );
  }

  logout(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/logout`,
      {},
      { responseType: 'text' }
    );
  }

  refreshToken(): Observable<{ accessToken: string }> {
    return this.http
      .post<{ accessToken: string }>(`${this.apiUrl}/refresh`, {})
      .pipe(
        tap((response) => {
          this.accessToken = response.accessToken;
        })
      );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get getAccessToken(): string | null {
    return this.accessToken;
  }

  private setAuthState(token: string, user: User): void {
    this.accessToken = token;
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);

    localStorage.setItem('accessToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private clearAuthState(): void {
    this.accessToken = null;
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
  }
}
