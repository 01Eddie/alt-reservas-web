import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { RegisterPayload } from '../models/user.model';
import { ChangePasswordPayload, ChangePasswordResponse, ForgotPasswordPayload, ForgotPasswordResponse, LoginPayload, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly apiUrl = 'http://localhost:3000/api/auth';
  private readonly tokenKey = 'access_token';
  private isBrowser = typeof window !== 'undefined';

  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((res) => {
        localStorage.setItem(this.tokenKey, res.access_token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // getToken(): string | null {
  //   return localStorage.getItem(this.tokenKey);
  // }

  
  setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem('access_token', token);
    }
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('access_token') : null;
  }

  removeToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
    }
  }

  hasToken(): boolean {
    return this.isBrowser && !!localStorage.getItem('access_token');
  }

  // me(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/me`);
  // }
  getMe(): Observable<{ id: string; name: string; email: string }> {
    return this.http.get<{ id: string; name: string; email: string }>(`${this.apiUrl}/me`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }

  forgotPassword(email: ForgotPasswordPayload): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(`${this.apiUrl}/forgot-password`,  email);
  }

  changePassword(changePwd: ChangePasswordPayload): Observable<ChangePasswordResponse> {
    return this.http.post<ChangePasswordResponse>(`${this.apiUrl}/reset-password`, changePwd);
  }
}
