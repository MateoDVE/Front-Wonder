import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/config/api-url';

interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  apellido?: string;
  rol: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = API_BASE_URL;
  private readonly USER_KEY = 'wonder_auth_user';
  private readonly REFRESH_TOKEN_KEY = 'wonder_refresh_token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password });
  }

  signup(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/signup`, { email, password });
  }

  setToken(token: string) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem('access_token', token);
  }

  setRefreshToken(token: string) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  setUser(user: AuthUser) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): AuthUser | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  logout() {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}
